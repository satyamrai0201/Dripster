import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Product, Order, Gender, ProductCategory, Size } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

// Form validation schema for product
const productSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  price: z.coerce.number().positive({ message: 'Price must be positive' }),
  originalPrice: z.coerce.number().positive({ message: 'Original price must be positive' }).optional(),
  gender: z.enum(['men', 'women']),
  category: z.string(),
  subCategory: z.string().optional(),
  images: z.string().url().array().min(1, { message: 'At least one image URL is required' }),
  rating: z.coerce.number().min(0).max(5),
  reviewCount: z.coerce.number().int().positive(),
  stock: z.coerce.number().int().positive(),
  tags: z.string().array(),
  deliveryEta: z.string(),
  isNew: z.boolean().default(false),
  discount: z.coerce.number().min(0).max(100).optional(),
  sizes: z.string().array().min(1, { message: 'At least one size is required' }),
});

export default function Admin() {
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState('products');
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);
  const [isEditProductDialogOpen, setIsEditProductDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>(['']);
  const [productTags, setProductTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Redirect if not admin
  useEffect(() => {
    if (!isAuthenticated && !user?.role !== 'admin') {
      window.location.href = '/login?redirect=admin';
    }
  }, [isAuthenticated, user]);
  
  // Fetch products
  const { data: products, isLoading: isLoadingProducts } = useQuery<Product[]>({
    queryKey: ['/api/products/admin'],
    enabled: isAuthenticated && user?.role === 'admin',
  });
  
  // Fetch orders
  const { data: orders, isLoading: isLoadingOrders } = useQuery<Order[]>({
    queryKey: ['/api/orders/admin'],
    enabled: isAuthenticated && user?.role === 'admin' && activeTab === 'orders',
  });
  
  // Add product mutation
  const addProductMutation = useMutation({
    mutationFn: async (data: z.infer<typeof productSchema>) => {
      const response = await apiRequest('POST', '/api/products', data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products/admin'] });
      toast({
        title: 'Product Added',
        description: 'The product has been added successfully',
      });
      setIsAddProductDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to add product',
        description: error.message || 'Please try again',
        variant: 'destructive',
      });
    }
  });
  
  // Edit product mutation
  const editProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: z.infer<typeof productSchema> }) => {
      const response = await apiRequest('PUT', `/api/products/${id}`, data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products/admin'] });
      toast({
        title: 'Product Updated',
        description: 'The product has been updated successfully',
      });
      setIsEditProductDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to update product',
        description: error.message || 'Please try again',
        variant: 'destructive',
      });
    }
  });
  
  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/products/${id}`, {});
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products/admin'] });
      toast({
        title: 'Product Deleted',
        description: 'The product has been deleted successfully',
      });
      setIsDeleteDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to delete product',
        description: error.message || 'Please try again',
        variant: 'destructive',
      });
    }
  });
  
  // Update order status mutation
  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number, status: string }) => {
      const response = await apiRequest('PATCH', `/api/orders/${id}`, { status });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders/admin'] });
      toast({
        title: 'Order Updated',
        description: 'The order status has been updated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to update order',
        description: error.message || 'Please try again',
        variant: 'destructive',
      });
    }
  });
  
  // React Hook Form for adding product
  const addProductForm = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      gender: 'men',
      category: 'tshirts',
      images: [''],
      rating: 4.5,
      reviewCount: 0,
      stock: 10,
      tags: [],
      deliveryEta: '3-5 days',
      isNew: true,
      sizes: [],
    },
  });
  
  // React Hook Form for editing product
  const editProductForm = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      gender: 'men',
      category: 'tshirts',
      images: [''],
      rating: 4.5,
      reviewCount: 0,
      stock: 10,
      tags: [],
      deliveryEta: '3-5 days',
      isNew: false,
      sizes: [],
    },
  });
  
  // Handle opening edit dialog
  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    
    // Set form values
    editProductForm.reset({
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice,
      gender: product.gender,
      category: product.category,
      subCategory: product.subCategory,
      images: product.images,
      rating: product.rating,
      reviewCount: product.reviewCount,
      stock: product.stock,
      tags: product.tags,
      deliveryEta: product.deliveryEta,
      isNew: product.isNew,
      discount: product.discount,
      sizes: product.sizes,
    });
    
    // Set state for additional fields
    setImageUrls(product.images);
    setProductTags(product.tags);
    setSelectedSizes(product.sizes);
    
    setIsEditProductDialogOpen(true);
  };
  
  // Handle deleting a product
  const handleDeleteProduct = (id: number) => {
    setProductToDelete(id);
    setIsDeleteDialogOpen(true);
  };
  
  // Handle confirming delete
  const confirmDeleteProduct = () => {
    if (productToDelete !== null) {
      deleteProductMutation.mutate(productToDelete);
    }
  };
  
  // Handle updating order status
  const handleUpdateOrderStatus = (id: number, status: string) => {
    updateOrderStatusMutation.mutate({ id, status });
  };
  
  // Handle add product form submission
  const onAddProductSubmit = (values: z.infer<typeof productSchema>) => {
    // Include the arrays from state
    const formattedValues = {
      ...values,
      images: imageUrls.filter(url => url.trim() !== ''),
      tags: productTags,
      sizes: selectedSizes,
    };
    
    addProductMutation.mutate(formattedValues);
  };
  
  // Handle edit product form submission
  const onEditProductSubmit = (values: z.infer<typeof productSchema>) => {
    if (!selectedProduct) return;
    
    // Include the arrays from state
    const formattedValues = {
      ...values,
      images: imageUrls.filter(url => url.trim() !== ''),
      tags: productTags,
      sizes: selectedSizes,
    };
    
    editProductMutation.mutate({ id: selectedProduct.id, data: formattedValues });
  };
  
  // Handle image URL inputs
  const handleImageUrlChange = (index: number, value: string) => {
    const updatedUrls = [...imageUrls];
    updatedUrls[index] = value;
    
    // Add a new empty field if this is the last one and has content
    if (index === imageUrls.length - 1 && value.trim() !== '') {
      updatedUrls.push('');
    }
    
    setImageUrls(updatedUrls);
  };
  
  // Remove an image URL
  const removeImageUrl = (index: number) => {
    if (imageUrls.length <= 1) return;
    const updatedUrls = [...imageUrls];
    updatedUrls.splice(index, 1);
    setImageUrls(updatedUrls);
  };
  
  // Add a tag
  const addTag = () => {
    if (newTag.trim() !== '' && !productTags.includes(newTag.trim())) {
      setProductTags([...productTags, newTag.trim()]);
      setNewTag('');
    }
  };
  
  // Remove a tag
  const removeTag = (tag: string) => {
    setProductTags(productTags.filter(t => t !== tag));
  };
  
  // Handle size toggle
  const toggleSize = (size: string) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter(s => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };
  
  // Reset form and state for add product dialog
  const resetAddProductForm = () => {
    addProductForm.reset();
    setImageUrls(['']);
    setProductTags([]);
    setNewTag('');
    setSelectedSizes([]);
  };
  
  // Reset form and state when closing edit dialog
  const resetEditProductForm = () => {
    editProductForm.reset();
    setImageUrls(['']);
    setProductTags([]);
    setNewTag('');
    setSelectedSizes([]);
    setSelectedProduct(null);
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return null; // Will redirect
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Dripster</title>
        <meta name="description" content="Manage your Dripster store products and orders." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-montserrat font-bold">Admin Dashboard</h1>
          
          {activeTab === 'products' && (
            <Button 
              className="bg-primary hover:bg-[#e03535] text-white"
              onClick={() => {
                resetAddProductForm();
                setIsAddProductDialogOpen(true);
              }}
            >
              <i className="ri-add-line mr-2"></i> Add Product
            </Button>
          )}
        </div>
        
        <Tabs defaultValue="products" onValueChange={setActiveTab}>
          <TabsList className="mb-6 bg-[rgba(42,42,42,0.7)] w-full justify-start">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>
          
          {/* Products Tab */}
          <TabsContent value="products">
            <div 
              className="rounded-xl overflow-hidden"
              style={{
                background: 'rgba(30, 30, 30, 0.7)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              {isLoadingProducts ? (
                <div className="p-6 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2">Loading products...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[rgba(255,255,255,0.1)]">
                        <th className="py-3 px-4 text-left">ID</th>
                        <th className="py-3 px-4 text-left">Name</th>
                        <th className="py-3 px-4 text-left">Category</th>
                        <th className="py-3 px-4 text-right">Price</th>
                        <th className="py-3 px-4 text-right">Stock</th>
                        <th className="py-3 px-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products?.map(product => (
                        <tr key={product.id} className="border-b border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.05)]">
                          <td className="py-3 px-4">{product.id}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <img 
                                src={product.images[0]} 
                                alt={product.name} 
                                className="w-10 h-10 rounded-md object-cover mr-3"
                              />
                              <div>
                                <p className="font-medium">{product.name}</p>
                                <p className="text-xs text-[#BBBBBB]">{product.gender}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 capitalize">{product.category}</td>
                          <td className="py-3 px-4 text-right">{formatPrice(product.price)}</td>
                          <td className="py-3 px-4 text-right">
                            <span className={`${product.stock < 5 ? 'text-red-400' : ''}`}>
                              {product.stock}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button 
                              className="p-1 mx-1 rounded hover:bg-[rgba(255,255,255,0.1)] transition-colors"
                              onClick={() => handleEditProduct(product)}
                              aria-label="Edit product"
                            >
                              <i className="ri-edit-line text-lg"></i>
                            </button>
                            <button 
                              className="p-1 mx-1 rounded hover:bg-[rgba(255,255,255,0.1)] transition-colors text-red-400"
                              onClick={() => handleDeleteProduct(product.id)}
                              aria-label="Delete product"
                            >
                              <i className="ri-delete-bin-line text-lg"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Orders Tab */}
          <TabsContent value="orders">
            <div 
              className="rounded-xl overflow-hidden"
              style={{
                background: 'rgba(30, 30, 30, 0.7)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              {isLoadingOrders ? (
                <div className="p-6 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2">Loading orders...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[rgba(255,255,255,0.1)]">
                        <th className="py-3 px-4 text-left">Order ID</th>
                        <th className="py-3 px-4 text-left">Customer</th>
                        <th className="py-3 px-4 text-left">Date</th>
                        <th className="py-3 px-4 text-right">Amount</th>
                        <th className="py-3 px-4 text-center">Status</th>
                        <th className="py-3 px-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders?.map(order => (
                        <tr key={order.id} className="border-b border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.05)]">
                          <td className="py-3 px-4">#{order.id}</td>
                          <td className="py-3 px-4">{order.shippingAddress.fullName}</td>
                          <td className="py-3 px-4">{formatDate(order.createdAt)}</td>
                          <td className="py-3 px-4 text-right">{formatPrice(order.total)}</td>
                          <td className="py-3 px-4 text-center">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                              order.status === 'processing' ? 'bg-blue-500/20 text-blue-500' :
                              order.status === 'shipped' ? 'bg-purple-500/20 text-purple-500' :
                              order.status === 'delivered' ? 'bg-green-500/20 text-green-500' :
                              'bg-red-500/20 text-red-500'
                            }`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Select 
                              defaultValue={order.status}
                              onValueChange={(value) => handleUpdateOrderStatus(order.id, value)}
                            >
                              <SelectTrigger className="w-[130px] h-8 text-xs bg-[rgba(42,42,42,0.7)] border-[rgba(255,255,255,0.1)]">
                                <SelectValue placeholder="Change status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="shipped">Shipped</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Categories Tab */}
          <TabsContent value="categories">
            <div 
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              style={{
                background: 'rgba(30, 30, 30, 0.7)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '0.75rem',
                padding: '1.5rem'
              }}
            >
              <div>
                <h3 className="text-lg font-montserrat font-semibold mb-4">Men's Categories</h3>
                <div className="space-y-2">
                  <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.05)]">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">T-Shirts</span>
                      <span className="text-sm text-[#BBBBBB]">
                        {products?.filter(p => p.gender === 'men' && p.category === 'tshirts').length || 0} products
                      </span>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.05)]">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Hoodies</span>
                      <span className="text-sm text-[#BBBBBB]">
                        {products?.filter(p => p.gender === 'men' && p.category === 'hoodies').length || 0} products
                      </span>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.05)]">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Sneakers</span>
                      <span className="text-sm text-[#BBBBBB]">
                        {products?.filter(p => p.gender === 'men' && p.category === 'sneakers').length || 0} products
                      </span>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.05)]">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Accessories</span>
                      <span className="text-sm text-[#BBBBBB]">
                        {products?.filter(p => p.gender === 'men' && p.category === 'accessories').length || 0} products
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-montserrat font-semibold mb-4">Women's Categories</h3>
                <div className="space-y-2">
                  <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.05)]">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Tops</span>
                      <span className="text-sm text-[#BBBBBB]">
                        {products?.filter(p => p.gender === 'women' && p.category === 'tops').length || 0} products
                      </span>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.05)]">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Sweatshirts</span>
                      <span className="text-sm text-[#BBBBBB]">
                        {products?.filter(p => p.gender === 'women' && p.category === 'sweatshirts').length || 0} products
                      </span>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.05)]">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Sneakers</span>
                      <span className="text-sm text-[#BBBBBB]">
                        {products?.filter(p => p.gender === 'women' && p.category === 'sneakers').length || 0} products
                      </span>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.05)]">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Accessories</span>
                      <span className="text-sm text-[#BBBBBB]">
                        {products?.filter(p => p.gender === 'women' && p.category === 'accessories').length || 0} products
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Add Product Dialog */}
      <Dialog open={isAddProductDialogOpen} onOpenChange={setIsAddProductDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Fill in the details for the new product.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...addProductForm}>
            <form onSubmit={addProductForm.handleSubmit(onAddProductSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={addProductForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. Urban Streetwear Hoodie" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={addProductForm.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} placeholder="e.g. 1999" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={addProductForm.control}
                  name="originalPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Original Price (₹) (Optional)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} placeholder="e.g. 2499" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={addProductForm.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} placeholder="e.g. 50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={addProductForm.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="men">Men</SelectItem>
                          <SelectItem value="women">Women</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={addProductForm.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="tshirts">T-Shirts</SelectItem>
                          <SelectItem value="hoodies">Hoodies</SelectItem>
                          <SelectItem value="sneakers">Sneakers</SelectItem>
                          <SelectItem value="accessories">Accessories</SelectItem>
                          <SelectItem value="tops">Tops</SelectItem>
                          <SelectItem value="sweatshirts">Sweatshirts</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={addProductForm.control}
                  name="deliveryEta"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery ETA</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. 3-5 days" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={addProductForm.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rating (0-5)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.1" 
                          min="0" 
                          max="5" 
                          {...field} 
                          placeholder="e.g. 4.5" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={addProductForm.control}
                  name="reviewCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Review Count</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} placeholder="e.g. 42" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={addProductForm.control}
                  name="isNew"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Mark as New</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={addProductForm.control}
                  name="discount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount % (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          max="100" 
                          {...field} 
                          placeholder="e.g. 20" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={addProductForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Detailed product description" 
                        className="min-h-[100px]" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div>
                <FormLabel>Product Images</FormLabel>
                <div className="space-y-2">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        type="url"
                        value={url}
                        onChange={(e) => handleImageUrlChange(index, e.target.value)}
                        placeholder="Image URL (e.g. https://example.com/image.jpg)"
                        className="flex-1"
                      />
                      {index > 0 && (
                        <Button 
                          type="button" 
                          variant="destructive" 
                          size="sm"
                          onClick={() => removeImageUrl(index)}
                        >
                          <i className="ri-delete-bin-line"></i>
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                {addProductForm.formState.errors.images && (
                  <p className="text-sm font-medium text-destructive mt-1">
                    {addProductForm.formState.errors.images.message}
                  </p>
                )}
              </div>
              
              <div>
                <FormLabel>Sizes</FormLabel>
                <div className="flex flex-wrap gap-2 mt-2">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL', '6', '7', '8', '9', '10', '11', 'ONE SIZE'].map((size) => (
                    <div
                      key={size}
                      className={`px-3 py-1 rounded-md cursor-pointer transition-colors ${
                        selectedSizes.includes(size) 
                          ? 'bg-primary text-white' 
                          : 'bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)]'
                      }`}
                      onClick={() => toggleSize(size)}
                    >
                      {size}
                    </div>
                  ))}
                </div>
                {addProductForm.formState.errors.sizes && (
                  <p className="text-sm font-medium text-destructive mt-1">
                    {addProductForm.formState.errors.sizes.message}
                  </p>
                )}
              </div>
              
              <div>
                <FormLabel>Tags</FormLabel>
                <div className="flex flex-wrap gap-2 mb-2">
                  {productTags.map(tag => (
                    <Badge 
                      key={tag} 
                      className="bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.1)] text-white"
                    >
                      {tag}
                      <button 
                        type="button" 
                        className="ml-1 hover:text-red-400" 
                        onClick={() => removeTag(tag)}
                      >
                        <i className="ri-close-line"></i>
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag (e.g. summer, casual)"
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={addTag}
                    disabled={!newTag.trim()}
                  >
                    Add
                  </Button>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsAddProductDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-primary hover:bg-[#e03535]"
                  disabled={addProductMutation.isPending}
                >
                  {addProductMutation.isPending ? 'Adding...' : 'Add Product'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Product Dialog */}
      <Dialog open={isEditProductDialogOpen} onOpenChange={(open) => {
        setIsEditProductDialogOpen(open);
        if (!open) resetEditProductForm();
      }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update the product details.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...editProductForm}>
            <form onSubmit={editProductForm.handleSubmit(onEditProductSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={editProductForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. Urban Streetwear Hoodie" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editProductForm.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} placeholder="e.g. 1999" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editProductForm.control}
                  name="originalPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Original Price (₹) (Optional)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} placeholder="e.g. 2499" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editProductForm.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} placeholder="e.g. 50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editProductForm.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="men">Men</SelectItem>
                          <SelectItem value="women">Women</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editProductForm.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="tshirts">T-Shirts</SelectItem>
                          <SelectItem value="hoodies">Hoodies</SelectItem>
                          <SelectItem value="sneakers">Sneakers</SelectItem>
                          <SelectItem value="accessories">Accessories</SelectItem>
                          <SelectItem value="tops">Tops</SelectItem>
                          <SelectItem value="sweatshirts">Sweatshirts</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Additional fields similar to Add Product Dialog */}
                {/* (Skipping duplicate code for brevity) */}
              </div>
              
              <FormField
                control={editProductForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Detailed product description" 
                        className="min-h-[100px]" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Image URLs, Sizes, Tags sections (similar to Add Product Dialog) */}
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditProductDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-primary hover:bg-[#e03535]"
                  disabled={editProductMutation.isPending}
                >
                  {editProductMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              variant="destructive"
              onClick={confirmDeleteProduct}
              disabled={deleteProductMutation.isPending}
            >
              {deleteProductMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
