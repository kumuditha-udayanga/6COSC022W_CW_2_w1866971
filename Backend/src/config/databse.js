import sqlite3 from 'sqlite3';

class Database {
    constructor() {
        this.db = new sqlite3.Database('./w1866971_cw2.sqlite'), (err) => {
            if (err) {
                console.error('Database connection error:', err);
            } else {
                console.log('Connected to SQLite database');
                this.initializeDatabase();
            }
        };
    }

    initializeDatabase() {
        const createUsersTable = `
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                username TEXT UNIQUE NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`;

        const createBlogsTable = `
            CREATE TABLE IF NOT EXISTS blog_posts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                country TEXT NOT NULL,
                visit_date DATE NOT NULL,
                user_id INTEGER,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )`;

        this.db.serialize(() => {
            this.db.run(createUsersTable);
            this.db.run(createBlogsTable);
        });
    }

    getDb() {
        return this.db;
    }
}
export default new Database;