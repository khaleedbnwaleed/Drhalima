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
    <div className="w-full max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="membership-card membership-card-print bg-linear-to-br from-emerald-900 via-green-800 to-emerald-900 rounded-3xl shadow-2xl overflow-hidden relative print:shadow-none print:rounded-none border border-emerald-700/30">
        {/* Background watermark */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-[url('/campaign-hero.jpg')] bg-cover bg-center"></div>
        </div>

        {/* Top accent bar */}
        <div className="bg-linear-to-r from-amber-400/25 via-yellow-400/20 to-amber-400/25 h-10 sm:h-12 md:h-14 lg:h-16 flex items-center justify-between px-4 sm:px-6 md:px-8 gap-2 sm:gap-4 relative">
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent"></div>
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 relative z-10">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-1.5 sm:p-2 border border-white/20">
              <img src="/APC.png" alt="APC Logo" className="h-6 sm:h-8 md:h-10 w-auto" />
            </div>
            <div className="text-white leading-tight">
              <div className="text-xs sm:text-sm md:text-base font-bold tracking-wider uppercase">Dr. Halima Campaign</div>
              <div className="text-xs text-white/80 font-medium uppercase tracking-wide">Official Membership Card</div>
            </div>
          </div>
          <div className="text-white/70 text-xs sm:text-sm font-light hidden md:block relative z-10">
            Federal Republic of Nigeria
          </div>
        </div>

        {/* Main card content */}
        <div className="p-3 sm:p-4 md:p-6 lg:p-8 bg-linear-to-br from-white via-gray-50/50 to-white backdrop-blur-sm relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 md:gap-6">
            {/* Photo section */}
            <div className="relative shrink-0 mx-auto sm:mx-0">
              <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 rounded-xl sm:rounded-2xl overflow-hidden border-3 sm:border-4 border-emerald-200 shadow-lg sm:shadow-xl ring-1 sm:ring-2 ring-emerald-100/50">
                <img
                  src={memberData.photoUrl || '/default-avatar.png'}
                  alt="Member Photo"
                  className="w-full h-full object-cover"
                  onError={(event) => {
                    event.currentTarget.src = '/default-avatar.png';
                  }}
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 bg-linear-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                <User size={10} className="sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 xl:w-4 xl:h-4 text-white" />
              </div>
            </div>

            {/* Main content */}
            <div className="flex-1 w-full sm:w-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
              {/* Left column */}
              <div className="space-y-2 sm:space-y-3 md:space-y-4">
                <div>
                  <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight mb-1 sm:mb-2">
                    {memberData.fullName || 'Member Name'}
                  </h2>
                  <div className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 bg-linear-to-r from-emerald-100 to-green-100 text-emerald-800 text-xs sm:text-sm font-semibold rounded-full shadow-sm border border-emerald-200">
                    <IdCard size={12} className="sm:w-3.5 sm:h-3.5 mr-1 sm:mr-2" />
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
                        className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 mx-auto"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200/60">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-linear-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full"></div>
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-semibold text-gray-800">Lifetime Membership</div>
                  <div className="text-xs text-gray-500">Valid indefinitely</div>
                </div>
              </div>
              <div className="text-center sm:text-right">
                <div className="text-xs sm:text-sm font-semibold text-gray-800 mb-0.5 sm:mb-1">Authorized Signature</div>
                <div className="w-24 sm:w-32 h-6 sm:h-8 border-b-2 border-emerald-300 bg-linear-to-r from-transparent via-emerald-100 to-transparent"></div>
                <div className="text-xs text-gray-500 mt-0.5 sm:mt-1">Campaign Director</div>
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
