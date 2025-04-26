import { InsertProduct } from "@shared/schema";

export function getProductsData(): InsertProduct[] {
  return [
    // MEN'S T-SHIRTS
    {
      name: "Urban Streetwear T-Shirt",
      description: "Premium urban streetwear t-shirt crafted from high-quality cotton. Features a relaxed fit and unique graphic print. Perfect for everyday casual wear.",
      images: [
        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1562157873-818bc0726f68?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80"
      ],
      price: 1499,
      originalPrice: 1799,
      gender: "men",
      category: "tshirts",
      sizes: ["S", "M", "L", "XL", "XXL"],
      rating: 4.8,
      reviewCount: 142,
      stock: 50,
      tags: ["streetwear", "urban", "casual", "cotton"],
      deliveryEta: "3-5 days",
      isNew: true,
      discount: 17
    },
    {
      name: "Minimalist Logo T-Shirt",
      description: "Clean and simple design with our subtle logo. Made from breathable cotton that's perfect for all-day comfort. A versatile addition to any wardrobe.",
      images: [
        "https://images.unsplash.com/photo-1581655353564-df123a1eb820?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80"
      ],
      price: 1299,
      gender: "men",
      category: "tshirts",
      sizes: ["S", "M", "L", "XL"],
      rating: 4.6,
      reviewCount: 98,
      stock: 75,
      tags: ["minimalist", "logo", "essentials", "cotton"],
      deliveryEta: "2-4 days"
    },
    {
      name: "Graphic Print Oversized Tee",
      description: "Oversized fit with bold graphic print. Features dropped shoulders and a longer back hem. Perfect for creating a standout streetwear look.",
      images: [
        "https://images.unsplash.com/photo-1503341504253-dff4815485f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1526476862921-1b88ba36a2b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1571945153237-4929e783af4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80"
      ],
      price: 1799,
      originalPrice: 2299,
      gender: "men",
      category: "tshirts",
      sizes: ["M", "L", "XL", "XXL"],
      rating: 4.5,
      reviewCount: 67,
      stock: 40,
      tags: ["oversized", "graphic", "streetwear", "urban"],
      deliveryEta: "3-5 days",
      discount: 22
    },
    {
      name: "Premium Cotton Basic Tee",
      description: "Crafted from premium combed cotton for exceptional softness and durability. Features a classic regular fit with reinforced neckline for lasting quality.",
      images: [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1602810318660-d2c46b750f88?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80"
      ],
      price: 1199,
      gender: "men",
      category: "tshirts",
      sizes: ["S", "M", "L", "XL", "XXL"],
      rating: 4.7,
      reviewCount: 215,
      stock: 120,
      tags: ["basic", "premium", "cotton", "essentials"],
      deliveryEta: "2-4 days",
      isNew: true
    },
    {
      name: "Retro Stripe Tee",
      description: "Vintage-inspired design with contrast chest stripe. Made from cotton blend fabric for comfort with a touch of stretch. Perfect for casual outings.",
      images: [
        "https://images.unsplash.com/photo-1559334417-a57bd929f003?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1566677379713-63fbe55dfbf4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80"
      ],
      price: 1599,
      originalPrice: 1799,
      gender: "men",
      category: "tshirts",
      sizes: ["S", "M", "L", "XL"],
      rating: 4.4,
      reviewCount: 76,
      stock: 35,
      tags: ["retro", "stripe", "vintage", "casual"],
      deliveryEta: "3-5 days",
      discount: 11
    },

    // MEN'S HOODIES
    {
      name: "Urban Streetwear Hoodie",
      description: "Premium urban streetwear hoodie crafted from high-quality cotton blend. Features a relaxed fit, kangaroo pocket, and adjustable drawstring hood. Perfect for layering in any season.",
      images: [
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1548126032-079a0fb0099d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1565693413579-8a400abe4805?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80"
      ],
      price: 3499,
      originalPrice: 4299,
      gender: "men",
      category: "hoodies",
      sizes: ["S", "M", "L", "XL", "XXL"],
      rating: 4.9,
      reviewCount: 187,
      stock: 45,
      tags: ["hoodie", "streetwear", "urban", "comfort"],
      deliveryEta: "3-5 days",
      discount: 19
    },
    {
      name: "Minimalist Logo Hoodie",
      description: "Clean design with subtle logo embroidery. Made from heavyweight fleece for superior warmth and softness. Features adjustable hood and spacious front pocket.",
      images: [
        "https://images.unsplash.com/photo-1509942774463-acf339cf87d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1560060141-7b9018741ced?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1590999659195-e64a988eaf9f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80"
      ],
      price: 2999,
      gender: "men",
      category: "hoodies",
      sizes: ["S", "M", "L", "XL"],
      rating: 4.7,
      reviewCount: 135,
      stock: 60,
      tags: ["minimalist", "logo", "essentials", "comfort"],
      deliveryEta: "2-4 days"
    },
    {
      name: "Tech Fleece Zip-Up Hoodie",
      description: "Advanced tech fleece material that's lightweight yet warm. Full zip design with ergonomic seams for improved mobility. Perfect for active lifestyles.",
      images: [
        "https://images.unsplash.com/photo-1611707387946-f1a94241b274?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1601063476271-a159c71ab0b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1578763460789-324a13922e24?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80"
      ],
      price: 3999,
      originalPrice: 4599,
      gender: "men",
      category: "hoodies",
      sizes: ["M", "L", "XL", "XXL"],
      rating: 4.8,
      reviewCount: 94,
      stock: 30,
      tags: ["tech", "zip-up", "sport", "active"],
      deliveryEta: "3-5 days",
      discount: 13
    },
    {
      name: "Vintage Wash Oversized Hoodie",
      description: "Relaxed, oversized fit with vintage wash treatment for a lived-in look. Features dropped shoulders and extra-soft brushed interior for ultimate comfort.",
      images: [
        "https://images.unsplash.com/photo-1647923010883-fb8e052532d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1516826957135-700dedea698c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80"
      ],
      price: 3799,
      gender: "men",
      category: "hoodies",
      sizes: ["S", "M", "L", "XL"],
      rating: 4.6,
      reviewCount: 108,
      stock: 40,
      tags: ["vintage", "oversized", "casual", "streetwear"],
      deliveryEta: "3-5 days",
      isNew: true
    },
    {
      name: "Graphic Print Pullover Hoodie",
      description: "Bold graphic print on front and back. Classic pullover design with ribbed cuffs and hem for better fit. Soft-touch cotton blend fabric for everyday comfort.",
      images: [
        "https://images.unsplash.com/photo-1597843797221-e34b4c5b3080?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1602523641751-d18bd22dd51a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1594761051755-8123159f38e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80"
      ],
      price: 3299,
      originalPrice: 3799,
      gender: "men",
      category: "hoodies",
      sizes: ["M", "L", "XL", "XXL"],
      rating: 4.5,
      reviewCount: 82,
      stock: 35,
      tags: ["graphic", "print", "pullover", "casual"],
      deliveryEta: "3-5 days",
      discount: 13
    },

    // MEN'S SNEAKERS
    {
      name: "Urban Runner Sneakers",
      description: "Premium sneakers designed for urban exploration. Features responsive cushioning, breathable mesh upper, and durable rubber outsole for traction and comfort throughout the day.",
      images: [
        "https://images.unsplash.com/photo-1552346154-21d32810aba3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1543508282-6319a3e2621f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1539185441755-769473a23570?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80"
      ],
      price: 5999,
      originalPrice: 6999,
      gender: "men",
      category: "sneakers",
      sizes: ["7", "8", "9", "10", "11", "12"],
      rating: 4.8,
      reviewCount: 216,
      stock: 30,
      tags: ["sneakers", "urban", "comfort", "runners"],
      deliveryEta: "3-5 days",
      discount: 14
    },
    {
      name: "Classic Canvas Low-Tops",
      description: "Timeless canvas sneakers with classic silhouette. Features durable canvas upper, reinforced stitching, and comfortable insole. Perfect for everyday casual wear.",
      images: [
        "https://images.unsplash.com/photo-1556048219-bb6978360b84?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80"
      ],
      price: 2499,
      gender: "men",
      category: "sneakers",
      sizes: ["7", "8", "9", "10", "11"],
      rating: 4.5,
      reviewCount: 184,
      stock: 45,
      tags: ["canvas", "classic", "low-top", "casual"],
      deliveryEta: "2-4 days"
    },
    {
      name: "High-Performance Basketball Shoes",
      description: "Designed for serious players with advanced ankle support and impact cushioning. Features lightweight synthetic upper, responsive midsole, and multi-directional traction pattern.",
      images: [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1514989940723-e8e51635b782?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80"
      ],
      price: 7999,
      originalPrice: 9499,
      gender: "men",
      category: "sneakers",
      sizes: ["8", "9", "10", "11", "12"],
      rating: 4.9,
      reviewCount: 135,
      stock: 25,
      tags: ["basketball", "performance", "sport", "high-top"],
      deliveryEta: "4-6 days",
      discount: 16
    },
    {
      name: "Retro Suede Trainers",
      description: "Vintage-inspired design with premium suede upper and contrasting details. Features cushioned footbed and flexible rubber outsole for all-day comfort.",
      images: [
        "https://images.unsplash.com/photo-1605348532760-6753d2c43329?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1560343090-f0409e92791a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1543508282-5c1f427f023f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80"
      ],
      price: 4499,
      gender: "men",
      category: "sneakers",
      sizes: ["7", "8", "9", "10", "11"],
      rating: 4.6,
      reviewCount: 98,
      stock: 35,
      tags: ["retro", "suede", "vintage", "trainers"],
      deliveryEta: "3-5 days"
    },
    {
      name: "Minimalist Knit Runners",
      description: "Ultralight knit construction for breathable comfort. Features sock-like fit, cushioned midsole, and flexible outsole. Perfect for running or casual wear.",
      images: [
        "https://images.unsplash.com/photo-1588361861040-ac9b1018f6d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1491553895911-0055eca6402d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1606800052052-a08af7148866?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80"
      ],
      price: 6499,
      originalPrice: 7299,
      gender: "men",
      category: "sneakers",
      sizes: ["8", "9", "10", "11"],
      rating: 4.7,
      reviewCount: 147,
      stock: 30,
      tags: ["knit", "runners", "lightweight", "minimalist"],
      deliveryEta: "3-5 days",
      discount: 11,
      isNew: true
    },

    // MEN'S ACCESSORIES
    {
      name: "Urban Streetwear Cap",
      description: "Premium six-panel cap with embroidered logo. Features adjustable snapback for perfect fit and embroidered eyelets for ventilation. Complete your streetwear look.",
      images: [
        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1598032895397-b9472444bf93?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1521369909029-2afed882baee?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80"
      ],
      price: 1499,
      gender: "men",
      category: "accessories",
      subCategory: "caps",
      sizes: ["ONE SIZE"],
      rating: 4.5,
      reviewCount: 92,
      stock: 50,
      tags: ["cap", "streetwear", "snapback", "urban"],
      deliveryEta: "2-4 days"
    },
    {
      name: "Streetwear Sunglasses",
      description: "Bold and stylish sunglasses with UV400 protection. Features durable acetate frame, metal hinges, and polarized lenses to reduce glare. The perfect accent for your outfit.",
      images: [
        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1577803645773-f96470509666?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80"
      ],
      price: 1199,
      originalPrice: 1499,
      gender: "men",
      category: "accessories",
      subCategory: "sunglasses",
      sizes: ["ONE SIZE"],
      rating: 4.6,
      reviewCount: 118,
      stock: 40,
      tags: ["sunglasses", "polarized", "accessories", "streetwear"],
      deliveryEta: "2-4 days",
      discount: 20
    },
    {
      name: "Genuine Leather Belt",
      description: "High-quality genuine leather belt with matte black buckle. Features durable construction and clean minimalist design. Perfect for both casual and formal outfits.",
      images: [
        "https://images.unsplash.com/photo-1592878849122-facb97520f9e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1624222247344-550fb60fe8b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80"
      ],
      price: 1999,
      gender: "men",
      category: "accessories",
      subCategory: "belts",
      sizes: ["S", "M", "L", "XL"],
      rating: 4.7,
      reviewCount: 85,
      stock: 35,
      tags: ["belt", "leather", "accessories", "minimalist"],
      deliveryEta: "3-5 days"
    },
    {
      name: "Minimalist Watch",
      description: "Elegant timepiece with clean dial design and premium stainless steel case. Features Japanese quartz movement, scratch-resistant glass, and water resistance to 5ATM.",
      images: [
        "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1539874754764-5a96559165b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80"
      ],
      price: 4999,
      originalPrice: 5999,
      gender: "men",
      category: "accessories",
      subCategory: "watches",
      sizes: ["ONE SIZE"],
      rating: 4.8,
      reviewCount: 156,
      stock: 25,
      tags: ["watch", "minimalist", "accessories", "premium"],
      deliveryEta: "4-6 days",
      discount: 17
    },
    {
      name: "Urban Backpack",
      description: "Versatile backpack perfect for daily commute or weekend adventures. Features water-resistant material, padded laptop compartment, multiple pockets, and comfortable shoulder straps.",
      images: [
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1546938576-6e6a64f317cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80"
      ],
      price: 2799,
      gender: "men",
      category: "accessories",
      subCategory: "bags",
      sizes: ["ONE SIZE"],
      rating: 4.6,
      reviewCount: 128,
      stock: 30,
      tags: ["backpack", "urban", "accessories", "everyday"],
      deliveryEta: "3-5 days",
      isNew: true
    },

    // WOMEN'S TOPS
    {
      name: "Stylish Crop Top",
      description: "Trendy crop top with modern silhouette. Made from soft stretch fabric for a comfortable fit. Perfect for pairing with high-waisted bottoms for a fashionable look.",
      images: [
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1554568218-0f1715e72254?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80"
      ],
      price: 1299,
      originalPrice: 1599,
      gender: "women",
      category: "tops",
      sizes: ["XS", "S", "M", "L"],
      rating: 4.7,
      reviewCount: 145,
      stock: 60,
      tags: ["crop top", "trendy", "stretch", "casual"],
      deliveryEta: "2-4 days",
      discount: 19,
      isNew: true
    },
    {
      name: "Casual Graphic Tee",
      description: "Relaxed-fit tee with trendy graphic print. Made from soft cotton jersey for all-day comfort. A versatile addition to your casual wardrobe.",
      images: [
        "https://images.unsplash.com/photo-1616627561950-9f746e330187?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1588117305388-c2631a279f82?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80"
      ],
      price: 999,
      gender: "women",
      category: "tops",
      sizes: ["XS", "S", "M", "L", "XL"],
      rating: 4.5,
      reviewCount: 98,
      stock: 75,
      tags: ["graphic", "tee", "casual", "cotton"],
      deliveryEta: "2-4 days"
    },
    {
      name: "Sleeveless Ribbed Tank",
      description: "Form-fitting ribbed tank with modern high neckline. Made from premium stretch fabric that holds its shape. Perfect for layering or wearing alone.",
      images: [
        "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80"
      ],
      price: 899,
      originalPrice: 1099,
      gender: "women",
      category: "tops",
      sizes: ["XS", "S", "M", "L"],
      rating: 4.4,
      reviewCount: 86,
      stock: 55,
      tags: ["tank", "ribbed", "basic", "layering"],
      deliveryEta: "2-4 days",
      discount: 18
    },
    {
      name: "Oversized Button-Up Shirt",
      description: "Relaxed-fit button-up with dropped shoulders and longer back hem. Made from lightweight material perfect for effortless layering. A modern wardrobe essential.",
      images: [
        "https://images.unsplash.com/photo-1518481852452-9415b262eba4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1551489186-cf8726f514f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80"
      ],
      price: 1799,
      gender: "women",
      category: "tops",
      sizes: ["S", "M", "L", "XL"],
      rating: 4.6,
      reviewCount: 74,
      stock: 40,
      tags: ["oversized", "button-up", "layering", "essential"],
      deliveryEta: "3-5 days"
    },
    {
      name: "Off-Shoulder Knit Top",
      description: "Elegant off-shoulder design with ribbed texture. Made from soft knit fabric with just the right amount of stretch. Perfect for evening outings or dressed-down elegance.",
      images: [
        "https://images.unsplash.com/photo-1602078013024-3630551c60c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1603570388470-97046665dc25?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80"
      ],
      price: 1599,
      originalPrice: 1899,
      gender: "women",
      category: "tops",
      sizes: ["XS", "S", "M", "L"],
      rating: 4.7,
      reviewCount: 112,
      stock: 35,
      tags: ["off-shoulder", "knit", "elegant", "versatile"],
      deliveryEta: "3-5 days",
      discount: 16,
      isNew: true
    },

    // WOMEN'S SWEATSHIRTS
    {
      name: "Oversized Logo Sweatshirt",
      description: "Relaxed-fit sweatshirt with stylish logo print. Made from soft cotton blend fleece for exceptional comfort. Perfect for casual outings or lounging at home.",
      images: [
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1551163943-3f7253a917b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80"
      ],
      price: 2499,
      originalPrice: 2999,
      gender: "women",
      category: "sweatshirts",
      sizes: ["S", "M", "L", "XL"],
      rating: 4.8,
      reviewCount: 136,
      stock: 45,
      tags: ["oversized", "logo", "sweatshirt", "fleece"],
      deliveryEta: "3-5 days",
      discount: 17
    },
    {
      name: "Cropped Hoodie",
      description: "Stylish cropped-length hoodie with drawstring hood. Made from soft brushed fleece with ribbed cuffs and hem. Perfect for pairing with high-waisted bottoms.",
      images: [
        "https://images.unsplash.com/photo-1578897366546-16cd7bc99a7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1554194802-814ef29d5935?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80"
      ],
      price: 2299,
      gender: "women",
      category: "sweatshirts",
      sizes: ["XS", "S", "M", "L"],
      rating: 4.7,
      reviewCount: 92,
      stock: 50,
      tags: ["cropped", "hoodie", "casual", "fleece"],
      deliveryEta: "2-4 days"
    },
    {
      name: "Vintage Wash Crewneck",
      description: "Classic crewneck sweatshirt with vintage wash treatment. Features relaxed fit and soft brushed interior for maximum comfort. Perfect for everyday casual style.",
      images: [
        "https://images.unsplash.com/photo-1516243975857-eb3e4c6a41dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1636022459055-6d868f783c88?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1631541911232-5d7160abe0d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80"
      ],
      price: 2199,
      originalPrice: 2599,
      gender: "women",
      category: "sweatshirts",
      sizes: ["S", "M", "L", "XL"],
      rating: 4.5,
      reviewCount: 78,
      stock: 40,
      tags: ["vintage", "crewneck", "washed", "casual"],
      deliveryEta: "3-5 days",
      discount: 15
    },
    {
      name: "Half-Zip Fleece Pullover",
      description: "Versatile half-zip design with stand collar. Made from premium fleece that's soft to the touch and retains warmth. Perfect for transitional weather.",
      images: [
        "https://images.unsplash.com/photo-1625908322933-e463e2f97adf?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1622122201714-77da0ca8e5d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1622122202438-c1a88fdb4257?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80"
      ],
      price: 2699,
      gender: "women",
      category: "sweatshirts",
      sizes: ["XS", "S", "M", "L"],
      rating: 4.6,
      reviewCount: 104,
      stock: 35,
      tags: ["half-zip", "fleece", "pullover", "casual"],
      deliveryEta: "3-5 days",
      isNew: true
    },
    {
      name: "Graphic Print Oversized Sweatshirt",
      description: "Statement sweatshirt with bold graphic print. Features dropped shoulders and relaxed fit for the ultimate comfort. Made from premium cotton blend fleece.",
      images: [
        "https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1642833707581-07327f702cae?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80"
      ],
      price: 2599,
      originalPrice: 2999,
      gender: "women",
      category: "sweatshirts",
      sizes: ["S", "M", "L", "XL"],
      rating: 4.7,
      reviewCount: 88,
      stock: 30,
      tags: ["graphic", "oversized", "sweatshirt", "statement"],
      deliveryEta: "3-5 days",
      discount: 13
    },

    // WOMEN'S SNEAKERS
    {
      name: "Chunky Platform Sneakers",
      description: "Statement sneakers with elevated platform sole. Features premium leather upper, cushioned footbed, and durable rubber outsole. Perfect for adding height and style to any outfit.",
      images: [
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1554563251-d7573f3489c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80"
      ],
      price: 4999,
      originalPrice: 5799,
      gender: "women",
      category: "sneakers",
      sizes: ["6", "7", "8", "9", "10"],
      rating: 4.7,
      reviewCount: 152,
      stock: 35,
      tags: ["platform", "chunky", "statement", "sneakers"],
      deliveryEta: "3-5 days",
      discount: 14
    },
    {
      name: "Classic Canvas Sneakers",
      description: "Timeless low-top canvas sneakers with classic silhouette. Features durable canvas upper, cushioned insole, and vulcanized rubber sole. A versatile addition to any wardrobe.",
      images: [
        "https://images.unsplash.com/photo-1516263097622-b2aebd660e46?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1554064931-5f83cf55d42f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1508379373954-4d865bff328a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80"
      ],
      price: 1999,
      gender: "women",
      category: "sneakers",
      sizes: ["6", "7", "8", "9", "10"],
      rating: 4.5,
      reviewCount: 184,
      stock: 60,
      tags: ["canvas", "classic", "casual", "sneakers"],
      deliveryEta: "2-4 days"
    },
    {
      name: "Knit Running Shoes",
      description: "Lightweight performance shoes with breathable knit upper. Features responsive cushioning, flexible outsole, and sock-like fit. Perfect for running or athleisure style.",
      images: [
        "https://images.unsplash.com/photo-1579338559194-a162d19bf842?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1579338359682-6a7ddbae84af?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80"
      ],
      price: 4499,
      originalPrice: 4999,
      gender: "women",
      category: "sneakers",
      sizes: ["6", "7", "8", "9"],
      rating: 4.8,
      reviewCount: 126,
      stock: 40,
      tags: ["running", "knit", "athletic", "lightweight"],
      deliveryEta: "3-5 days",
      discount: 10
    },
    {
      name: "Retro Color-Block Trainers",
      description: "Vintage-inspired sneakers with color-block design and suede details. Features cushioned midsole, padded collar, and durable rubber outsole. Perfect for adding a retro touch to any outfit.",
      images: [
        "https://images.unsplash.com/photo-1547997680-348a0843ff3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1518502463294-560e4b84d01a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80"
      ],
      price: 3999,
      gender: "women",
      category: "sneakers",
      sizes: ["7", "8", "9", "10"],
      rating: 4.6,
      reviewCount: 98,
      stock: 30,
      tags: ["retro", "color-block", "vintage", "trainers"],
      deliveryEta: "3-5 days",
      isNew: true
    },
    {
      name: "Slip-On Casual Sneakers",
      description: "Convenient slip-on design with elastic side panels for easy wear. Features cushioned footbed, textile upper, and flexible rubber sole. Perfect for effortless everyday style.",
      images: [
        "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80"
      ],
      price: 2999,
      originalPrice: 3499,
      gender: "women",
      category: "sneakers",
      sizes: ["6", "7", "8", "9", "10"],
      rating: 4.7,
      reviewCount: 114,
      stock: 45,
      tags: ["slip-on", "casual", "comfortable", "everyday"],
      deliveryEta: "2-4 days",
      discount: 14
    },

    // WOMEN'S ACCESSORIES
    {
      name: "Streetwear Handbag",
      description: "Trendy structured handbag with modern hardware details. Features spacious interior, adjustable shoulder strap, and multiple compartments. Perfect for adding edge to any outfit.",
      images: [
        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80"
      ],
      price: 3499,
      originalPrice: 3999,
      gender: "women",
      category: "accessories",
      subCategory: "bags",
      sizes: ["ONE SIZE"],
      rating: 4.8,
      reviewCount: 128,
      stock: 25,
      tags: ["handbag", "streetwear", "structured", "trendy"],
      deliveryEta: "3-5 days",
      discount: 13,
      isNew: true
    },
    {
      name: "Oversized Square Sunglasses",
      description: "Bold oversized square frames with UV400 protection. Features lightweight acetate construction, reinforced hinges, and fashionable tinted lenses. The perfect statement accessory.",
      images: [
        "https://images.unsplash.com/photo-1577744499738-5a264739373d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1542179013-b72207f42e3c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80"
      ],
      price: 1599,
      gender: "women",
      category: "accessories",
      subCategory: "sunglasses",
      sizes: ["ONE SIZE"],
      rating: 4.6,
      reviewCount: 94,
      stock: 35,
      tags: ["sunglasses", "oversized", "square", "statement"],
      deliveryEta: "2-4 days"
    },
    {
      name: "Minimalist Bucket Hat",
      description: "Trendy bucket hat with clean minimal design. Made from durable cotton twill with reinforced stitching. A versatile accessory for casual outfits and sun protection.",
      images: [
        "https://images.unsplash.com/photo-1582791694770-cbdc9dda338f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1521369909029-2afed882baee?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1595246707917-39cb04d69ffe?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80"
      ],
      price: 1299,
      originalPrice: 1499,
      gender: "women",
      category: "accessories",
      subCategory: "hats",
      sizes: ["ONE SIZE"],
      rating: 4.5,
      reviewCount: 76,
      stock: 45,
      tags: ["bucket hat", "minimal", "cotton", "casual"],
      deliveryEta: "2-4 days",
      discount: 13
    },
    {
      name: "Chunky Chain Necklace",
      description: "Bold statement necklace with chunky chain links. Features premium plating that won't tarnish and a secure lobster clasp. Perfect for elevating any outfit.",
      images: [
        "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1611107683227-e9060eccd846?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1635767798638-3e25273a8236?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80"
      ],
      price: 1899,
      gender: "women",
      category: "accessories",
      subCategory: "jewelry",
      sizes: ["ONE SIZE"],
      rating: 4.7,
      reviewCount: 88,
      stock: 30,
      tags: ["necklace", "chain", "statement", "jewelry"],
      deliveryEta: "2-4 days"
    },
    {
      name: "Canvas Tote Bag",
      description: "Spacious canvas tote with minimal design. Features durable construction, reinforced straps, and interior pocket. Perfect for shopping, beach days, or everyday carrying.",
      images: [
        "https://images.unsplash.com/photo-1591910539570-85b15a736fd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1544816155-12df9643f363?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        "https://images.unsplash.com/photo-1585488763177-bde7d15fd3cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80"
      ],
      price: 999,
      originalPrice: 1299,
      gender: "women",
      category: "accessories",
      subCategory: "bags",
      sizes: ["ONE SIZE"],
      rating: 4.5,
      reviewCount: 116,
      stock: 50,
      tags: ["tote", "canvas", "minimal", "everyday"],
      deliveryEta: "2-4 days",
      discount: 23
    }
  ];
}
