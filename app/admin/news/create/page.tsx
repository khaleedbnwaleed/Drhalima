'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, Upload, Save, AlertCircle } from 'lucide-react'

export default function CreateNewsPost() {
  const [formData, setFormData] = useState({
    title_en: '',
    title_ha: '',
    content_en: '',
    content_ha: '',
    excerpt_en: '',
    excerpt_ha: '',
    published: false,
    tags: [] as string[],
  })
  const [featuredImage, setFeaturedImage] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB')
        return
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('File must be an image')
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        const base64String = event.target?.result as string
        setFeaturedImage(base64String)
        setImagePreview(base64String)
        setError('')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          featured_image: featuredImage,
          author: 'Admin',
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || 'Failed to create news post')
        return
      }

      setSuccess('News post created successfully!')
      setTimeout(() => {
        router.push('/admin/news')
      }, 2000)
    } catch (err) {
      setError('An error occurred while creating the news post')
      console.error('Create news error:', err)
    } finally {
      setLoading(false)
    }
  }

  const addTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData({ ...formData, tags: [...formData.tags, tag] })
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/news">
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowLeft size={18} />
                Back to News
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-primary">Create News Post</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 md:px-8 lg:px-16 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* English Content */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">English Content</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title_en">Title (English) *</Label>
                <Input
                  id="title_en"
                  value={formData.title_en}
                  onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                  placeholder="Enter news title in English"
                  required
                />
              </div>

              <div>
                <Label htmlFor="excerpt_en">Excerpt (English)</Label>
                <Textarea
                  id="excerpt_en"
                  value={formData.excerpt_en}
                  onChange={(e) => setFormData({ ...formData, excerpt_en: e.target.value })}
                  placeholder="Brief summary in English (optional)"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="content_en">Content (English) *</Label>
                <Textarea
                  id="content_en"
                  value={formData.content_en}
                  onChange={(e) => setFormData({ ...formData, content_en: e.target.value })}
                  placeholder="Full news content in English"
                  rows={10}
                  required
                />
              </div>
            </div>
          </Card>

          {/* Hausa Content */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Hausa Content (Optional)</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title_ha">Title (Hausa)</Label>
                <Input
                  id="title_ha"
                  value={formData.title_ha}
                  onChange={(e) => setFormData({ ...formData, title_ha: e.target.value })}
                  placeholder="Enter news title in Hausa"
                />
              </div>

              <div>
                <Label htmlFor="excerpt_ha">Excerpt (Hausa)</Label>
                <Textarea
                  id="excerpt_ha"
                  value={formData.excerpt_ha}
                  onChange={(e) => setFormData({ ...formData, excerpt_ha: e.target.value })}
                  placeholder="Brief summary in Hausa (optional)"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="content_ha">Content (Hausa)</Label>
                <Textarea
                  id="content_ha"
                  value={formData.content_ha}
                  onChange={(e) => setFormData({ ...formData, content_ha: e.target.value })}
                  placeholder="Full news content in Hausa"
                  rows={10}
                />
              </div>
            </div>
          </Card>

          {/* Featured Image */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Featured Image</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="featured_image">Upload Image</Label>
                <Input
                  id="featured_image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/80"
                />
              </div>

              {imagePreview && (
                <div className="mt-4">
                  <Label>Preview</Label>
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Featured image preview"
                      className="max-w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Tags */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Tags</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="tags">Add Tags</Label>
                <div className="flex gap-2">
                  <Input
                    id="tags"
                    placeholder="Enter tag and press Enter"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        const input = e.target as HTMLInputElement
                        addTag(input.value.trim())
                        input.value = ''
                      }
                    }}
                  />
                </div>
              </div>

              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary/10 text-primary"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-primary hover:text-primary/80"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Publishing Options */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Publishing Options</h2>
            <div className="flex items-center space-x-2">
              <Switch
                id="published"
                checked={formData.published}
                onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
              />
              <Label htmlFor="published">Publish immediately</Label>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {formData.published
                ? 'This post will be published and visible to the public.'
                : 'This post will be saved as a draft and not visible to the public.'}
            </p>
          </Card>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Link href="/admin/news">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={loading} className="gap-2">
              <Save size={18} />
              {loading ? 'Creating...' : 'Create Post'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}