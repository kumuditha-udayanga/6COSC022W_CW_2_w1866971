import Database from "../config/databse.js";

class FollowDao {
    async followUser(followerId, followedId) {
        const sql = 'INSERT INTO follows (follower_id, followed_id) VALUES (?, ?)';
        return new Promise((resolve, reject) => {
            Database.getDb().run(
                sql, [followerId, followedId], function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(this.lastID);
                    }
                }
            );
        });
    }

    async unfollowUser(followerId, followedId) {
        const sql = 'DELETE FROM follows WHERE follower_id = ? AND followed_id = ?';
        return new Promise((resolve, reject) => {
            Database.getDb().run(
                sql, [followerId, followedId], (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                }
            );
        });
    }

    async getFollowers(userId) {
        const sql = 'SELECT u.* FROM users u JOIN follows f ON u.id = f.follower_id WHERE f.followed_id = ?';
        return new Promise((resolve, reject) => {
            Database.getDb().all(
                sql, [userId], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                }
            );
        });
    }

    async getFollowing(userId) {
        const sql = 'SELECT u.* FROM users u JOIN follows f ON u.id = f.followed_id WHERE f.follower_id = ?';
        return new Promise((resolve, reject) => {
            Database.getDb().all(
                sql, [userId], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                }
            );
        });
    }

    async getFollowedBlogs(userId) {
        return new Promise((resolve, reject) => {

            // const sql = 'SELECT b.* FROM blog_posts b JOIN follows f ON b.user_id = f.followed_id WHERE f.follower_id = ? ORDER BY b.created_at DESC';
            const sql = 'SELECT b.*, u.username FROM blog_posts b JOIN follows f ON b.user_id = f.followed_id JOIN users u ON b.user_id = u.id WHERE f.follower_id = ? ORDER BY b.created_at DESC LIMIT ? OFFSET ?';
            Database.getDb().all(
                sql, [userId, 10, 0], (err, rows) => {
                    console.log(sql);
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

export default new FollowDao();