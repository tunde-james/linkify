import express, { Request, Response, urlencoded } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import 'dotenv/config';

import myUserRoute from './routes/user-route';

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => console.log('Connected to database!'));

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

app.listen(PORT, () => {
  console.log(`Server running on Port: ${PORT}`);
});
