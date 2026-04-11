'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, User, Mail, Phone, CheckCircle, MapPin, IdCard, Camera } from 'lucide-react';
import QRScanner from './qr-scanner';
import MembershipCard from './membership-card';

interface SupporterData {
  supporter_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  state: string;
  lga: string;
  ward: string;
  profile_photo_url?: string;
  qr_code_url?: string;
}

export default function SupporterVerification() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [supporterId, setSupporterId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<SupporterData | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [scanResult, setScanResult] = useState<{ supporterId: string; email: string } | null>(null);

  const handleVerify = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setResult(null);
    setNotFound(false);

    if (!email.trim() && !phone.trim() && !supporterId.trim()) {
      setError('Enter either email, phone number, or supporter ID.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/supporters/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), phone: phone.trim(), supporterId: supporterId.trim() }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Verification failed');
        return;
      }

      if (data.found) {
        setResult(data.supporter);
      } else {
        setNotFound(true);
      }
    } catch (err) {
      console.error('Verify error:', err);
      setError('Unable to verify member right now.');
    } finally {
      setLoading(false);
    }
  };

  const handleQRScanSuccess = async (scanData: { supporterId: string; email: string }) => {
    setScanResult(scanData);
    setError('');
    setResult(null);
    setNotFound(false);

    // Auto-verify using scanned data
    setLoading(true);
    try {
      const response = await fetch('/api/supporters/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ supporterId: scanData.supporterId, email: scanData.email }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Verification failed');
        return;
      }

      if (data.found) {
        setResult(data.supporter);
      } else {
        setNotFound(true);
        setError('Scanned QR code does not match any registered member.');
      }
    } catch (err) {
      console.error('Verify error:', err);
      setError('Unable to verify member right now.');
    } finally {
      setLoading(false);
    }
  };

  const handleQRScanError = (error: string) => {
    setError(error);
  };

  return (
    <Card className="p-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 text-primary">
          <Search className="w-5 h-5" />
          <h2 className="text-2xl font-bold">Verify Membership</h2>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Enter member details manually or scan their QR code to confirm registration.
        </p>
      </div>

      {error && (
        <Alert className="mb-6 border-red-500 bg-red-50 text-red-700">
          {error}
        </Alert>
      )}

      <Tabs defaultValue="manual" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          <TabsTrigger value="scan">Scan QR Code</TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="mt-6">
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label htmlFor="verifyEmail">Email</Label>
                <div className="relative">
                  <Input
                    id="verifyEmail"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="member@example.com"
                  />
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>

              <div>
                <Label htmlFor="verifyPhone">Phone</Label>
                <div className="relative">
                  <Input
                    id="verifyPhone"
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="08012345678"
                  />
                  <Phone className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>

              <div>
                <Label htmlFor="verifyId">Supporter ID</Label>
                <div className="relative">
                  <Input
                    id="verifyId"
                    value={supporterId}
                    onChange={(event) => setSupporterId(event.target.value)}
                    placeholder="SUP-2026-000001"
                  />
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-muted-foreground">
                At least one field is required for verification.
              </p>
              <Button type="submit" disabled={loading} className="w-full md:w-auto">
                {loading ? 'Verifying...' : 'Verify Member'}
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="scan" className="mt-6">
          <QRScanner
            onScanSuccess={handleQRScanSuccess}
            onScanError={handleQRScanError}
          />
          {scanResult && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle className="w-4 h-4" />
                <span className="font-medium">QR Code Scanned Successfully</span>
              </div>
              <p className="text-sm text-green-600 mt-1">
                ID: {scanResult.supporterId} | Email: {scanResult.email}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {notFound && (
        <Alert className="mt-6 border-yellow-500 bg-yellow-50 text-yellow-700">
          Member not found. Please check the details and try again.
        </Alert>
      )}

      {result && (
        <div className="mt-6">
          <div className="flex items-center gap-3 text-green-700 font-semibold mb-6">
            <CheckCircle className="w-5 h-5" />
            <span>Member Verified Successfully</span>
          </div>

          {/* Membership Card - Same as Registration */}
          <MembershipCard
            memberData={{
              fullName: `${result.first_name} ${result.last_name}`,
              cardId: result.supporter_id,
              state: result.state,
              lga: result.lga,
              ward: result.ward,
              photoUrl: result.profile_photo_url || '/placeholder-user.jpg',
              qrCodeUrl: result.qr_code_url,
              qrCodeData: `SUP:${result.supporter_id}|EMAIL:${result.email}`,
            }}
          />

          {/* Additional Actions */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-4">
              This member is registered and verified in our campaign database.
            </p>

            <Button
              onClick={() => window.print()}
              variant="outline"
              className="mr-2"
            >
              Print ID Card
            </Button>
                  {/* Photo section */}
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-green-100 shadow-lg">
                      <img
                        src={result.profile_photo_url || '/placeholder-user.jpg'}
                        alt="Member Photo"
                        className="w-full h-full object-cover"
                        onError={(event) => {
                          event.currentTarget.src = '/placeholder-user.jpg';
                        }}
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                      <User size={12} className="text-white" />
                    </div>
                  </div>

                  {/* Main content */}
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    {/* Left column */}
                    <div className="space-y-3">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                          {`${result.first_name} ${result.last_name}`}
                        </h2>
                        <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full mt-2">
                          <IdCard size={14} className="mr-1" />
                          {result.supporter_id}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-2 text-sm">
                        <div className="flex items-center text-gray-600">
                          <MapPin size={14} className="mr-2 text-green-600" />
                          <span className="font-medium">State:</span>
                          <span className="ml-2">{result.state}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin size={14} className="mr-2 text-green-600" />
                          <span className="font-medium">LGA:</span>
                          <span className="ml-2">{result.lga}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin size={14} className="mr-2 text-green-600" />
                          <span className="font-medium">Ward:</span>
                          <span className="ml-2">{result.ward}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right column - QR Code */}
                    <div className="flex flex-col items-end">
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 shadow-sm">
                        <div className="text-xs text-gray-500 text-center mb-2 font-medium">
                          Scan to Verify
                        </div>
                        {result.qr_code_url ? (
                          <img
                            src={result.qr_code_url}
                            alt="QR Code"
                            className="w-20 h-20"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-xs text-gray-500">QR Code</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <div>
                      <span className="font-medium">Valid:</span> Lifetime Membership
                    </div>
                    <div className="text-right">
                      <div>Digital Signature</div>
                      <div className="w-24 h-6 border-b border-gray-300 mt-1"></div>
                    </div>
                  </div>
                </div>

          {/* Additional Actions */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-4">
              This member is registered and verified in our campaign database.
            </p>
            <Button
              onClick={() => window.print()}
              variant="outline"
              className="mr-2"
            >
              Print ID Card
            </Button>
            <Button
              onClick={() => setResult(null)}
              variant="outline"
            >
              Verify Another Member
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
