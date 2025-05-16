import express from 'express';
import { followUser, unfollowUser, getFollowedBlogs } from '../controllers/followController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/follow', requireAuth, followUser);
router.post('/unfollow', requireAuth, unfollowUser);
router.get('/followed-blogs', requireAuth, getFollowedBlogs);

export default router;
