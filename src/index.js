import express from 'express';
import dotenv from 'dotenv';
import errorMiddleware from './middlewares/error.middleware.js';
import {connectDB} from './database/connectDB.js';
import cookieParser from 'cookie-parser';

import authRouter from './routes/auth.route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())


app.use('/api/auth', authRouter)

connectDB();

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
