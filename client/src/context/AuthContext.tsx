import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { useLocation } from 'wouter';
import { auth } from '../lib/firebase';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  showLoginPopup: (trigger?: 'visit' | 'purchase') => void;
  hideLoginPopup: () => void;
  isLoginPopupOpen: boolean;
  loginPopupTrigger: 'visit' | 'purchase' | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [loginPopupTrigger, setLoginPopupTrigger] = useState<'visit' | 'purchase' | null>(null);
  const [, navigate] = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Check if it's first visit to show login popup (disabled initially)
  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
    
    // Uncomment this block to enable the popup on first visit
    /* 
    if (!hasVisitedBefore && !currentUser) {
      // Set timeout to not immediately show the popup
      const timer = setTimeout(() => {
        showLoginPopup('visit');
      }, 5000);
      
      localStorage.setItem('hasVisitedBefore', 'true');
      return () => clearTimeout(timer);
    }
    */
  }, [currentUser]);

  const loginWithEmail = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      hideLoginPopup();
      return;
    } catch (error) {
      console.error("Email login error:", error);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      hideLoginPopup();
      return;
    } catch (error) {
      console.error("Google login error:", error);
      throw error;
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      hideLoginPopup();
      return;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      // Optional: Redirect to home page after logout
      navigate('/');
      return;
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const showLoginPopup = (trigger: 'visit' | 'purchase' = 'visit') => {
    setLoginPopupTrigger(trigger);
    setIsLoginPopupOpen(true);
  };

  const hideLoginPopup = () => {
    setIsLoginPopupOpen(false);
    setLoginPopupTrigger(null);
  };

  const value = {
    currentUser,
    loading,
    loginWithEmail,
    loginWithGoogle,
    signup,
    logout,
    showLoginPopup,
    hideLoginPopup,
    isLoginPopupOpen,
    loginPopupTrigger
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;