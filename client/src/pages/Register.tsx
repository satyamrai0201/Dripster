import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/context/AuthContext';
import { Helmet } from 'react-helmet';
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
import { Button } from '@/components/ui/button';

// Form validation schema
const registerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string().min(6, { message: 'Password must be at least 6 characters' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function Register() {
  const [, navigate] = useLocation();
  const { register, loginWithGoogle, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  
  // React Hook Form
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });
  
  // Handle form submission
  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    try {
      setError(null);
      await register(values.name, values.email, values.password);
      navigate('/');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };
  
  // Handle Google registration
  const handleGoogleRegistration = async () => {
    try {
      await loginWithGoogle();
      // Redirect happens automatically after Google login
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred with Google registration');
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Register | Dripster</title>
        <meta name="description" content="Create a new account at Dripster to shop for the latest fashion trends." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl md:text-3xl font-montserrat font-bold mb-8 text-center">Create an Account</h1>
        
        <div 
          className="max-w-md mx-auto rounded-xl p-8"
          style={{
            background: 'rgba(30, 30, 30, 0.7)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <h2 className="text-xl font-montserrat font-semibold text-center mb-6">Join Dripster</h2>
          
          <button 
            className="w-full py-3 rounded-full font-montserrat font-medium flex items-center justify-center mb-6 bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] transition-colors"
            onClick={handleGoogleRegistration}
            disabled={isLoading}
          >
            <i className="ri-google-fill mr-2 text-lg"></i>
            Sign up with Google
          </button>
          
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-[rgba(255,255,255,0.1)]"></div>
            <span className="px-4 text-sm text-[#BBBBBB]">or sign up with email</span>
            <div className="flex-1 h-px bg-[rgba(255,255,255,0.1)]"></div>
          </div>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-2 rounded-lg mb-4">
              {error}
            </div>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="John Doe" 
                        className="bg-[#2A2A2A] border-[rgba(255,255,255,0.1)] focus:border-primary" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="your@email.com" 
                        className="bg-[#2A2A2A] border-[rgba(255,255,255,0.1)] focus:border-primary" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        className="bg-[#2A2A2A] border-[rgba(255,255,255,0.1)] focus:border-primary" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        className="bg-[#2A2A2A] border-[rgba(255,255,255,0.1)] focus:border-primary" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full py-6 rounded-full font-montserrat font-semibold bg-primary hover:bg-[#e03535] transition-colors"
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
          </Form>
          
          <p className="text-center mt-6 text-sm text-[#BBBBBB]">
            Already have an account? <Link href="/login"><a className="text-primary hover:underline">Sign In</a></Link>
          </p>
        </div>
      </div>
    </>
  );
}
