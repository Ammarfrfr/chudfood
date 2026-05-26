import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {connectDB} from './config/db.js';
import searchRoutes from './routes/searchRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import errorHandler from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use(searchRoutes);
app.use(reviewRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
