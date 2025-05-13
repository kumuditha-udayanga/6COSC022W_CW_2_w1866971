import commentDao from '../dao/commentDao.js';
import blogDao from '../dao/blogPostDao.js';
import userDao from '../dao/userDao.js';

class Like {
    constructor({ id, blog_id, user_id, is_like }) {
        this.id = id;
        this.blog_id = blog_id;
        this.user_id = user_id;
        this.is_like = is_like;
    }

    static async create({ blogId, userId, isLike }) {
        const blog = await blogDao.getBlogById(blogId);
        const user = await userDao.findUserById(userId);
        if (!blog || !user) {
            throw new Error('Blog or user not found');
        }
        const likeId = await commentDao.createLike(blogId, userId, isLike);
        return new Like({ id: likeId, blog_id: blogId, user_id: userId, is_like: isLike });
    }

    static async getCounts(blogId) {
        const counts = await commentDao.getLikesCount(blogId);
        return counts;
    }
}

export default Like;