import User from '../models/user.js';
import Blog from '../models/blogPost.js';
import Follow from '../models/follow.js';

export const getUserProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const blogs = await Blog.findByUserId(id);
        const followers = await Follow.getFollowers(id);
        const following = await Follow.getFollowing(id);
        res.json({ user, blogs, followers, following });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
};
