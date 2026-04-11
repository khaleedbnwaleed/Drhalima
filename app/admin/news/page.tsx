'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Plus, Edit2, Trash2 } from 'lucide-react'

interface NewsPost {
  id: string
  title_en: string
  title_ha: string
  excerpt_en: string
  published: boolean
  created_at: string
}

export default function NewsManagement() {
  const [posts, setPosts] = useState<NewsPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // TODO: Create /api/news endpoint
        setPosts([])
      } catch (error) {
        console.error('Error fetching news:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowLeft size={18} />
                Back
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-primary">News Management</h1>
          </div>
          <Button className="gap-2 bg-primary hover:bg-primary/90 text-white">
            <Plus size={18} />
            New Post
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-8">
        {loading ? (
          <p className="text-foreground/60">Loading news posts...</p>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-foreground/60 mb-4">No news posts yet</p>
            <Button className="gap-2 bg-primary hover:bg-primary/90 text-white">
              <Plus size={18} />
              Create First Post
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-foreground mb-2">
                      {post.title_en}
                    </h3>
                    <p className="text-sm text-foreground/60 mb-3">
                      {post.excerpt_en}
                    </p>
                    <div className="flex items-center gap-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        post.published
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                      <p className="text-xs text-foreground/50">
                        {new Date(post.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Edit2 size={16} />
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 text-red-600 hover:text-red-700">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Info Box */}
        <Card className="mt-8 p-6 bg-blue-50 border-blue-200">
          <h3 className="font-bold text-blue-900 mb-2">News Management</h3>
          <p className="text-sm text-blue-800">
            Create, edit, and manage campaign news articles. Posts can be bilingual (English & Hausa) 
            and scheduled for future publication. All posts must be approved before going live.
          </p>
        </Card>
      </main>
    </div>
  )
}
