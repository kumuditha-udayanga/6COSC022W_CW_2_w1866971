import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import type { Blog } from "@/lib/types"
import { formatDate, truncateText } from "@/lib/utils"
import { MapPin } from "lucide-react"

interface BlogCardProps {
  blog: Blog
}

export function BlogCard({ blog }: BlogCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4">
        <Link href={`/blog/${blog.id}`} className="hover:underline">
          <h3 className="text-lg font-semibold line-clamp-2">{blog.title}</h3>
        </Link>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-muted-foreground mb-4 line-clamp-3">{truncateText(blog.content, 150)}</p>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="mr-1 h-4 w-4" />
          <span>{blog.country}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{formatDate(blog.created_at)}</span>
      </CardFooter>
    </Card>
  )
}
