import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import routes from './routes/routes.js';
import { syncDatabase } from './config/database.js';
import './models/associations.js';  // Import associations to ensure they're set up

dotenv.config();

const app = express();

// Use cookie parser middleware BEFORE routes
app.use(cookieParser());

// Configure CORS for deployment
app.use(cors({
  // Allow requests from these origins (add your frontend URL)
  origin: [
    'https://frontend-bakery-dot-g-09-450802.uc.r.appspot.com', // Your actual frontend URL
    'http://localhost:3000'
  ],
  // Allow credentials (cookies)
  credentials: true,
  // Allowed HTTP methods
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  // Allowed headers
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  // Expose headers that frontend can access
  exposedHeaders: ['Set-Cookie']
}));

// Handle preflight requests
app.options('*', cors());

// Parse JSON bodies
app.use(express.json());

// Use routes
app.use(routes);

// Sync database before starting server
syncDatabase().then(() => {
  // Start server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});