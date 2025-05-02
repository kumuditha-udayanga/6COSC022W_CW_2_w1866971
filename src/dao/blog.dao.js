import BlogPost from '../models/blogpost';
import sqlite3 from "sqlite3";

const db = new sqlite3.Database("../../w1866971-cw2.db");

class BlogPostDAO {
  static createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS blog_posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        userId INTEGER NOT NULL,
        FOREIGN KEY(userId) REFERENCES users(id)
      )
    `;
    db.run(sql);
  }

  static create(post, callback) {
    const sql = `INSERT INTO blog_posts (title, content, userId) VALUES (?, ?, ?)`;
    db.run(sql, [post.title, post.content, post.userId], function(err) {
      callback(err, this.lastID);
    });
  }

  static findById(id, callback) {
    const sql = `SELECT * FROM blog_posts WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
      if (row) {
        callback(err, new BlogPost(row.id, row.title, row.content, row.userId));
      } else {
        callback(err, null);
      }
    });
  }
}

module.exports = BlogPostDAO;
