import Database from "../config/databse.js";

class LikeDao {
    async createLike(blogId, userId, isLike) {
        const sql = 'INSERT INTO likes (blog_id, user_id, is_like) VALUES (?, ?, ?)';
        return new Promise((resolve, reject) => {
            Database.getDb().run(
                sql, [blogId, userId, isLike], function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(this.lastID);
                    }
                }
            );
        });
    }

    async getLikesCount(blogId) {
        const sql = 'SELECT SUM(CASE WHEN is_like = 1 THEN 1 ELSE 0 END) as likes, SUM(CASE WHEN is_like = 0 THEN 1 ELSE 0 END) as dislikes FROM likes WHERE blog_id = ?';
        return new Promise((resolve, reject) => {
            Database.getDb().get(
                sql, [blogId], (err, row) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({likes: row.likes || 0, dislikes: row.dislikes || 0});
                    }
                }
            );
        });
    }
}

export default new LikeDao();