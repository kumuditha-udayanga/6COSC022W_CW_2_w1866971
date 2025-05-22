"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context"
import { api } from "@/lib/api"
import type { BlogDetail } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import {Edit, MessageSquare, ThumbsDown, ThumbsUp, Trash} from "lucide-react"
import Link from "next/link"
import {Input} from "@/components/ui/input";

export default function BlogDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [blog, setBlog] = useState<BlogDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [comment, setComment] = useState("")
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [isLiking, setIsLiking] = useState(false)
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editCountry, setEditCountry] = useState("");
  const [editVisitDate, setEditVisitDate] = useState("");
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const data = await api.getBlogDetail(Number(id))
        setBlog(data)
      } catch (error) {
        toast.error("Failed to load blog post")
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchBlog()
    }
  }, [id, toast, comment, isLiking])

  const handleLike = async (isLike: boolean) => {
    if (!user) {
      toast.info("Please log in to like posts");
      return
    }

    setIsLiking(true)
    try {
      await api.likeBlog(Number(id), isLike)

      setBlog((prev) => {
        if (!prev) return prev

        const newLikes = { ...prev.likes }
        if (isLike) {
          newLikes.likes += 1
        } else {
          newLikes.dislikes += 1
        }

        return { ...prev, likes: newLikes }
      })

      toast.info(`You ${isLike ? "liked" : "disliked"} this post`)
    } catch (error) {
      toast.error("Failed to record your reaction")
    } finally {
      setIsLiking(false)
    }
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast.info("Please log in to comment")
      return
    }

    if (!comment.trim()) return

    setIsSubmittingComment(true)
    try {
      const newComment = await api.commentOnBlog(Number(id), comment)

      setBlog((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          comments: [...prev.comments, newComment],
        }
      })

      setComment("")
      toast.success("Your comment has been posted")
    } catch (error) {
      toast.error("Failed to post your comment")
    } finally {
      setIsSubmittingComment(false)
    }
  }

  const handleDeleteBlog = async () => {
    if (!user || !blog || user.user_id !== blog.blog.user_id) return

    if (!confirm("Are you sure you want to delete this blog post?")) return

    try {
      await api.deleteBlog(Number(id))
      toast.success("Your blog post has been deleted")
      router.push("/")
    } catch (error) {
      toast.error("Failed to delete blog post")
    }
  }

  const handleEditBlog = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !blog || user.user_id !== blog.blog.user_id) return;

    if (!editTitle.trim() || !editContent.trim()) {
      toast.error("Title and content cannot be empty");
      return;
    }

    setIsSubmittingEdit(true);
    try {
      const updatedBlog = await api.updateBlog(Number(id), {
        title: editTitle,
        content: editContent,
        country: editCountry,
        visitDate: editVisitDate
      });

      setBlog((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          blog: {
            ...prev.blog,
            title: updatedBlog.title,
            content: updatedBlog.content,
          },
        };
      });

      setIsEditing(false);
      toast.success("Your blog post has been updated");
      router.push(`/profile/${blog.blog.user_id}`)
    } catch (error) {
      toast.error("Failed to update blog post");
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (blog) {
      setEditTitle(blog.blog.title);
      setEditContent(blog.blog.content);
      setEditCountry(blog.blog.country);
      setEditVisitDate(blog.blog.visit_date);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-6 md:py-10 mx-auto">
          <Skeleton className="h-10 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/3 mb-8" />
          <Skeleton className="h-40 w-full mb-6" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-3/4" />
        </div>
      </main>
    )
  }

  if (!blog) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-6 md:py-10 text-center mx-auto">
          <h1 className="text-2xl font-bold">Blog post not found</h1>
        </div>
      </main>
    )
  }
  console.log(blog.blog.user_id);
  console.log(user);
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-6 md:py-10 mx-auto">
        <article className="prose prose-stone max-w-none">
          <header className="mb-8">
            {isEditing ? (
                <form onSubmit={handleEditBlog} className="space-y-4">
                  <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Blog title"
                      className="text-3xl font-bold md:text-4xl"
                  />
                  <div className="flex items-center space-x-2">
                    <Button
                        type="submit"
                        disabled={isSubmittingEdit || !editTitle.trim() || !editContent.trim()}
                    >
                      {isSubmittingEdit ? "Saving..." : "Save"}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleEditToggle}
                        disabled={isSubmittingEdit}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
            ) : (
                <h1 className="text-3xl font-bold md:text-4xl">{blog.blog.title}</h1>
            )}
            <div className="mt-4 flex items-center space-x-2">
              <Link href={`/profile/${blog.blog.user_id}`} className="flex items-center space-x-2 no-underline">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{blog?.user.username ? blog?.user.username.substring(0, 2).toUpperCase() : "UN"}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{blog.blog.username}</span>
              </Link>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">{formatDate(blog.blog.created_at)}</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">{blog.blog.country}</span>

              {user && user.user_id === blog.blog.user_id && (
                <>
                  <span className="text-muted-foreground">•</span>
                  <Button
                      variant="ghost"
                      size="sm"
                      className="h-8"
                      onClick={handleEditToggle}
                      disabled={isSubmittingEdit}
                  >
                    <Edit className="mr-1 h-4 w-4" />
                    Edit
                  </Button>
                  <span className="text-muted-foreground">•</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-destructive hover:text-destructive"
                    onClick={handleDeleteBlog}
                  >
                    <Trash className="mr-1 h-4 w-4" />
                    Delete
                  </Button>
                </>
              )}
            </div>
          </header>

          {isEditing ? (
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="Blog content"
              className="min-h-[300px] mb-8"
            />
          ) : (
              <div className="mb-8 whitespace-pre-wrap">{blog.blog.content}</div>
          )}

          <div className="flex items-center space-x-4 mb-8">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center space-x-1"
              onClick={() => handleLike(true)}
              disabled={isLiking || !user}
            >
              <ThumbsUp className="h-4 w-4" />
              <span>{blog.likes.likes}</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="flex items-center space-x-1"
              onClick={() => handleLike(false)}
              disabled={isLiking || !user}
            >
              <ThumbsDown className="h-4 w-4" />
              <span>{blog.likes.dislikes}</span>
            </Button>

            <div className="flex items-center space-x-1 text-muted-foreground">
              <MessageSquare className="h-4 w-4" />
              <span>{blog.comments.length} comments</span>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Comments</h2>

            {user ? (
              <form onSubmit={handleCommentSubmit} className="mb-6">
                <Textarea
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="mb-2"
                />
                <Button type="submit" disabled={!comment.trim() || isSubmittingComment}>
                  {isSubmittingComment ? "Posting..." : "Post Comment"}
                </Button>
              </form>
            ) : (
              <p className="mb-6 text-muted-foreground">
                <Link href="/login" className="text-primary hover:underline">
                  Log in
                </Link>{" "}
                to leave a comment
              </p>
            )}

            {blog.comments.length > 0 ? (
              <div className="space-y-4">
                {blog.comments.map((comment) => (
                  <Card key={comment.id}>
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-center space-x-2">
                        <Link href={`/profile/${comment.user_id}`} className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback>
                              {comment.username ? comment.username.substring(0, 2).toUpperCase() : "UN"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{comment.username}</span>
                        </Link>
                        <span className="text-xs text-muted-foreground">{formatDate(comment.created_at)}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p>{comment.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No comments yet</p>
            )}
          </div>
        </article>
      </div>
    </main>
  )
}
