import sqlite3 from "sqlite3";
import User from "../models/user.js";

const db = new sqlite3.Database("../../w1866971-cw2.db");

class UserDAO {
  static createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      )
    `;
    db.run(sql);
  }

  static create(user, callback) {
    const sql = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
    db.run(sql, [user.username, user.email, user.password], function(err) {
      callback(err, this.lastID);
    });
  }

  static findById(id, callback) {
    const sql = `SELECT * FROM users WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
      if (row) {
        callback(err, new User(row.id, row.username, row.email, row.password));
      } else {
        callback(err, null);
      }
    });
  }

  static findUserByEmail(email, callback) {
    const sql = `SELECT * FROM users WHERE email = ?`;
    db.get(sql, [email], (err, row) => {
      if (row) {
        callback(err, new User(row.id, row.username, row.email, row.password));
      } else {
        callback(err, null);
      }
    });
  }

  static findUserByUsername(username, callback) {
    const sql = `SELECT * FROM users WHERE username = ?`;
    db.get(sql, [username], (err, row) => {
      if (row) {
        callback(err, new User(row.id, row.username, row.email, row.password));
      } else {
        callback(err, null);
      }
    });
  }
}

module.exports = UserDAO;
