import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

interface LoginPopupProps {
  isOpen: boolean;
  onClose: () => void;
  trigger?: 'visit' | 'purchase' | null;
}

const LoginPopup = ({ isOpen, onClose, trigger = null }: LoginPopupProps) => {
  const { currentUser, loginWithGoogle, signup, loginWithEmail } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [show, setShow] = useState(false);

  // Email/password fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (isOpen) {
      setShow(true);
      setError('');
      setIsSignUp(false);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } else {
      setTimeout(() => setShow(false), 300); // match animation duration
    }
  }, [isOpen]);

  if (!isOpen && !show) return null;

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await loginWithGoogle();
      onClose();
    } catch (err) {
      setError('Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        await signup(email, password);
      } else {
        await loginWithEmail(email, password);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleSignUp = () => setIsSignUp((v) => !v);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300
        ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        bg-black/60 backdrop-blur-md`}
      style={{ minHeight: '100vh' }}
    >
      <div
        className={`
          relative bg-zinc-900/80 text-white rounded-2xl p-8 w-full max-w-md border border-zinc-700
          flex flex-col items-center shadow-2xl
          transition-all duration-300
          ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-8'}
          backdrop-blur-xl
        `}
        style={{
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          border: '1px solid rgba(255,255,255,0.18)',
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h1 className="text-3xl font-bold mb-6 text-center drop-shadow-lg">
          {isSignUp ? 'Create an Account' : 'Sign In to Dripster'}
        </h1>
        <div className="w-full bg-zinc-800/80 rounded-xl p-8 flex flex-col items-center shadow-lg backdrop-blur">
          <h2 className="text-xl font-semibold mb-6 text-center">
            {isSignUp
              ? 'Join Dripster'
              : `Welcome Back${currentUser?.displayName ? `, ${currentUser.displayName}` : ''}`}
          </h2>
          {error && (
            <div className="mb-4 p-2 bg-red-900 text-red-200 rounded w-full text-center">
              {error}
            </div>
          )}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center py-3 px-4 mb-6 rounded-full bg-zinc-700 hover:bg-red-500 text-lg font-medium text-white transition-all duration-200 shadow-md hover:scale-105"
          >
            <svg className="h-6 w-6 mr-3" viewBox="0 0 24 24">
              <path
                d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 110-12.064c1.32 0 2.598.44 3.645 1.248l2.702-2.7A9.995 9.995 0 0012.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z"
                fill="#fff"
              />
            </svg>
            {isSignUp ? 'Sign up with Google' : 'Continue with Google'}
          </button>
          <div className="w-full flex items-center my-4">
            <div className="flex-grow border-t border-zinc-700"></div>
            <span className="mx-3 text-zinc-400 text-xs">or</span>
            <div className="flex-grow border-t border-zinc-700"></div>
          </div>
          <form onSubmit={handleEmailAuth} className="w-full">
            <input
              type="email"
              required
              placeholder="Email"
              className="w-full mb-3 px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:border-red-400"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
            />
            <input
              type="password"
              required
              placeholder="Password"
              className="w-full mb-3 px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:border-red-400"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete={isSignUp ? "new-password" : "current-password"}
            />
            {isSignUp && (
              <input
                type="password"
                required
                placeholder="Confirm Password"
                className="w-full mb-3 px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:border-red-400"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition"
            >
              {isSignUp ? 'Register with Email' : 'Sign In with Email'}
            </button>
          </form>
          <div className="text-center text-xs text-gray-400 mt-4 mb-2">
            {isSignUp ? (
              <>
                By signing up, you agree to Dripster's{' '}
                <a href="#" className="text-red-400 underline">Terms of Service</a> and{' '}
                <a href="#" className="text-red-400 underline">Privacy Policy</a>
              </>
            ) : (
              <>
                By continuing, you agree to Dripster's{' '}
                <a href="#" className="text-red-400 underline">Terms of Service</a> and{' '}
                <a href="#" className="text-red-400 underline">Privacy Policy</a>
              </>
            )}
          </div>
        </div>
        <div className="mt-8 text-center w-full">
          {isSignUp ? (
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <button onClick={toggleSignUp} className="font-medium text-red-400 hover:underline">
                Sign In
              </button>
            </p>
          ) : (
            <p className="text-sm text-gray-400">
              Don't have an account yet?{' '}
              <button onClick={toggleSignUp} className="font-medium text-red-400 hover:underline">
                Register
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;