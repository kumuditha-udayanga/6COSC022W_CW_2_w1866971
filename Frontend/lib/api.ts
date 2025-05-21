import axios, { AxiosError } from "axios"
import type { Blog, BlogDetail, Comment, UserProfile } from "@/lib/types"

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true
})

const handleApiError = (error: any) => {
  if (error instanceof AxiosError && error.response) {
    const errorMessage = error.response.data?.error || error.message
    throw new Error(errorMessage)
  }
  throw error
}

class Api {
  private apiKey: string | null = null

  setApiKey(key: string | null) {
    this.apiKey = key

    if (key) {
      axiosInstance.defaults.headers.common["x-api-key"] = key
    } else {
      delete axiosInstance.defaults.headers.common["x-api-key"]
    }
  }

  async register(username: string, email: string, password: string) {
    try {
      const response = await axiosInstance.post("/auth/register", {
        username,
        email,
        password,
      })
      return response.data
    } catch (error) {
      handleApiError(error)
    }
  }

  async login(email: string, password: string) {
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      })
      return response.data
    } catch (error) {
      handleApiError(error)
    }
  }

  async logout() {
    try {
      const response = await axiosInstance.post("/auth/logout")
      return response.data
    } catch (error) {
      handleApiError(error)
    }
  }

  async getRecentBlogs(limit = 10, offset = 0): Promise<Blog[]> {
    try {
      const response = await axiosInstance.get("/blogs/recent", {
        params: { limit, offset },
      })
      return response.data.blogs.map((blog: any) => ({
        ...blog,
        username: blog.username || "",
      }))
    } catch (error) {
      handleApiError(error)
      return []
    }
  }

  async getPopularBlogs(sort: "liked" | "commented" = "liked", limit = 10, offset = 0): Promise<Blog[]> {
    try {
      const response = await axiosInstance.get("/blogs/popular", {
        params: { sort, limit, offset },
      })
      return response.data.blogs.map((blog: any) => ({
        ...blog,
        username: blog.username || "",
      }))
    } catch (error) {
      handleApiError(error)
      return []
    }
  }

  async searchBlogs(country?: string, username?: string, limit = 10, offset = 0): Promise<Blog[]> {
    try {
      const response = await axiosInstance.get("/blogs/search", {
        params: { country, username, limit, offset },
      })
      return response.data.blogs.map((blog: any) => ({
        ...blog,
        username: blog.username || "",
      }))
    } catch (error) {
      handleApiError(error)
      return []
    }
  }

  async getBlogDetail(id: number): Promise<BlogDetail> {
    try {
      const response = await axiosInstance.get(`/blogs/${id}`)
      return response.data
    } catch (error) {
      handleApiError(error)
      throw error
    }
  }

  async createBlog(title: string, content: string, country: string, visitDate: string) {
    try {
      const response = await axiosInstance.post("/blogs", {
        title,
        content,
        country,
        visitDate,
      })
      return response.data
    } catch (error) {
      handleApiError(error)
      throw error
    }
  }

  async updateBlog(id: number, data: { title?: string; content?: string; country?: string; visit_date?: string }) {
    try {
      const response = await axiosInstance.put(`/blogs/${id}`, data)
      return response.data
    } catch (error) {
      handleApiError(error)
      throw error
    }
  }

  async deleteBlog(id: number) {
    try {
      const response = await axiosInstance.delete(`/blogs/${id}`)
      return response.data
    } catch (error) {
      handleApiError(error)
      throw error
    }
  }

  async getUserProfile(id: number): Promise<UserProfile> {
    try {
      const response = await axiosInstance.get(`/users/${id}`)
      return response.data
    } catch (error) {
      handleApiError(error)
      throw error
    }
  }

  async followUser(followedId: number) {
    try {
      const response = await axiosInstance.post("/follow/follow", { followedId })
      return response.data
    } catch (error) {
      handleApiError(error)
      throw error
    }
  }

  async unfollowUser(followedId: number) {
    try {
      const response = await axiosInstance.post("/follow/unfollow", { followedId })
      return response.data
    } catch (error) {
      handleApiError(error)
      throw error
    }
  }

  async getFollowedBlogs(limit = 10, offset = 0): Promise<Blog[]> {
    try {
      const response = await axiosInstance.get("/follow/followed-blogs", {
        params: { limit, offset },
      })
      return response.data.blogs
    } catch (error) {
      handleApiError(error)
      return []
    }
  }

  async likeBlog(blogId: number, isLike: boolean) {
    try {
      const response = await axiosInstance.post("/comments/like", { blogId, isLike })
      return response.data
    } catch (error) {
      handleApiError(error)
      throw error
    }
  }

  async commentOnBlog(blogId: number, content: string): Promise<Comment> {
    try {
      const response = await axiosInstance.post("/comments/comment", { blogId, content })
      return response.data
    } catch (error) {
      handleApiError(error)
      throw error
    }
  }

  async getComments(blogId: number): Promise<Comment[]> {
    try {
      const response = await axiosInstance.get("/comments", {
        params: { blogId },
      })
      return response.data.comments
    } catch (error) {
      handleApiError(error)
      return []
    }
  }
}

export const api = new Api()
