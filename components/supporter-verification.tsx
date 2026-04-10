'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import { Search, User, Mail, Phone } from 'lucide-react';

interface SupporterData {
  supporterId: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  state: string;
  lga: string;
  ward: string;
}

export default function SupporterVerification() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [supporterId, setSupporterId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<SupporterData | null>(null);
  const [notFound, setNotFound] = useState(false);

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

  return (
    <Card className="p-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 text-primary">
          <Search className="w-5 h-5" />
          <h2 className="text-2xl font-bold">Verify Membership</h2>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Enter member email, phone number, or supporter ID to confirm registration.
        </p>
      </div>

      {error && (
        <Alert className="mb-6 border-red-500 bg-red-50 text-red-700">
          {error}
        </Alert>
      )}

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

      {notFound && (
        <Alert className="mt-6 border-yellow-500 bg-yellow-50 text-yellow-700">
          Member not found. Please check the details and try again.
        </Alert>
      )}

      {result && (
        <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-6">
          <div className="flex items-center gap-3 text-green-700 font-semibold mb-4">
            <CheckCircle className="w-5 h-5" />
            <span>Registered member verified</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Full Name</p>
              <p className="font-semibold">{`${result.first_name} ${result.last_name}`}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Supporter ID</p>
              <p className="font-semibold">{result.supporterId}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-semibold">{result.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-semibold">{result.phone}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">State</p>
              <p className="font-semibold">{result.state}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">LGA / Ward</p>
              <p className="font-semibold">{result.lga} / {result.ward}</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
