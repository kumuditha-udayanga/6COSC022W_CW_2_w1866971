import Database from '../config/databse.js';

class CommentDao {
    async createComment(blogId, userId, content) {
        const sql = 'INSERT INTO comments (blog_id, user_id, content) VALUES (?, ?, ?)';
        return new Promise((resolve, reject) => {
            Database.getDb().run(
                sql, [blogId, userId, content], function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(this.lastID);
                    }
                }
            );
        });
    }

    async getCommentsByBlogId(blogId) {
        const sql = 'SELECT c.*, u.username FROM comments c JOIN users u ON c.user_id = u.id WHERE c.blog_id = ? ORDER BY c.created_at';
        return new Promise((resolve, reject) => {
            Database.getDb().all(
                sql, [blogId], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                }
            );
        });
    }
}

export default new CommentDao();