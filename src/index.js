import express from 'express';
import dotenv from 'dotenv';
import errorMiddleware from './middlewares/error.middleware.js';
import {connectDB} from './database/connectDB.js';
import cookieParser from 'cookie-parser';

import authRouter from './routes/auth.route.js';
import { cleanupExpiredUsers } from './utils/cleanExpired.js';
import { cleanupExpiredResetTokens } from './utils/cleanExpired.js';
import connectCloudinary from './config/cloudinary.js';
import productRouter from './routes/product.route.js';
import cartRouter from './routes/cart.route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();
connectCloudinary();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())


app.use('/api/auth', authRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)


setInterval(async () => {
  try {
    await cleanupExpiredUsers();
    await cleanupExpiredResetTokens();
  } catch (error) {
    console.error("Error during cleanup:", error);
  }
}, 5 * 60 * 1000); // Cleanup every 5 minutes

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
