import Comment from '../models/comment.js';
import Like from '../models/like.js';

export const createComment = async (req, res) => {
    try {
        const { blogId, content } = req.body;
        const userId = req.userId;
        const comment = await Comment.create({ blogId, userId, content });
        res.json({ message: 'Comment created', comment });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const likeBlog = async (req, res) => {
    try {
        const { blogId, isLike } = req.body;
        const userId = req.userId;
        const like = await Like.create({ blogId, userId, isLike });
        res.json({ message: 'Like/dislike recorded', like });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
