import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.routes.js'
import { errorHandler } from "./middlewares/errorhandler.js";
import companyRoutes from './routes/company.routes.js';
import jobRoutes from './routes/job.routes.js';
import bookmarkRoutes from './routes/bookmark.routes.js';
import userRoutes from './routes/user.routes.js';
import submissionRoutes from './routes/submission.routes.js';

dotenv.config({});

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(errorHandler);

const corsOption = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
};

app.use(cors(corsOption));

const PORT = process.env.PORT || 3000;

app.use("/api/v1/auth", authRoutes);
app.use('/api/v1/company', companyRoutes);
app.use('/api/v1/job', jobRoutes);
app.use('/api/v1/bookmark', bookmarkRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/submission', submissionRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log(`app is listenning at ${PORT}`);
});
