"use client"

import { useEffect, useState } from "react"
import { BlogCard } from "@/components/blog-card"
import { BlogSkeleton } from "@/components/blog-skeleton"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { api } from "@/lib/api"
import type { Blog } from "@/lib/types"

interface BlogListProps {
  type: "recent" | "popular" | "search"
  sort?: "liked" | "commented"
  searchParams?: {
    country?: string
    username?: string
  }
}

export function BlogList({ type, sort = "liked", searchParams }: BlogListProps) {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const { toast } = useToast()
  const limit = 6

  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true)
      setError(null)

      try {
        let data: Blog[] = []

        switch (type) {
          case "recent":
            data = await api.getRecentBlogs(limit, page * limit)
            break
          case "popular":
            data = await api.getPopularBlogs(sort, limit, page * limit)
            break
          case "search":
            if (searchParams) {
              data = await api.searchBlogs(searchParams.country, searchParams.username, limit, page * limit)
            }
            break
        }

        if (page === 0) {
          setBlogs(data)
        } else {
          setBlogs((prev) => [...prev, ...data])
        }

        setHasMore(data.length === limit)
      } catch (error: any) {
        setError(error.message || "Failed to load blogs")
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to load blogs",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlogs()
  }, [type, sort, page, searchParams, toast, limit])

  const loadMore = () => {
    setPage((prev) => prev + 1)
  }

  if (isLoading && page === 0) {
    return <BlogSkeleton count={limit} />
  }

  if (error && blogs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">{error}</p>
      </div>
    )
  }

  if (blogs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No blogs found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-6">
          <Button onClick={loadMore} variant="outline" disabled={isLoading}>
            {isLoading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  )
}
