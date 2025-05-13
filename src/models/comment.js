import commentDao from '../dao/commentDao.js';
import userDao from '../dao/userDao.js';
import blogDao from '../dao/blogPostDao.js';

class Comment {
    constructor({ id, blog_id, user_id, content, created_at, username }) {
        this.id = id;
        this.blog_id = blog_id;
        this.user_id = user_id;
        this.content = content;
        this.created_at = created_at;
        this.username = username;
    }

    static async create({ blogId, userId, content }) {
        if (!content) {
            throw new Error('Comment content is required');
        }
        if (content.length < 1) {
            throw new Error('Comment must not be empty');
        }
        const blog = await blogDao.getBlogById(blogId);
        const user = await userDao.findUserById(userId);
        if (!blog || !user) {
            throw new Error('Blog or user not found');
        }
        const commentId = await commentDao.createComment(blogId, userId, content);
        const comments = await commentDao.getCommentsByBlogId(blogId);
        const newComment = comments.find(c => c.id === commentId);
        return new Comment(newComment);
    }

    static async findByBlogId(blogId) {
        const commentsData = await commentDao.getCommentsByBlogId(blogId);
        return commentsData.map(data => new Comment(data));
    }
}

export default Comment;