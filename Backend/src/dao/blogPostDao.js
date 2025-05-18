import blogPost from '../models/blogPost.js';
import sqlite3 from "sqlite3";

const db = new sqlite3.Database("../../w1866971-cw2.db");

class BlogPostDAO {
  async create(title, content, country, visitDate, userId) {
    return new Promise((resolve, reject) => {
        db.getDb().run(
            'INSERT INTO blog_posts (title, content, country, visit_date, user_id) VALUES (?, ?, ?, ?, ?)',
            [title, content, country, visitDate, userId],
            function(err) {
                if (err) reject(err);
                resolve(this.lastID);
            }
        );
    });
  }

  async getBlogById(id) {
    return new Promise((resolve, reject) => {
        db.getDb().get('SELECT * FROM blog_posts WHERE id = ?', [id], (err, row) => {
            if (err) reject(err);
            resolve(row);
        });
    });
  }

  async getBlogsByUserId(userId) {
    return new Promise((resolve, reject) => {
      db.getDb().all('SELECT * FROM blog_posts WHERE user_id = ?', [userId], (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  async searchBlogsByCountry(country) {
    return new Promise((resolve, reject) => {
      db.getDb().all('SELECT * FROM blog_posts WHERE country LIKE ?', [`%${country}%`], (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  async updateBlog(id, title, content, country, visitDate, userId) {
    return new Promise((resolve, reject) => {
      db.getDb().run(
        'UPDATE blog_posts SET title = ?, content = ?, country = ?, visit_date = ? WHERE id = ? AND user_id = ?',
        [title, content, country, visitDate, id, userId],
        function(err) {
          if (err) reject(err);
          resolve(this.changes);
        }
      );
    });
  }

  async deleteBlog(id, userId) {
    return new Promise((resolve, reject) => {
      db.getDb().run(
        'DELETE FROM blog_posts WHERE id = ? AND user_id = ?',
        [id, userId],
        function(err) {
          if (err) reject(err);
          resolve(this.changes);
        }
      );
    });
  }

  async getRecentBlogs(limit = 10) {
    return new Promise((resolve, reject) => {
      db.getDb().all('SELECT * FROM blog_posts ORDER BY created_at DESC LIMIT ?', [limit], (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }
}

export default new BlogPostDAO();
