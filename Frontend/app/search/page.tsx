"use client"

import type React from "react"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { BlogList } from "@/components/blog-list"
import { BlogSkeleton } from "@/components/blog-skeleton"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Search } from "lucide-react"

export default function SearchPage() {
  const [country, setCountry] = useState("")
  const [username, setUsername] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchParams, setSearchParams] = useState<{
    country?: string
    username?: string
  } | null>(null)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!country && !username) return

    setIsSearching(true)
    setSearchParams({
      ...(country ? { country } : {}),
      ...(username ? { username } : {}),
    })
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-6 md:py-10 mx-auto">
        <h1 className="mb-6 text-3xl font-bold tracking-tight">Search Blogs</h1>

        <form onSubmit={handleSearch} className="mb-8 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                placeholder="Search by country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Search by username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>
          <Button type="submit" className="w-full md:w-auto">
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </form>

        {searchParams && (
          <>
            <h2 className="mb-4 text-xl font-semibold">Search Results</h2>
            {isSearching ? <BlogList type="search" searchParams={searchParams} /> : <BlogSkeleton count={3} />}
          </>
        )}
      </div>
    </main>
  )
}
