class BlogPost {
  constructor({ id, title, content, country, visit_date, user_id, created_at }) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.country = country;
    this.visit_date = visit_date;
    this.user_id = user_id;
    this.created_at = created_at;
  }

  static async create({ title, content, country, visitDate, userId }) {
    if (!title || !content || !country || !visitDate || !userId) {
      throw new Error('All fields are required');
    }
    if (isNaN(Date.parse(visitDate))) {
      throw new Error('Invalid visit date');
    }
    const user = await userDao.findUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    const blogId = await blogDao.createBlog(title, content, country, visitDate, userId);
    const blogData = await blogDao.getBlogById(blogId);
    
    return new Blog(blogData);
  }

  static async findById(id) {
    const blogData = await blogDao.getBlogById(id);
    if (!blogData) {
      return null;
    }
    return new Blog(blogData);
  }

  static async findByUserId(userId) {
    const blogsData = await blogDao.getBlogsByUserId(userId);
    return blogsData.map(data => new Blog(data));
  }

  static async searchByCountry(country) {
    if (!country) {
      throw new Error('Country is required for search');
    }
    const blogsData = await blogDao.searchBlogsByCountry(country);
    return blogsData.map(data => new Blog(data));
  }

  static async findRecent(limit = 10) {
    const blogsData = await blogDao.getRecentBlogs(limit);
    return blogsData.map(data => new Blog(data));
  }

  async update({ title, content, country, visitDate }) {
    if (!title || !content || !country || !visitDate) {
      throw new Error('All fields are required');
    }
    if (title.length < 3) {
      throw new Error('Title must be at least 3 characters');
    }
    if (content.length < 10) {
      throw new Error('Content must be at least 10 characters');
    }
    if (isNaN(Date.parse(visitDate))) {
      throw new Error('Invalid visit date');
    }
    const changes = await blogDao.updateBlog(this.id, title, content, country, visitDate, this.user_id);
    if (changes === 0) {
      throw new Error('Update failed or unauthorized');
    }
    const updatedBlog = await blogDao.getBlogById(this.id);
    return new Blog(updatedBlog);
  }

  async delete() {
      const changes = await blogDao.deleteBlog(this.id, this.user_id);
      if (changes === 0) {
        throw new Error('Delete failed or unauthorized');
      }
  }
}
  
export default BlogPost;  