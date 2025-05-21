import FollowDao from '../dao/followDao.js';
import UserDao from '../dao/userDao.js';
import User from './user.js';
import Blog from './blogPost.js';

class Follow {
    constructor({ id, follower_id, followed_id }) {
        this.id = id;
        this.follower_id = follower_id;
        this.followed_id = followed_id;
    }

    static async create({ followerId, followedId }) {
        if (followerId === followedId) {
            throw new Error('Cannot follow yourself');
        }
        const follower = await UserDao.findById(followerId);
        const followed = await UserDao.findById(followedId);
        if (!follower || !followed) {
            throw new Error('User not found');
        }
        const followId = await FollowDao.followUser(followerId, followedId);
        return new Follow({ id: followId, follower_id: followerId, followed_id: followedId });
    }

    static async delete({ followerId, followedId }) {
        const changes = await FollowDao.unfollowUser(followerId, followedId);
        if (changes === 0) {
            throw new Error('Unfollow failed');
        }
    }

    static async getFollowers(userId) {
        const followersData = await FollowDao.getFollowers(userId);
        return followersData.map(data => new User(data));
    }

    static async getFollowing(userId) {
        const followingData = await FollowDao.getFollowing(userId);
        return followingData.map(data => new User(data));
    }

    static async getFollowedBlogs(userId) {
        console.log(userId);
        const blogsData = await FollowDao.getFollowedBlogs(userId);
        return blogsData.map(data => new Blog(data));
    }
}

export default Follow;