'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ArrowLeft, Plus, Edit2, Trash2, Eye, EyeOff, Upload, X } from 'lucide-react'

interface NewsPost {
  id: string
  title_en: string
  title_ha?: string
  content_en: string
  content_ha?: string
  excerpt_en?: string
  excerpt_ha?: string
  featured_image?: string
  published: boolean
  author: string
  tags?: string[]
  created_at: string
  updated_at: string
}

export default function NewsManagement() {
  const [posts, setPosts] = useState<NewsPost[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<NewsPost | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form state
  const [formData, setFormData] = useState({
    title_en: '',
    title_ha: '',
    content_en: '',
    content_ha: '',
    excerpt_en: '',
    excerpt_ha: '',
    featured_image: '',
    published: false,
    author: 'Admin',
    tags: '',
  })

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      const response = await fetch('/api/news')
      if (response.ok) {
        const data = await response.json()
        setPosts(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching news:', error)
      setError('Failed to load news posts')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB')
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        const base64String = event.target?.result as string
        setFormData(prev => ({ ...prev, featured_image: base64String }))
        setError('')
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setFormData(prev => ({ ...prev, featured_image: '' }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const resetForm = () => {
    setFormData({
      title_en: '',
      title_ha: '',
      content_en: '',
      content_ha: '',
      excerpt_en: '',
      excerpt_ha: '',
      featured_image: '',
      published: false,
      author: 'Admin',
      tags: '',
    })
    setEditing(null)
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const tagsArray = formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []

      const payload = {
        ...formData,
        tags: tagsArray,
      }

      const url = editing ? `/api/news/${editing.id}` : '/api/news'
      const method = editing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (!response.ok) {
        if (result.details) {
          const errorMessages = Object.values(result.details).join(', ')
          setError(`Validation failed: ${errorMessages}`)
        } else {
          setError(result.error || 'Failed to save news post')
        }
        return
      }

      setSuccess(editing ? 'News post updated successfully!' : 'News post created successfully!')
      resetForm()
      fetchNews()
      setCreating(false)
    } catch (err) {
      setError('An unexpected error occurred')
      console.error('Submit error:', err)
    }
  }

  const handleEdit = (post: NewsPost) => {
    setEditing(post)
    setFormData({
      title_en: post.title_en,
      title_ha: post.title_ha || '',
      content_en: post.content_en,
      content_ha: post.content_ha || '',
      excerpt_en: post.excerpt_en || '',
      excerpt_ha: post.excerpt_ha || '',
      featured_image: post.featured_image || '',
      published: post.published,
      author: post.author,
      tags: post.tags?.join(', ') || '',
    })
    setCreating(true)
  }

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this news post?')) return

    try {
      const response = await fetch(`/api/news/${postId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setSuccess('News post deleted successfully!')
        fetchNews()
      } else {
        setError('Failed to delete news post')
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error('Delete error:', err)
    }
  }

  const togglePublish = async (post: NewsPost) => {
    try {
      const response = await fetch(`/api/news/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...post, published: !post.published }),
      })

      if (response.ok) {
        setSuccess(`News post ${!post.published ? 'published' : 'unpublished'} successfully!`)
        fetchNews()
      } else {
        setError('Failed to update publication status')
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error('Toggle publish error:', err)
    }
  }

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
          <Dialog open={creating} onOpenChange={(open) => { if (!open) resetForm(); setCreating(open) }}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-primary hover:bg-primary/90 text-white">
                <Plus size={18} />
                New Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editing ? 'Edit News Post' : 'Create New News Post'}</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="bg-green-50 border-green-200">
                    <AlertDescription className="text-green-800">{success}</AlertDescription>
                  </Alert>
                )}

                <Tabs defaultValue="english" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="english">English</TabsTrigger>
                    <TabsTrigger value="hausa">Hausa</TabsTrigger>
                  </TabsList>

                  <TabsContent value="english" className="space-y-4">
                    <div>
                      <Label htmlFor="title_en">Title (English) *</Label>
                      <Input
                        id="title_en"
                        value={formData.title_en}
                        onChange={(e) => setFormData(prev => ({ ...prev, title_en: e.target.value }))}
                        placeholder="Enter news title in English"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="excerpt_en">Excerpt (English)</Label>
                      <Textarea
                        id="excerpt_en"
                        value={formData.excerpt_en}
                        onChange={(e) => setFormData(prev => ({ ...prev, excerpt_en: e.target.value }))}
                        placeholder="Brief summary in English"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="content_en">Content (English) *</Label>
                      <Textarea
                        id="content_en"
                        value={formData.content_en}
                        onChange={(e) => setFormData(prev => ({ ...prev, content_en: e.target.value }))}
                        placeholder="Full news content in English"
                        rows={10}
                        required
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="hausa" className="space-y-4">
                    <div>
                      <Label htmlFor="title_ha">Title (Hausa)</Label>
                      <Input
                        id="title_ha"
                        value={formData.title_ha}
                        onChange={(e) => setFormData(prev => ({ ...prev, title_ha: e.target.value }))}
                        placeholder="Enter news title in Hausa"
                      />
                    </div>

                    <div>
                      <Label htmlFor="excerpt_ha">Excerpt (Hausa)</Label>
                      <Textarea
                        id="excerpt_ha"
                        value={formData.excerpt_ha}
                        onChange={(e) => setFormData(prev => ({ ...prev, excerpt_ha: e.target.value }))}
                        placeholder="Brief summary in Hausa"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="content_ha">Content (Hausa)</Label>
                      <Textarea
                        id="content_ha"
                        value={formData.content_ha}
                        onChange={(e) => setFormData(prev => ({ ...prev, content_ha: e.target.value }))}
                        placeholder="Full news content in Hausa"
                        rows={10}
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Featured Image */}
                <div>
                  <Label>Featured Image</Label>
                  {!formData.featured_image ? (
                    <div className="mt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="gap-2"
                      >
                        <Upload size={16} />
                        Upload Image
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <div className="mt-2 relative">
                      <img
                        src={formData.featured_image}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 w-6 h-6 p-0"
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="campaign, politics, development"
                  />
                </div>

                {/* Publish Toggle */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="published"
                    checked={formData.published}
                    onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                  />
                  <Label htmlFor="published">Publish immediately</Label>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1">
                    {editing ? 'Update Post' : 'Create Post'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setCreating(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <p className="text-foreground/60">Loading news posts...</p>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-foreground/60 mb-4">No news posts yet</p>
            <Button
              onClick={() => setCreating(true)}
              className="gap-2 bg-primary hover:bg-primary/90 text-white"
            >
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
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-lg text-foreground">
                        {post.title_en}
                      </h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        post.published
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/60 mb-3">
                      {post.excerpt_en || post.content_en.substring(0, 150) + '...'}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-foreground/50">
                      <span>By {post.author}</span>
                      <span>{new Date(post.created_at).toLocaleDateString()}</span>
                      {post.tags && post.tags.length > 0 && (
                        <span>Tags: {post.tags.join(', ')}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => togglePublish(post)}
                      className="gap-2"
                    >
                      {post.published ? <EyeOff size={16} /> : <Eye size={16} />}
                      {post.published ? 'Unpublish' : 'Publish'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(post)}
                      className="gap-2"
                    >
                      <Edit2 size={16} />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(post.id)}
                      className="gap-2 text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                      Delete
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
