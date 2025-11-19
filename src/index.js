import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoute from './routes/auth.routes.js';
import companyRoutes from './routes/company.routes.js';
import jobRoutes from './routes/job.routes.js';
import bookmarkRoutes from './routes/bookmark.routes.js';
import userRoutes from './routes/user.routes.js';
import submissionRoutes from './routes/submission.routes.js';

dotenv.config();

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(cookieParser());

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
    ],
    credentials: true,
  })
);

import { errorHandler } from './middlewares/errorhandler.js';
import { connectDB } from './config/db.js';

app.use('/api/v1/auth', authRoute);
app.use('/api/v1/', companyRoutes);
app.use('/api/v1/jobs', jobRoutes);
app.use('/api/v1/bookmarks', bookmarkRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/application', submissionRoutes);

app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;

  connectDB(); 
  app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
  });
}

export default app;
