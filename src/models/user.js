import userDao from '../dao/UserDao';
import bcrypt from 'bcrypt';

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

  static async findById(id) {
      const userData = await userDao.findUserById(id);
      if (!userData) {
          return null;
      }
      return new User(userData);
  }

  static async findByUsername(username) {
      const userData = await userDao.findUserByUsername(username);
      if (!userData) {
          return null;
      }
      return new User(userData);
  }

  async verifyPassword(password) {
      return await bcrypt.compare(password, this.password);
  }
}
  
export default User; 
