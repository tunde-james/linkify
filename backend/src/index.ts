import express, { Request, Response, urlencoded } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';

import myUserRoute from './routes/user-route';
import authRoute from './routes/auth-route';
import linkRoute from './routes/link-routes';

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => console.log('Connected to database!'));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDIANRY_API_SECRET,
});

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);

const PORT = process.env.PORT || 7000;

app.get('/health', async (req: Request, res: Response) => {
  res.send({ message: 'Health OK!' });
});

app.use('/api/user', myUserRoute);
app.use('/api/auth', authRoute);
app.use('/api/links', linkRoute);

app.listen(PORT, () => {
  console.log(`Server running on Port: ${PORT}`);
});
