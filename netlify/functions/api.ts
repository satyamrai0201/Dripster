import express, { Router, Request } from 'express';
import serverless from 'serverless-http';
import { json, urlencoded } from 'body-parser';
import cors from 'cors';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

// Custom type for request with user
interface AuthRequest extends Request {
  user?: any;
}

// Initialize Firebase (only if not already initialized)
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

const api = express();

// Middleware
api.use(cors({
  origin: true, // This will be updated by Netlify's environment
  credentials: true
}));
api.use(json());
api.use(urlencoded({ extended: true }));

// Auth middleware
const requireAuth = async (req: AuthRequest, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // For development, we'll just pass through if token exists
    // In production, you should implement proper token verification
    req.user = { id: 'test-user' };
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Routes
api.get('/api/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Protected routes
api.use('/api/protected', requireAuth);
api.get('/api/protected/user', (req: AuthRequest, res) => {
  res.json({ user: req.user });
});

// Error handling
api.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Export handler for serverless function
export const handler = serverless(api); 