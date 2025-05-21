import {v4 as uuidv4} from "uuid";
import Database from '../../src/config/databse.js';

class SessionDao {
    async create(user) {
        const sql = 'INSERT INTO sessions (api_key, user_id, created_at) VALUES (?, ?, ?)';
        const apiKey = uuidv4();

        return new Promise((resolve, reject) => {
            Database.getDb().run(
                sql,
                [apiKey, user.id, new Date().toISOString()],
                function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(apiKey);
                    }
                }
            );
        });
    }

    async delete(apiKey) {
        const sql = 'DELETE FROM sessions WHERE api_key = ?';
        return new Promise((resolve, reject) => {
            Database.getDb().run(
                sql,
                [apiKey],
                function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                }
            );
        });
    }
}

export default new SessionDao();