import Database from "../config/databse.js";

class BlogPostDAO {
    async create(title, content, country, visitDate, userId) {
        const sql = 'INSERT INTO blog_posts (title, content, country, visit_date, user_id) VALUES (?, ?, ?, ?, ?)';
        return new Promise((resolve, reject) => {
            Database.getDb().run(
                sql, [title, content, country, visitDate, userId], function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(this.lastID);
                    }
                }
            );
        });
    }

    async getBlogById(id) {
        const sql = 'SELECT * FROM blog_posts WHERE id = ?';
        return new Promise((resolve, reject) => {
            Database.getDb().get(sql, [id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    async getBlogsByUserId(userId) {
        const sql = 'SELECT * FROM blog_posts WHERE user_id = ?';
        return new Promise((resolve, reject) => {
            Database.getDb().all(sql, [userId], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    async searchBlogsByCountry(country) {
        const sql = 'SELECT * FROM blog_posts WHERE country LIKE ?';
        return new Promise((resolve, reject) => {
            Database.getDb().all(sql, [`%${country}%`], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    async updateBlog(id, title, content, country, visitDate, userId) {
        const sql = 'UPDATE blog_posts SET title = ?, content = ?, country = ?, visit_date = ? WHERE id = ? AND user_id = ?';
        return new Promise((resolve, reject) => {
            Database.getDb().run(
                sql, [title, content, country, visitDate, id, userId], function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(this.changes);
                    }
                }
            );
        });
    }

    async deleteBlog(id, userId) {
        const sql = 'DELETE FROM blog_posts WHERE id = ? AND user_id = ?';
        return new Promise((resolve, reject) => {
            Database.getDb().run(
                sql, [id, userId], function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(this.changes);
                    }
                }
            );
        });
    }

    async getRecentBlogs(limit = 10) {
        const sql = 'SELECT * FROM blog_posts ORDER BY created_at DESC LIMIT ?';
        return new Promise((resolve, reject) => {
            Database.getDb().all(sql, [limit], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    console.log(rows);
                    resolve(rows);
                }
            });
        });
    }
}

export default new BlogPostDAO();
