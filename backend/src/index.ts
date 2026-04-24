import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db';
import authRoutes from './routes/auth';
import moodRoutes from './routes/mood';
import profileRoutes from './routes/profile';

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'MindWell API is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/profile', profileRoutes);

// Global error handler
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🚀 MindWell Backend running on http://localhost:${PORT}`);
    console.log(`📦 Database: MongoDB Atlas`);
    console.log(`🌐 CORS allowed for: ${process.env.FRONTEND_URL || 'http://localhost:3000'}\n`);
  });
});
