import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/context/AuthContext';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [, navigate] = useLocation();
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Get auth context
  const auth = useAuth();
  
  // Parse query parameters
  const searchParams = new URLSearchParams(window.location.search);
  const redirectTo = searchParams.get('redirect') || '/';
  
  // Redirect if already authenticated
  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate('/');
    }
  }, [auth.isAuthenticated, navigate]);
  
  // Handle Google login
  const handleGoogleLogin = async () => {
    try {
      setError(null);
      setIsLoading(true);
      await auth.loginWithGoogle();
      // Redirect happens automatically after Google login
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred with Google login');
      }
      toast({
        title: 'Login failed',
        description: error || 'Failed to login with Google. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Sign In | Dripster</title>
        <meta name="description" content="Sign in to your Dripster account to shop for the latest fashion trends." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-2xl md:text-3xl font-montserrat font-bold mb-8 text-center">Sign In to Dripster</h1>
        
        <div 
          className="max-w-md mx-auto rounded-xl p-8 mt-8"
          style={{
            background: 'rgba(30, 30, 30, 0.7)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <h2 className="text-xl font-montserrat font-semibold text-center mb-8">Welcome Back</h2>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}
          
          <div className="flex flex-col gap-5">
            <Button 
              onClick={handleGoogleLogin}
              disabled={isLoading || auth.isLoading}
              className="w-full py-6 h-auto rounded-full font-montserrat text-base flex items-center justify-center bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)]"
            >
              <i className="ri-google-fill mr-2 text-xl"></i>
              {isLoading ? 'Signing in...' : 'Continue with Google'}
            </Button>
            
            <div className="text-center text-sm text-[#BBBBBB] mt-2">
              By continuing, you agree to Dripster's <span onClick={() => navigate('/terms')} className="text-primary hover:underline cursor-pointer">Terms of Service</span> and <span onClick={() => navigate('/privacy')} className="text-primary hover:underline cursor-pointer">Privacy Policy</span>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <p className="text-[#BBBBBB]">
            Don't have an account yet? <span onClick={() => navigate('/register')} className="text-primary hover:underline cursor-pointer">Register</span>
          </p>
        </div>
      </div>
    </>
  );
}
