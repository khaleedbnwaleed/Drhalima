import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface PrivacyNoticeProps {
  onAccept: () => void;
  onDecline: () => void;
  accepted: boolean;
  onAcceptedChange: (accepted: boolean) => void;
}

export default function PrivacyNotice({
  onAccept,
  onDecline,
  accepted,
  onAcceptedChange
}: PrivacyNoticeProps) {
  return (
    <Card className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Privacy Notice</h2>

      <div className="space-y-6 text-sm leading-relaxed">
        <div>
          <h3 className="font-semibold text-lg mb-3">How We Use Your Data</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Membership registration and authentication</li>
            <li>Identity verification and record management</li>
            <li>Communication related to campaign activities and updates</li>
            <li>Administrative, compliance, and regulatory purposes</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-3">Data Protection</h3>
          <p className="text-gray-700">
            Your information will be processed lawfully, fairly, and transparently, and will
            not be sold, misused, or shared with unauthorized third parties. We implement
            appropriate technical and organizational security measures to safeguard your data
            against unauthorized access, alteration, disclosure, or destruction.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-3">Access Control</h3>
          <p className="text-gray-700">
            Data access is restricted to authorized personnel only and handled in accordance
            with applicable data protection and privacy laws.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-3">Contact Us</h3>
          <p className="text-gray-700">
            If you have any questions regarding your personal data or its use, please
            contact our support team through the official communication channels provided on
            this platform.
          </p>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t">
        <div className="flex items-start space-x-3 mb-6">
          <Checkbox
            id="privacy-accept"
            checked={accepted}
            onCheckedChange={onAcceptedChange}
          />
          <label htmlFor="privacy-accept" className="text-sm leading-relaxed cursor-pointer">
            By continuing with your registration, you confirm that the information provided
            is accurate and that you consent to its collection and use in accordance with
            this Privacy Notice.
          </label>
        </div>

        {!accepted && (
          <Alert className="mb-6 border-orange-200 bg-orange-50">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <div className="text-orange-800">
              Please accept the privacy notice to continue with registration.
            </div>
          </Alert>
        )}

        <div className="flex gap-4 justify-center">
          <Button
            variant="outline"
            onClick={onDecline}
            className="px-8"
          >
            Decline
          </Button>
          <Button
            onClick={onAccept}
            disabled={!accepted}
            className="px-8 bg-blue-600 hover:bg-blue-700"
          >
            I Understand & Accept
          </Button>
        </div>
      </div>
    </Card>
  );
}