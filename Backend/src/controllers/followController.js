import Follow from '../models/follow.js';

export const followUser = async (req, res) => {
    try {
        const { followedId } = req.body;
        const followerId = req.userId;
        const follow = await Follow.create({ followerId, followedId });
        res.json({ message: 'Followed successfully', follow });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const unfollowUser = async (req, res) => {
    try {
        const { followedId } = req.body;
        const followerId = req.userId;
        await Follow.delete({ followerId, followedId });
        res.json({ message: 'Unfollowed successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getFollowedBlogs = async (req, res) => {
    try {
        const userId = req.userId;
        const blogs = await Follow.getFollowedBlogs(userId);
        res.json({ blogs });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch followed blogs' });
    }
};
