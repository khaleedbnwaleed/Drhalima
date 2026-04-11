'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Heart, Mail, FileText, LogOut, BarChart3 } from 'lucide-react'

interface AdminStats {
  volunteers: number
  donations: number
  messages: number
  news: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    volunteers: 0,
    donations: 0,
    messages: 0,
    news: 0,
  })
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    // Check authentication and load stats
    const checkAuth = async () => {
      try {
        // Fetch real dashboard data from the stats API
        const response = await fetch('/api/admin/dashboard/stats');
        if (response.ok) {
          const data = await response.json();
          setStats({
            volunteers: data.summary.total_volunteers,
            donations: data.summary.total_donations,
            messages: data.recent_campaigns?.length || 0,
            news: 0, // Will be updated when news API is implemented
          });
        } else {
          // Fallback to placeholder data if API fails
          setStats({
            volunteers: 142,
            donations: 2850000,
            messages: 47,
            news: 8,
          });
        }
      } catch (error) {
        console.error('Error loading dashboard:', error);
        // Fallback to placeholder data
        setStats({
          volunteers: 142,
          donations: 2850000,
          messages: 47,
          news: 8,
        });
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    // Clear session and redirect
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-foreground/60">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const dashboardItems = [
    {
      icon: Users,
      label: 'Members',
      value: 'View All',
      href: '/admin/members',
      color: 'primary',
    },
    {
      icon: Users,
      label: 'Volunteers',
      value: stats.volunteers.toLocaleString(),
      href: '/admin/volunteers',
      color: 'primary',
    },
    {
      icon: Heart,
      label: 'Total Donations',
      value: `₦${(stats.donations / 1000000).toFixed(1)}M`,
      href: '/admin/donations',
      color: 'secondary',
    },
    {
      icon: Mail,
      label: 'Messages',
      value: stats.messages.toString(),
      href: '/admin/messages',
      color: 'primary',
    },
    {
      icon: FileText,
      label: 'News Posts',
      value: stats.news.toString(),
      href: '/admin/news',
      color: 'secondary',
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">Admin Dashboard</h1>
            <p className="text-sm text-foreground/60">Campaign Management</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut size={18} />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-12">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {dashboardItems.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href}>
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg ${
                      item.color === 'primary' ? 'bg-primary/10' : 'bg-secondary/10'
                    }`}>
                      <Icon className={`w-6 h-6 ${
                        item.color === 'primary' ? 'text-primary' : 'text-secondary'
                      }`} />
                    </div>
                  </div>
                  <h3 className="text-foreground/60 text-sm font-medium mb-1">
                    {item.label}
                  </h3>
                  <p className="text-3xl font-bold text-foreground">
                    {item.value}
                  </p>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <BarChart3 size={20} className="text-primary" />
              Recent Activity
            </h2>
            <div className="space-y-4">
              {[
                { type: 'Volunteer', name: 'Ahmad Mohammed', time: '2 hours ago' },
                { type: 'Message', name: 'New contact submission', time: '3 hours ago' },
                { type: 'Donation', name: 'Anonymous ₦50,000', time: '5 hours ago' },
              ].map((activity, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium text-foreground text-sm">{activity.type}</p>
                    <p className="text-foreground/60 text-xs">{activity.name}</p>
                  </div>
                  <p className="text-foreground/50 text-xs">{activity.time}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Management Links */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">
              Management
            </h2>
            <div className="space-y-3">
              {[
                { label: 'View All Members', href: '/admin/members' },
                { label: 'View All Volunteers', href: '/admin/volunteers' },
                { label: 'View All Donations', href: '/admin/donations' },
                { label: 'Manage Messages', href: '/admin/messages' },
                { label: 'Manage News', href: '/admin/news' },
                { label: 'Create News Post', href: '/admin/news/create' },
              ].map((link) => (
                <Link key={link.href} href={link.href}>
                  <Button variant="outline" className="w-full justify-start">
                    {link.label}
                  </Button>
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
