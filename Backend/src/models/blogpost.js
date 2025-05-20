import UserDao from "../dao/userDao.js";
import BlogPostDao from "../dao/blogPostDao.js";

class BlogPost {
  constructor(blog) {
    this.id = blog.id;
    this.title = blog.title;
    this.content = blog.content;
    this.country = blog.country;
    this.visit_date = blog.visit_date;
    this.user_id = blog.user_id;
    this.created_at = blog.created_at;
  }

  static async create({ title, content, country, visitDate, userId }) {
    console.log(title);
    console.log(visitDate);
    console.log(userId);
    if (!title || !content || !country || !visitDate || !userId) {
      throw new Error('All fields are required');
    }
    if (isNaN(Date.parse(visitDate))) {
      throw new Error('Invalid visit date');
    }
    const user = await UserDao.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    const blogId = await BlogPostDao.create(title, content, country, visitDate, userId);
    const blogData = await BlogPostDao.getBlogById(blogId);
    console.log("Here");
    console.log(blogData);
    return new BlogPost(blogData);
  }

  static async findById(id) {
    const blogData = await BlogPostDao.getBlogById(id);
    if (!blogData) {
      return null;
    }
    return new BlogPost(blogData);
  }

  static async findByUserId(userId) {
    const blogsData = await BlogPostDao.getBlogsByUserId(userId);
    return blogsData.map(data => new BlogPost(data));
  }

  static async searchByCountry(country) {
    if (!country) {
      throw new Error('Country is required for search');
    }
    const blogsData = await BlogPostDao.searchBlogsByCountry(country);
    return blogsData.map(data => new BlogPost(data));
  }

  static async findRecent(limit = 10) {
    console.log("TEst recent");
    const blogsData = await BlogPostDao.getRecentBlogs(limit);
    return blogsData.map(data => new BlogPost(data));
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
    const changes = await BlogPostDao.updateBlog(this.id, title, content, country, visitDate, this.user_id);
    if (changes === 0) {
      throw new Error('Update failed or unauthorized');
    }
    const updatedBlog = await BlogPostDao.getBlogById(this.id);
    return new BlogPost(updatedBlog);
  }

  async delete() {
      const changes = await BlogPostDao.deleteBlog(this.id, this.user_id);
      if (changes === 0) {
        throw new Error('Delete failed or unauthorized');
      }
  }
}
  
export default BlogPost;  