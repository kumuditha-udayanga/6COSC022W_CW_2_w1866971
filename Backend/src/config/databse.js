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

        const createFollowsTable = `
            CREATE TABLE IF NOT EXISTS follows (
                follower_id INTEGER NOT NULL,
                followed_id INTEGER NOT NULL,
                PRIMARY KEY (follower_id, followed_id),
                FOREIGN KEY (follower_id) REFERENCES users(id),
                FOREIGN KEY (followed_id) REFERENCES users(id)
            )`;

        const createLikesTable = `
            CREATE TABLE IF NOT EXISTS likes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                blog_id INTEGER NOT NULL,
                user_id INTEGER NOT NULL,
                is_like INTEGER NOT NULL,
                FOREIGN KEY (blog_id) REFERENCES blogs(id),
                FOREIGN KEY (user_id) REFERENCES users(id),
                UNIQUE (blog_id, user_id)
            )`;

        const createCommentsTable = `
            CREATE TABLE IF NOT EXISTS comments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                blog_id INTEGER NOT NULL,
                user_id INTEGER NOT NULL,
                content TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (blog_id) REFERENCES blogs(id),
                FOREIGN KEY (user_id) REFERENCES users(id)
            )`;

        const createSessionsTable = `
            CREATE TABLE IF NOT EXISTS sessions (
                api_key TEXT PRIMARY KEY,
                user_id INTEGER NOT NULL,
                created_at TEXT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )`;

        
        this.db.serialize(() => {
            this.db.run(createUsersTable);
            this.db.run(createBlogsTable);
            this.db.run(createFollowsTable);
            this.db.run(createLikesTable);
            this.db.run(createCommentsTable);
            this.db.run(createSessionsTable);
            console.log("DB connected")
        });
    }

    getDb() {
        return this.db;
    }
}
export default new Database;