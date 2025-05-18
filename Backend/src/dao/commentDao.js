import db from '../config/databse.js';

class CommentDao {
    async createComment(blogId, userId, content) {
        return new Promise((resolve, reject) => {
            db.getDb().run(
                'INSERT INTO comments (blog_id, user_id, content) VALUES (?, ?, ?)',
                [blogId, userId, content],
                function(err) {
                    if (err) reject(err);
                    resolve(this.lastID);
                }
            );
        });
    }

    async getCommentsByBlogId(blogId) {
        return new Promise((resolve, reject) => {
            db.getDb().all(
                'SELECT c.*, u.username FROM comments c JOIN users u ON c.user_id = u.id WHERE c.blog_id = ? ORDER BY c.created_at',
                [blogId],
                (err, rows) => {
                    if (err) reject(err);
                    resolve(rows);
                }
            );
        });
    }

    async createLike(blogId, userId, isLike) {
        return new Promise((resolve, reject) => {
            db.getDb().run(
                'INSERT INTO likes (blog_id, user_id, is_like) VALUES (?, ?, ?)',
                [blogId, userId, isLike],
                function(err) {
                    if (err) reject(err);
                    resolve(this.lastID);
                }
            );
        });
    }

    async getLikesCount(blogId) {
        return new Promise((resolve, reject) => {
            db.getDb().get(
                'SELECT SUM(CASE WHEN is_like = 1 THEN 1 ELSE 0 END) as likes, SUM(CASE WHEN is_like = 0 THEN 1 ELSE 0 END) as dislikes FROM likes WHERE blog_id = ?',
                [blogId],
                (err, row) => {
                    if (err) reject(err);
                    resolve({ likes: row.likes || 0, dislikes: row.dislikes || 0 });
                }
            );
        });
    }
}

export default new CommentDao();