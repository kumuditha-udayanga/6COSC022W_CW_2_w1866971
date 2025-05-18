import Blog from '../models/blogPost.js';
import User from '../models/user.js';
import Comment from '../models/comment.js';
import Like from '../models/like.js';

export const createBlog = async (req, res) => {
    try {
        const { title, content, country, visitDate } = req.body;
        const userId = req.userId;
        const blog = await Blog.create({ title, content, country, visitDate, userId });
        res.status(201).json({ message: 'Blog created', blog });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        const user = await User.findById(blog.user_id);
        const comments = await Comment.findByBlogId(id);
        const likes = await Like.getCounts(id);
        res.json({ blog, user, comments, likes });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch blog' });
    }
};

export const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, country, visitDate } = req.body;
        const userId = req.userId;
        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        if (blog.user_id !== userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        const updatedBlog = await blog.update({ title, content, country, visitDate });
        res.json({ message: 'Blog updated', blog: updatedBlog });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        if (blog.user_id !== userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        await blog.delete();
        res.json({ message: 'Blog deleted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const searchBlogs = async (req, res) => {
    try {
        const { country, username } = req.query;
        let blogs = [];
        if (country) {
            blogs = await Blog.searchByCountry(country);
        } else if (username) {
            const user = await User.findByUsername(username);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            blogs = await Blog.findByUserId(user.id);
        }
        res.json({ blogs });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getRecentBlogs = async (req, res) => {
    try {
        const blogs = await Blog.findRecent();
        res.json({ blogs });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch recent blogs' });
    }
};
