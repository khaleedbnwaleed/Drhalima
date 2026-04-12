import React from 'react';
import QRCode from 'qrcode';
import { MapPin, IdCard, User } from 'lucide-react';

interface MembershipCardProps {
  memberData: {
    fullName: string;
    cardId: string;
    state: string;
    lga: string;
    ward: string;
    photoUrl: string;
    qrCodeData?: string; // Optional, for generation
    qrCodeUrl?: string; // Optional, for stored QR codes
  };
}

export default function MembershipCard({ memberData }: MembershipCardProps) {
  const [qrCodeUrl, setQrCodeUrl] = React.useState<string>('');

  React.useEffect(() => {
    // Use stored QR code URL if available, otherwise generate from data
    if (memberData.qrCodeUrl) {
      setQrCodeUrl(memberData.qrCodeUrl);
    } else if (memberData.qrCodeData) {
      // Generate QR code for verification
      QRCode.toDataURL(memberData.qrCodeData, {
        type: 'image/png',
        margin: 1,
        width: 120,
      }).then(setQrCodeUrl);
    }
  }, [memberData.qrCodeData, memberData.qrCodeUrl]);

  return (
    <div className="max-w-[95vw] md:max-w-4xl mx-auto p-4 md:p-8">
      <div className="membership-card membership-card-print bg-linear-to-br from-green-900 via-green-800 to-green-900 rounded-2xl shadow-2xl overflow-hidden relative print:shadow-none print:rounded-none">
        {/* Background watermark */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full bg-[url('/APC.png')] bg-no-repeat bg-center bg-contain"></div>
        </div>

        {/* Top accent bar */}
        <div className="bg-linear-to-r from-yellow-400/20 to-transparent h-12 md:h-16 flex items-center justify-between px-4 md:px-6 gap-2 md:gap-4">
          <div className="flex items-center gap-2 md:gap-3">
            <img src="/APC.png" alt="APC Logo" className="h-8 md:h-10 w-auto" />
            <div className="text-white/90 leading-tight">
              <div className="text-xs md:text-sm font-semibold tracking-wider">DR. HALIMA CAMPAIGN</div>
              <div className="text-xs text-white/70 uppercase tracking-wide">MEMBERSHIP CARD</div>
            </div>
          </div>
          <div className="text-white/60 text-xs font-light hidden sm:block">
            Federal Republic of Nigeria
          </div>
        </div>

        {/* Main card content */}
        <div className="p-4 md:p-6 bg-white/95 backdrop-blur-sm">
          <div className="flex items-center gap-2 md:gap-6">
            {/* Photo section */}
            <div className="relative shrink-0">
              <div className="w-16 h-16 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-green-100 shadow-lg">
                <img
                  src={memberData.photoUrl || '/default-avatar.png'}
                  alt="Member Photo"
                  className="w-full h-full object-cover"
                  onError={(event) => {
                    event.currentTarget.src = '/default-avatar.png';
                  }}
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 md:w-6 md:h-6 bg-green-600 rounded-full flex items-center justify-center">
                <User size={10} className="md:w-3 md:h-3 w-2.5 h-2.5 text-white" />
              </div>
            </div>

            {/* Main content */}
            <div className="flex-1 grid grid-cols-2 gap-2 md:gap-4">
              {/* Left column */}
              <div className="space-y-2 md:space-y-3">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
                    {memberData.fullName || 'Member Name'}
                  </h2>
                  <div className="inline-flex items-center px-2 md:px-3 py-1 bg-green-100 text-green-800 text-sm md:text-sm font-medium rounded-full mt-1 md:mt-2">
                    <IdCard size={12} className="md:w-3.5 md:h-3.5 mr-1" />
                    {memberData.cardId}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-1 md:gap-2 text-sm md:text-sm">
                  <div className="flex items-center text-gray-600">
                    <MapPin size={12} className="md:w-3.5 md:h-3.5 mr-2 text-green-600" />
                    <span className="font-medium">State:</span>
                    <span className="ml-1 md:ml-2">{memberData.state}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin size={12} className="md:w-3.5 md:h-3.5 mr-2 text-green-600" />
                    <span className="font-medium">LGA:</span>
                    <span className="ml-1 md:ml-2">{memberData.lga}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin size={12} className="md:w-3.5 md:h-3.5 mr-2 text-green-600" />
                    <span className="font-medium">Ward:</span>
                    <span className="ml-1 md:ml-2">{memberData.ward}</span>
                  </div>
                </div>
              </div>

              {/* Right column - QR Code */}
              <div className="flex flex-col items-end">
                <div className="bg-gray-50 p-2 md:p-3 rounded-lg border border-gray-200 shadow-sm">
                  <div className="text-xs text-gray-500 text-center mb-1 md:mb-2 font-medium">
                    Scan to Verify
                  </div>
                  {qrCodeUrl && (
                    <img
                      src={qrCodeUrl}
                      alt="QR Code"
                      className="w-16 h-16 md:w-20 md:h-20"
                    />
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
        </div>

        {/* Bottom accent */}
          <div className="h-2 bg-linear-to-r from-yellow-400 via-green-500 to-yellow-400"></div>
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .membership-card-print, .membership-card-print * {
            visibility: visible;
          }
          .membership-card-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            max-width: 3.375in;
            height: auto;
            margin: 0;
            padding: 0;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
