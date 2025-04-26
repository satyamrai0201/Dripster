import { Express } from 'express';
import dripRoutes from './dripRoutes';
import productRoutes from './product'; // ✅ import product routes

export const registerRoutes = async (app: Express) => {
  app.use('/api/drips', dripRoutes);
  app.use('/api/products', productRoutes); // ✅ register the new route
};