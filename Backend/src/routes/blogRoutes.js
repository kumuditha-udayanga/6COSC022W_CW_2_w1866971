import express from 'express';
import { createBlog, getBlog, updateBlog, deleteBlog, searchBlogs, getRecentBlogs } from '../controllers/blogController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', requireAuth, createBlog);
router.get('/search', searchBlogs);
router.get('/recent', getRecentBlogs);
router.get('/:id', getBlog);
router.put('/:id', requireAuth, updateBlog);
router.delete('/:id', requireAuth, deleteBlog);

export default router;
