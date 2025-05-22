"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { BlogCard } from "@/components/blog-card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/lib/auth-context"
import { api } from "@/lib/api"
import type { UserProfile } from "@/lib/types"
import { toast } from "sonner";
import Link from "next/link"

export default function ProfilePage() {
  const { id } = useParams()
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFollowing, setIsFollowing] = useState(false)
  const [isFollowingLoading, setIsFollowingLoading] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log("user")
        console.log(id)
        const data = await api.getUserProfile(Number(id))
        setProfile(data)

        if (user && data.followers) {
          setIsFollowing(data.followers.some((follower) => follower.id === user.user_id))
        }
      } catch (error) {
        toast.error("Failed to load user profile")
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchProfile()
    }
  }, [id, user, toast])

  const handleFollowToggle = async () => {
    if (!user) {
      toast.warning("Please log in to follow users")
      return
    }

    setIsFollowingLoading(true)
    try {
      if (isFollowing) {
        await api.unfollowUser(Number(id))
        setIsFollowing(false)
        toast.info(`You are no longer following ${profile?.user.username}`)
      } else {
        await api.followUser(Number(id))
        setIsFollowing(true)
        toast.success(`You are now following ${profile?.user.username}`)
      }
    } catch (error) {
      toast.error("Failed to update follow status")
    } finally {
      setIsFollowingLoading(false)
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-6 md:py-10 mx-auto">
          <div className="flex flex-col items-center space-y-4">
            <Skeleton className="h-24 w-24 rounded-full" />
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </main>
    )
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-6 md:py-10 text-center mx-auto">
          <h1 className="text-2xl font-bold">User not found</h1>
        </div>
      </main>
    )
  }

  const { user: profileUser, blogs, followers, following } = profile

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-6 md:py-10 mx-auto">
        <div className="mb-8 flex flex-col items-center space-y-4 text-center">
          <Avatar className="h-24 w-24">
            <AvatarFallback>
              {profileUser.username ? profileUser.username.substring(0, 2).toUpperCase() : "UN"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{profileUser.username}</h1>
            <p className="text-muted-foreground">{profileUser.email}</p>
          </div>

          <div className="flex space-x-4 text-sm">
            <div>
              <span className="font-bold">{blogs.length}</span> blogs
            </div>
            <div>
              <span className="font-bold">{followers.length}</span> followers
            </div>
            <div>
              <span className="font-bold">{following.length}</span> following
            </div>
          </div>

          {user && user.user_id !== Number(id) && (
            <Button
              onClick={handleFollowToggle}
              variant={isFollowing ? "outline" : "default"}
              disabled={isFollowingLoading}
            >
              {isFollowingLoading ? "Loading..." : isFollowing ? "Unfollow" : "Follow"}
            </Button>
          )}
        </div>

        <Tabs defaultValue="blogs" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="blogs">Blogs</TabsTrigger>
            <TabsTrigger value="followers">Followers</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>

          <TabsContent value="blogs">
            {blogs.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {blogs.map((blog) => (
                  <BlogCard key={blog.id} blog={blog} />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">No blogs yet</p>
            )}
          </TabsContent>

          <TabsContent value="followers">
            {followers.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                {followers.map((follower) => (
                  <Link href={`/profile/${follower.id}`} className="flex items-center space-x-2 no-underline" key={follower.id}>
                    <div key={follower.id} className="flex items-center space-x-2 rounded-lg border p-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {follower.username ? follower.username.substring(0, 2).toUpperCase() : "UN"}
                          </AvatarFallback>
                        </Avatar>
                      <span>{follower.username}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">No followers yet</p>
            )}
          </TabsContent>

          <TabsContent value="following">
            {following.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                {following.map((follow) => (
                  <Link href={`/profile/${follow.id}`} className="flex items-center space-x-2 no-underline">
                    <div key={follow.id} className="flex items-center space-x-2 rounded-lg border p-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {follow.username ? follow.username.substring(0, 2).toUpperCase() : "UN"}
                          </AvatarFallback>
                        </Avatar>
                      <span>{follow.username}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">Not following anyone yet</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
