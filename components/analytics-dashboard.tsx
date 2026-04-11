'use client';

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import {
  Users,
  Heart,
  MessageSquare,
  BarChart3,
  TrendingUp,
  Download,
  RefreshCw,
} from 'lucide-react';

interface DashboardStats {
  timestamp: string;
  summary: {
    total_supporters: number;
    total_volunteers: number;
    total_donations: number;
    active_campaigns: number;
  };
  supporters: {
    strong_supporters: number;
    undecided: number;
    opponents: number;
  };
  supporters_total: number;
  volunteers: {
    total: number;
    roles: {
      field_agent: number;
      media: number;
      polling_agent: number;
    };
    by_status: {
      pending: number;
      approved: number;
      active: number;
      rejected: number;
    };
  };
  donations: {
    total_amount: number;
    total_transactions: number;
    completed: number;
    pending: number;
  };
  voter_tracking: {
    total_tracked: number;
    strong_supporters: number;
    undecided: number;
    opponents: number;
    not_contacted: number;
  };
  top_lgas: Array<{
    lga: string;
    total: number;
    strong_supporters: number;
    undecided: number;
    opponents: number;
  }>;
  recent_campaigns: Array<{
    id: string;
    name: string;
    status: string;
    sent: number;
    failed: number;
    created_at: string;
  }>;
}

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#6b7280'];

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    fetchDashboardStats();
    // Refresh every 5 minutes
    const interval = setInterval(fetchDashboardStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/dashboard/stats');
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard statistics');
      }

      const data = await response.json();
      setStats(data);
      setLastUpdated(new Date());
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!stats) return;

    // Prepare CSV data
    let csv = 'Campaign Statistics Export\n';
    csv += `Generated: ${new Date().toISOString()}\n\n`;

    // Summary
    csv += 'Summary\n';
    csv += `Total Supporters,${stats.summary.total_supporters}\n`;
    csv += `Total Volunteers,${stats.summary.total_volunteers}\n`;
    csv += `Total Donations,${stats.summary.total_donations}\n`;
    csv += `Active Campaigns,${stats.summary.active_campaigns}\n\n`;

    // Supporter breakdown
    csv += 'Supporter Status\n';
    csv += `Strong Supporters,${stats.supporters.strong_supporters}\n`;
    csv += `Undecided,${stats.supporters.undecided}\n`;
    csv += `Opponents,${stats.supporters.opponents}\n\n`;

    // LGA statistics
    csv += 'LGA Performance\n';
    csv += 'LGA,Total,Strong Supporters,Undecided,Opponents\n';
    stats.top_lgas.forEach((lga) => {
      csv += `${lga.lga},${lga.total},${lga.strong_supporters},${lga.undecided},${lga.opponents}\n`;
    });

    // Create download link
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    element.setAttribute('download', `campaign-stats-${new Date().toISOString().split('T')[0]}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <Alert className="mx-4 mt-4 border-red-500 bg-red-50">
        <span className="text-red-600">Failed to load dashboard statistics</span>
      </Alert>
    );
  }

  const supporterChartData = [
    { name: 'Strong Supporters', value: stats.supporters.strong_supporters, fill: '#10b981' },
    { name: 'Undecided', value: stats.supporters.undecided, fill: '#f59e0b' },
    { name: 'Opponents', value: stats.supporters.opponents, fill: '#ef4444' },
  ];

  const volunteerRoleData = [
    { name: 'Field Agents', value: stats.volunteers.roles.field_agent },
    { name: 'Media', value: stats.volunteers.roles.media },
    { name: 'Polling Agents', value: stats.volunteers.roles.polling_agent },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Analytics</h1>
          <p className="text-gray-600 text-sm mt-1">
            Last updated: {lastUpdated?.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={fetchDashboardStats}
            variant="outline"
            size="sm"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button
            onClick={handleExportCSV}
            variant="outline"
            size="sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {error && (
        <Alert className="border-red-500 border-r-4 bg-red-50 text-red-600">
          {error}
        </Alert>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Supporters</p>
              <p className="text-3xl font-bold mt-2">{stats.summary.total_supporters}</p>
            </div>
            <Users className="w-12 h-12 text-blue-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Volunteers</p>
              <p className="text-3xl font-bold mt-2">{stats.summary.total_volunteers}</p>
            </div>
            <Heart className="w-12 h-12 text-red-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Donations</p>
              <p className="text-3xl font-bold mt-2">₦{(stats.summary.total_donations / 1000).toFixed(0)}K</p>
            </div>
            <Heart className="w-12 h-12 text-green-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Campaigns</p>
              <p className="text-3xl font-bold mt-2">{stats.summary.active_campaigns}</p>
            </div>
            <MessageSquare className="w-12 h-12 text-purple-500 opacity-20" />
          </div>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Supporter Status Pie Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Supporter Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={supporterChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {supporterChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Volunteer Role Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Volunteer Roles</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={volunteerRoleData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Top LGAs Performance */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Top Performing LGAs</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.top_lgas}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="lga" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="strong_supporters" stackId="a" fill="#10b981" name="Strong" />
              <Bar dataKey="undecided" stackId="a" fill="#f59e0b" name="Undecided" />
              <Bar dataKey="opponents" stackId="a" fill="#ef4444" name="Opponents" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Volunteer Status */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Volunteer Approval Status</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b">
              <span className="text-gray-700">Pending Approval</span>
              <span className="text-2xl font-bold text-yellow-600">{stats.volunteers.by_status.pending}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b">
              <span className="text-gray-700">Approved</span>
              <span className="text-2xl font-bold text-green-600">{stats.volunteers.by_status.approved}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b">
              <span className="text-gray-700">Active</span>
              <span className="text-2xl font-bold text-blue-600">{stats.volunteers.by_status.active}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Rejected</span>
              <span className="text-2xl font-bold text-red-600">{stats.volunteers.by_status.rejected}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Campaigns */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Messaging Campaigns</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Campaign Name</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-right">Sent</th>
                <th className="px-4 py-2 text-right">Failed</th>
                <th className="px-4 py-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recent_campaigns.map((campaign) => (
                <tr key={campaign.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{campaign.name}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        campaign.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : campaign.status === 'sending'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">{campaign.sent}</td>
                  <td className="px-4 py-3 text-right text-red-600">{campaign.failed}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(campaign.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
