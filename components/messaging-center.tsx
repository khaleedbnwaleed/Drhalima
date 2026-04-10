'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert } from '@/components/ui/alert';
import { AlertCircle, Send, Clock, CheckCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CampaignFormData {
  campaignName: string;
  messageText: string;
  channel: 'sms' | 'whatsapp' | 'both';
  targetGroup: 'all_supporters' | 'by_lga' | 'by_ward' | 'by_support_level';
  targetLga?: string;
  targetWard?: string;
  targetSupportStatus?: string;
  sendImmediately: boolean;
  scheduledTime?: string;
}

export default function MessagingCenter() {
  const [activeTab, setActiveTab] = useState('compose');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [campaigns, setCampaigns] = useState<any[]>([]);
  
  const [formData, setFormData] = useState<CampaignFormData>({
    campaignName: '',
    messageText: '',
    channel: 'both',
    targetGroup: 'all_supporters',
    sendImmediately: true,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validation
      if (!formData.campaignName.trim()) {
        setError('Campaign name is required');
        setLoading(false);
        return;
      }

      if (!formData.messageText.trim()) {
        setError('Message text is required');
        setLoading(false);
        return;
      }

      if (formData.messageText.length > 160 && formData.channel === 'sms') {
        setError('SMS message cannot exceed 160 characters');
        setLoading(false);
        return;
      }

      // Prepare target filter
      let targetFilter: Record<string, string> = {};
      if (formData.targetGroup === 'by_lga' && formData.targetLga) {
        targetFilter.lga = formData.targetLga;
      } else if (formData.targetGroup === 'by_ward' && formData.targetWard) {
        targetFilter.ward = formData.targetWard;
      } else if (
        formData.targetGroup === 'by_support_level' &&
        formData.targetSupportStatus
      ) {
        targetFilter.support_status = formData.targetSupportStatus;
      }

      const response = await fetch('/api/admin/messaging/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          targetFilter,
          userId: localStorage.getItem('userId'), // Store user ID in localStorage
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Failed to create campaign');
        return;
      }

      setSuccess(
        `Campaign created successfully! ${result.recipientCount} recipients targeted.`
      );

      // Reset form
      setFormData({
        campaignName: '',
        messageText: '',
        channel: 'both',
        targetGroup: 'all_supporters',
        sendImmediately: true,
      });

      // Reload campaigns
      fetchCampaigns();
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const response = await fetch('/api/admin/messaging/campaigns?limit=20');
      if (response.ok) {
        const data = await response.json();
        setCampaigns(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching campaigns:', err);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'sending':
        return <Send className="w-5 h-5 text-blue-600" />;
      case 'scheduled':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 border-green-200';
      case 'sending':
        return 'bg-blue-50 border-blue-200';
      case 'scheduled':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="spaces-y-6">
      <div>
        <h1 className="text-3xl font-bold">Messaging Center</h1>
        <p className="text-gray-600 mt-2">Send bulk SMS and WhatsApp messages to supporters</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="compose">Compose Message</TabsTrigger>
          <TabsTrigger value="history">Campaign History</TabsTrigger>
        </TabsList>

        {/* Compose Tab */}
        <TabsContent value="compose" className="space-y-4">
          <Card className="p-6">
            {error && (
              <Alert className="mb-6 border-red-500 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-red-600">{error}</span>
              </Alert>
            )}

            {success && (
              <Alert className="mb-6 border-green-500 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-green-600">{success}</span>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campaign Name */}
              <div>
                <Label htmlFor="campaignName">Campaign Name *</Label>
                <Input
                  id="campaignName"
                  name="campaignName"
                  placeholder="e.g., Q2 Mobilization Drive"
                  value={formData.campaignName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Message Text */}
              <div>
                <Label htmlFor="messageText">Message Text *</Label>
                <Textarea
                  id="messageText"
                  name="messageText"
                  placeholder="Enter your message (160 chars for SMS)"
                  value={formData.messageText}
                  onChange={handleInputChange}
                  rows={4}
                  maxLength={500}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.messageText.length} / {formData.channel === 'sms' ? '160' : '500'} characters
                </p>
              </div>

              {/* Channel Selection */}
              <div>
                <Label htmlFor="channel">Channel *</Label>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="channel-sms"
                      name="channel"
                      value="sms"
                      checked={formData.channel === 'sms'}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <label htmlFor="channel-sms">SMS Only</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="channel-whatsapp"
                      name="channel"
                      value="whatsapp"
                      checked={formData.channel === 'whatsapp'}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <label htmlFor="channel-whatsapp">WhatsApp Only</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="channel-both"
                      name="channel"
                      value="both"
                      checked={formData.channel === 'both'}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <label htmlFor="channel-both">SMS + WhatsApp</label>
                  </div>
                </div>
              </div>

              {/* Target Group */}
              <div>
                <Label htmlFor="targetGroup">Target Group *</Label>
                <Select
                  name="targetGroup"
                  value={formData.targetGroup}
                  onChange={handleInputChange}
                >
                  <option value="all_supporters">All Supporters</option>
                  <option value="by_lga">By LGA</option>
                  <option value="by_ward">By Ward</option>
                  <option value="by_support_level">By Support Level</option>
                </Select>
              </div>

              {/* Conditional Target Filters */}
              {formData.targetGroup === 'by_lga' && (
                <div>
                  <Label htmlFor="targetLga">Select LGA</Label>
                  <Select
                    name="targetLga"
                    value={formData.targetLga || ''}
                    onChange={handleInputChange}
                  >
                    <option value="">-- Select LGA --</option>
                    <option value="Alimosho">Alimosho</option>
                    <option value="Ajeromi-Ifelodun">Ajeromi-Ifelodun</option>
                    {/* Add more LGAs */}
                  </Select>
                </div>
              )}

              {formData.targetGroup === 'by_ward' && (
                <div>
                  <Label htmlFor="targetWard">Select Ward</Label>
                  <Input
                    id="targetWard"
                    name="targetWard"
                    placeholder="e.g., Alimosho Ward A"
                    value={formData.targetWard || ''}
                    onChange={handleInputChange}
                  />
                </div>
              )}

              {formData.targetGroup === 'by_support_level' && (
                <div>
                  <Label htmlFor="targetSupportStatus">Support Status</Label>
                  <Select
                    name="targetSupportStatus"
                    value={formData.targetSupportStatus || ''}
                    onChange={handleInputChange}
                  >
                    <option value="">-- Select Status --</option>
                    <option value="strong_supporter">Strong Supporters</option>
                    <option value="undecided">Undecided</option>
                    <option value="opponent">Opponents</option>
                  </Select>
                </div>
              )}

              {/* Send Options */}
              <div className="border-t pt-4">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="sendImmediately"
                      name="sendImmediately"
                      checked={formData.sendImmediately}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <label htmlFor="sendImmediately" className="font-medium">
                      Send Immediately
                    </label>
                  </div>

                  {!formData.sendImmediately && (
                    <div>
                      <Label htmlFor="scheduledTime">Schedule Time</Label>
                      <Input
                        id="scheduledTime"
                        name="scheduledTime"
                        type="datetime-local"
                        value={formData.scheduledTime || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Creating Campaign...' : 'Create & Send Campaign'}
              </Button>
            </form>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Button
            onClick={fetchCampaigns}
            variant="outline"
            size="sm"
          >
            Refresh History
          </Button>

          <div className="space-y-3">
            {campaigns.length === 0 ? (
              <Card className="p-6 text-center text-gray-600">
                No campaigns yet
              </Card>
            ) : (
              campaigns.map((campaign) => (
                <Card
                  key={campaign.id}
                  className={`p-4 border-l-4 ${getStatusColor(campaign.status)}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getStatusIcon(campaign.status)}
                        <h3 className="font-semibold">{campaign.campaign_name}</h3>
                      </div>
                      <p className="text-sm text-gray-600">{campaign.message_text}</p>
                      <div className="flex gap-4 mt-2 text-xs text-gray-500">
                        <span>Channel: {campaign.channel}</span>
                        <span>Status: {campaign.status}</span>
                        <span>Sent: {campaign.successfully_sent}/{campaign.total_recipients}</span>
                        {campaign.failed_count > 0 && (
                          <span className="text-red-600">Failed: {campaign.failed_count}</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(campaign.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
