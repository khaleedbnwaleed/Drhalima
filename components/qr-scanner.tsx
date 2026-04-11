'use client';

import { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Camera, StopCircle, CheckCircle, AlertCircle } from 'lucide-react';

interface QRScannerProps {
  onScanSuccess: (data: { supporterId: string; email: string }) => void;
  onScanError?: (error: string) => void;
}

export default function QRScanner({ onScanSuccess, onScanError }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scanner, setScanner] = useState<QrScanner | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string>('');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup scanner on unmount
      if (scanner) {
        scanner.destroy();
      }
    };
  }, [scanner]);

  const startScanning = async () => {
    try {
      setError('');

      // Check camera permission
      const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
      if (permission.state === 'denied') {
        setError('Camera permission denied. Please allow camera access.');
        setHasPermission(false);
        return;
      }

      if (!videoRef.current) {
        setError('Camera not available');
        return;
      }

      const qrScanner = new QrScanner(
        videoRef.current,
        (result) => {
          handleScanResult(result.data);
        },
        {
          onDecodeError: (err) => {
            // Ignore decode errors during scanning
            console.debug('QR decode error:', err);
          },
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      setScanner(qrScanner);
      await qrScanner.start();
      setIsScanning(true);
      setHasPermission(true);
    } catch (err) {
      console.error('Failed to start scanner:', err);
      setError('Failed to access camera. Please ensure you have granted camera permissions.');
      setHasPermission(false);
      onScanError?.('Failed to access camera');
    }
  };

  const stopScanning = () => {
    if (scanner) {
      scanner.stop();
      setIsScanning(false);
    }
  };

  const handleScanResult = (qrData: string) => {
    try {
      // Parse QR data format: "SUP:SUP-2026-000001|EMAIL:user@example.com"
      const parts = qrData.split('|');
      if (parts.length !== 2) {
        throw new Error('Invalid QR code format');
      }

      const supporterIdPart = parts[0].split(':');
      const emailPart = parts[1].split(':');

      if (supporterIdPart[0] !== 'SUP' || emailPart[0] !== 'EMAIL') {
        throw new Error('Invalid QR code data structure');
      }

      const supporterId = supporterIdPart[1];
      const email = emailPart[1];

      if (!supporterId || !email) {
        throw new Error('Missing supporter ID or email in QR code');
      }

      // Stop scanning and call success callback
      stopScanning();
      onScanSuccess({ supporterId, email });
    } catch (err) {
      console.error('Failed to parse QR data:', err);
      setError('Invalid QR code format. Please scan a valid membership QR code.');
      onScanError?.('Invalid QR code format');
    }
  };

  return (
    <Card className="p-6">
      <div className="text-center mb-4">
        <Camera className="w-8 h-8 text-primary mx-auto mb-2" />
        <h3 className="text-lg font-semibold">Scan Membership QR Code</h3>
        <p className="text-sm text-muted-foreground">
          Point your camera at a member's QR code to verify their membership
        </p>
      </div>

      {error && (
        <Alert className="mb-4 border-red-500 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <span className="text-red-600">{error}</span>
        </Alert>
      )}

      <div className="relative">
        <video
          ref={videoRef}
          className="w-full max-w-md mx-auto rounded-lg border border-gray-300"
          style={{ display: isScanning ? 'block' : 'none' }}
          playsInline
          muted
        />

        {!isScanning && (
          <div className="w-full max-w-md mx-auto h-64 bg-gray-100 rounded-lg border border-gray-300 flex items-center justify-center">
            <div className="text-center">
              <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Camera preview will appear here</p>
            </div>
          </div>
        )}

        {isScanning && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-48 h-48 border-2 border-primary rounded-lg opacity-50"></div>
          </div>
        )}
      </div>

      <div className="flex justify-center mt-4">
        {!isScanning ? (
          <Button onClick={startScanning} className="flex items-center gap-2">
            <Camera className="w-4 h-4" />
            Start Scanning
          </Button>
        ) : (
          <Button onClick={stopScanning} variant="destructive" className="flex items-center gap-2">
            <StopCircle className="w-4 h-4" />
            Stop Scanning
          </Button>
        )}
      </div>

      {hasPermission === false && (
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Camera access is required for QR code scanning.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </Button>
        </div>
      )}
    </Card>
  );
}