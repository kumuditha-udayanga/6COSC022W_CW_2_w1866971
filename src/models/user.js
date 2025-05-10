import { userDao} from '../dao/user.dao.js';
class User {
    constructor(id, username, email, password) {
      this.id = id;
      this.username = username;
      this.email = email;
      this.password = password;
    }

    static async create({ email, password, username }) {
      if (!email || !password || !username) {
          throw new Error('Email, password, and username are required');
      }
      if (password.length < 6) {
          throw new Error('Password must be at least 6 characters');
      }
      if (username.length < 3) {
          throw new Error('Username must be at least 3 characters');
      }
      const existingUser = await userDao.findUserByEmail(email);
      if (existingUser) {
          throw new Error('Email already exists');
      }
      const userId = await userDao.createUser(email, password, username);
      const userData = await userDao.findUserById(userId);
      return new User(userData);
  }
}
  
module.exports = User;  
