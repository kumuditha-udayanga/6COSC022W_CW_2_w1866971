export interface User {
  user_id: number
  apiKey: string
  username: string
}

export interface Blog {
  id: number
  title: string
  content: string
  country: string
  visit_date: string
  user_id: number
  username: string
  created_at: string
}

export interface BlogDetail {
  blog: Blog
  likes: {
    likes: number
    dislikes: number
  }
  comments: Comment[]
}

export interface Comment {
  id: number
  blog_id: number
  user_id: number
  username: string
  content: string
  created_at: string
}

export interface UserProfile {
  user: {
    id: number
    username: string
    email: string
  }
  blogs: Blog[]
  followers: {
    id: number
    username: string
  }[]
  following: {
    id: number
    username: string
  }[]
}
