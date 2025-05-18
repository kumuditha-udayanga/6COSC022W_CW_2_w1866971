import db from '../config/databse.js';

class FollowDao {
    async followUser(followerId, followedId) {
        return new Promise((resolve, reject) => {
            db.getDb().run(
                'INSERT INTO follows (follower_id, followed_id) VALUES (?, ?)',
                [followerId, followedId],
                function(err) {
                    if (err) reject(err);
                    resolve(this.lastID);
                }
            );
        });
    }

    async unfollowUser(followerId, followedId) {
        return new Promise((resolve, reject) => {
            db.getDb().run(
                'DELETE FROM follows WHERE follower_id = ? AND followed_id = ?',
                [followerId, followedId],
                function(err) {
                    if (err) reject(err);
                    resolve(this.changes);
                }
            );
        });
    }

    async getFollowers(userId) {
        return new Promise((resolve, reject) => {
            db.getDb().all(
                'SELECT u.* FROM users u JOIN follows f ON u.id = f.follower_id WHERE f.followed_id = ?',
                [userId],
                (err, rows) => {
                    if (err) reject(err);
                    resolve(rows);
                }
            );
        });
    }

    async getFollowing(userId) {
        return new Promise((resolve, reject) => {
            db.getDb().all(
                'SELECT u.* FROM users u JOIN follows f ON u.id = f.followed_id WHERE f.follower_id = ?',
                [userId],
                (err, rows) => {
                    if (err) reject(err);
                    resolve(rows);
                }
            );
        });
    }

    async getFollowedBlogs(userId) {
        return new Promise((resolve, reject) => {
            db.getDb().all(
                'SELECT b.* FROM blogs b JOIN follows f ON b.user_id = f.followed_id WHERE f.follower_id = ? ORDER BY b.created_at DESC',
                [userId],
                (err, rows) => {
                    if (err) reject(err);
                    resolve(rows);
                }
            );
        });
    }
}

export default new FollowDao();