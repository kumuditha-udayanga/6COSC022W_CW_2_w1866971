import cors from 'cors';
import dotenv from "dotenv";
import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from './src/routes/authRoutes.js';
import blogRoutes from './src/routes/blogRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import followRoutes from './src/routes/followRoutes.js';
import commentRoutes from './src/routes/commentRoutes.js';
import Database from './src/config/databse.js';

dotenv.config();
const app = express();

app.use(cors({
    origin: process.env.ORIGIN_URL,
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
Database.initializeDatabase();

app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/users', userRoutes);
app.use('/api/follow', followRoutes);
app.use('/api/comments', commentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
