'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Trash2 } from 'lucide-react'

interface Message {
  id: string
  name: string
  email: string
  subject: string
  message: string
  read: boolean
  created_at: string
}

export default function MessagesManagement() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('/api/contact')
        const data = await response.json()
        setMessages(data || [])
      } catch (error) {
        console.error('Error fetching messages:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return
    
    try {
      // TODO: Implement delete endpoint
      setMessages(messages.filter(m => m.id !== id))
    } catch (error) {
      console.error('Error deleting message:', error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-4 flex items-center gap-4">
          <Link href="/admin">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft size={18} />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-primary">Contact Messages</h1>
          <span className="ml-auto text-sm text-foreground/60">
            {messages.length} messages
          </span>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-8">
        <div className="space-y-4">
          {loading ? (
            <p className="text-foreground/60">Loading messages...</p>
          ) : messages.length === 0 ? (
            <p className="text-foreground/60">No messages yet</p>
          ) : (
            messages.map((msg) => (
              <Card 
                key={msg.id} 
                className={`p-6 cursor-pointer hover:shadow-md transition-shadow ${
                  !msg.read ? 'border-l-4 border-l-primary' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-foreground">
                      {msg.subject}
                    </h3>
                    <p className="text-sm text-foreground/60">
                      {msg.name} ({msg.email})
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <p className="text-foreground/80 mb-3 line-clamp-2">
                  {msg.message}
                </p>

                <div className="flex items-center justify-between text-xs text-foreground/50">
                  <span>
                    {new Date(msg.created_at).toLocaleDateString()} at{' '}
                    {new Date(msg.created_at).toLocaleTimeString()}
                  </span>
                  {!msg.read && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      Unread
                    </span>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
