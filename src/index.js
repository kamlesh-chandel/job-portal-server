import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoute from './routes/auth.routes.js'
import { errorHandler } from "./middlewares/errorhandler.js";
import companyRoutes from './routes/company.routes.js';
import jobRoutes from './routes/job.routes.js';
import bookmarkRoutes from './routes/bookmark.routes.js';

dotenv.config({});

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

const corsOption = {
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
};

app.use(cors(corsOption));

const PORT = process.env.PORT || 3000;

app.use("/api/v1/auth", authRoute);
app.use('/api/v1/', companyRoutes);
app.use('/api/v1/jobs', jobRoutes);
app.use('/api/v1/bookmark', bookmarkRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  connectDB();
  console.log(`app is listenning at ${PORT}`);
});
