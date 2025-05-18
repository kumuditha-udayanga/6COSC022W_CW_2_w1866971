import express from 'express';
import { createComment, likeBlog } from '../controllers/commentController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/comment', requireAuth, createComment);
router.post('/like', requireAuth, likeBlog);

export default router;
