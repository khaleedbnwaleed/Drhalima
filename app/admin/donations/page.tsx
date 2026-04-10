'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, TrendingUp } from 'lucide-react'

interface Donation {
  id: string
  donor_name: string
  donor_email: string
  amount: number
  currency: string
  payment_status: string
  created_at: string
  message: string
}

export default function DonationsManagement() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ totalRaised: 0, totalDonations: 0 })

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await fetch('/api/donations')
        const result = await response.json()
        setDonations(result.data || [])
        setStats({
          totalRaised: result.totalRaised || 0,
          totalDonations: result.count || 0,
        })
      } catch (error) {
        console.error('Error fetching donations:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDonations()
  }, [])

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
          <h1 className="text-2xl font-bold text-primary">Donations Management</h1>
        </div>
      </header>

      {/* Stats */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-8">
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-foreground/60">Total Raised</p>
                <p className="text-3xl font-bold text-foreground">
                  ₦{(stats.totalRaised / 1000000).toFixed(2)}M
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-secondary/10">
                <TrendingUp className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-foreground/60">Total Donations</p>
                <p className="text-3xl font-bold text-foreground">
                  {stats.totalDonations}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Donations List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-primary">Recent Donations</h2>

          {loading ? (
            <p className="text-foreground/60">Loading donations...</p>
          ) : donations.length === 0 ? (
            <p className="text-foreground/60">No donations yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Donor</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Amount</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((donation) => (
                    <tr key={donation.id} className="border-b border-border hover:bg-muted/50">
                      <td className="px-4 py-3 text-foreground">{donation.donor_name}</td>
                      <td className="px-4 py-3 text-foreground/60 text-sm">{donation.donor_email}</td>
                      <td className="px-4 py-3 font-bold text-foreground">
                        ₦{donation.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          donation.payment_status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : donation.payment_status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {donation.payment_status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-foreground/60 text-sm">
                        {new Date(donation.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
