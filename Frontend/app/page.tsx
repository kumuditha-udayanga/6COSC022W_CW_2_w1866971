import { Suspense } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navbar } from "@/components/navbar"
import { BlogList } from "@/components/blog-list"
import { BlogSkeleton } from "@/components/blog-skeleton"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-6 md:py-10 mx-auto">
        <h1 className="mb-6 text-3xl font-bold tracking-tight">Blog Posts</h1>
        <Tabs defaultValue="recent" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="followed-user-blogs">Followed Feed</TabsTrigger>
            <TabsTrigger value="most-liked">Most Liked</TabsTrigger>
            <TabsTrigger value="most-commented">Most Commented</TabsTrigger>
          </TabsList>
          <TabsContent value="recent">
            <Suspense fallback={<BlogSkeleton count={5} />}>
              <BlogList type="recent" />
            </Suspense>
          </TabsContent>
          <TabsContent value="followed-user-blogs">
            <Suspense fallback={<BlogSkeleton count={5} />}>
              <BlogList type="followed" />
            </Suspense>
          </TabsContent>
          <TabsContent value="most-liked">
            <Suspense fallback={<BlogSkeleton count={5} />}>
              <BlogList type="popular" sort="liked" />
            </Suspense>
          </TabsContent>
          <TabsContent value="most-commented">
            <Suspense fallback={<BlogSkeleton count={5} />}>
              <BlogList type="popular" sort="commented" />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
