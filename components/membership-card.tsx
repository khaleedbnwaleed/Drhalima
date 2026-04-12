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
      <div className="membership-card membership-card-print bg-linear-to-br from-emerald-900 via-green-800 to-emerald-900 rounded-3xl shadow-2xl overflow-hidden relative print:shadow-none print:rounded-none border border-emerald-700/30">
        {/* Background watermark */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-[url('/campaign-hero.jpg')] bg-cover bg-center"></div>
        </div>

        {/* Top accent bar */}
        <div className="bg-linear-to-r from-amber-400/25 via-yellow-400/20 to-amber-400/25 h-12 md:h-14 flex items-center justify-between px-6 md:px-8 gap-4 relative">
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent"></div>
          <div className="flex items-center gap-3 md:gap-4 relative z-10">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2 border border-white/20">
              <img src="/APC.png" alt="APC Logo" className="h-8 md:h-10 w-auto" />
            </div>
            <div className="text-white leading-tight">
              <div className="text-sm md:text-base font-bold tracking-wider uppercase">Dr. Halima Campaign</div>
              <div className="text-xs md:text-sm text-white/80 font-medium uppercase tracking-wide">Official Membership Card</div>
            </div>
          </div>
          <div className="text-white/70 text-xs md:text-sm font-light hidden sm:block relative z-10">
            Federal Republic of Nigeria
          </div>
        </div>

        {/* Main card content */}
        <div className="p-4 md:p-6 bg-linear-to-br from-white via-gray-50/50 to-white backdrop-blur-sm relative">
          <div className="flex items-start gap-4 md:gap-6">
            {/* Photo section */}
            <div className="relative shrink-0">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border-4 border-emerald-200 shadow-xl ring-2 ring-emerald-100/50">
                <img
                  src={memberData.photoUrl || '/default-avatar.png'}
                  alt="Member Photo"
                  className="w-full h-full object-cover"
                  onError={(event) => {
                    event.currentTarget.src = '/default-avatar.png';
                  }}
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 md:w-6 md:h-6 bg-linear-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                <User size={12} className="text-white" />
              </div>
            </div>

            {/* Main content */}
            <div className="flex-1 grid grid-cols-2 gap-3 md:gap-4">
              {/* Left column */}
              <div className="space-y-3 md:space-y-4">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight mb-2">
                    {memberData.fullName || 'Member Name'}
                  </h2>
                  <div className="inline-flex items-center px-2 md:px-3 py-1 md:py-2 bg-linear-to-r from-emerald-100 to-green-100 text-emerald-800 text-sm font-semibold rounded-full shadow-sm border border-emerald-200">
                    <IdCard size={14} className="mr-1 md:mr-2" />
                    {memberData.cardId}
                  </div>
                </div>

                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-gray-200/50 shadow-sm">
                  <h3 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Location Details</h3>
                  <div className="grid grid-cols-1 gap-1.5">
                    <div className="flex items-center text-gray-700">
                      <MapPin size={14} className="mr-3 text-emerald-600 shrink-0" />
                      <span className="font-medium text-gray-600 min-w-15">State:</span>
                      <span className="font-semibold">{memberData.state}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <MapPin size={14} className="mr-3 text-emerald-600 shrink-0" />
                      <span className="font-medium text-gray-600 min-w-15">LGA:</span>
                      <span className="font-semibold">{memberData.lga}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <MapPin size={14} className="mr-3 text-emerald-600 shrink-0" />
                      <span className="font-medium text-gray-600 min-w-15">Ward:</span>
                      <span className="font-semibold">{memberData.ward}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right column - QR Code */}
              <div className="flex flex-col items-center">
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-gray-200/60 shadow-lg">
                  <div className="text-center mb-3">
                    <div className="text-sm font-semibold text-gray-700 mb-1">Verification Code</div>
                    <div className="text-xs text-gray-500">Scan to authenticate</div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-inner">
                    {qrCodeUrl && (
                      <img
                        src={qrCodeUrl}
                        alt="QR Code"
                        className="w-16 h-16 md:w-20 md:h-20 mx-auto"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-gray-200/60">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-linear-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-800">Lifetime Membership</div>
                  <div className="text-xs text-gray-500">Valid indefinitely</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-800 mb-1">Authorized Signature</div>
                <div className="w-32 h-8 border-b-2 border-emerald-300 bg-linear-to-r from-transparent via-emerald-100 to-transparent"></div>
                <div className="text-xs text-gray-500 mt-1">Campaign Director</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom accent */}
        <div className="h-2 bg-linear-to-r from-amber-400 via-yellow-400 to-amber-400 relative">
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"></div>
        </div>
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
