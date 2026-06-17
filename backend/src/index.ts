import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import analyzeRouter from './routes/analyze';
import doctorsRouter from './routes/doctors';
import chatRouter from './routes/chat';
import { apiLimiter, doctorLimiter } from './middleware/rateLimit';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'], // allow Vite standard ports
    credentials: true,
  })
);
app.use(express.json());

// Logger Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/analyze', apiLimiter, analyzeRouter);
app.use('/api/chat', apiLimiter, chatRouter);
app.use('/api/doctors', doctorLimiter, doctorsRouter);

// Start Server
app.listen(port, () => {
  console.log(`=========================================`);
  console.log(` MediTrack Backend running on port ${port}`);
  console.log(` Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(`=========================================`);
});
