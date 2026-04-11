'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Upload, Camera, X } from 'lucide-react';
import MembershipCard from './membership-card';
import PrivacyNotice from './privacy-notice';

// Helper function to validate Nigerian phone number (flexible format)
const validateNigerianPhoneFormat = (phone: string): boolean => {
  // Remove all non-digit characters for validation
  const cleaned = phone.replace(/\D/g, '');
  // Should be 10 or 11 digits after cleaning
  // 10 digits: local format (0XXXXXXXXXX)
  // 11 digits: international without + (234XXXXXXXXX)
  return cleaned.length === 10 || cleaned.length === 11;
};

// Validation schema
const supporterRegistrationSchema = z.object({
  // Personal Information
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Valid email is required'),
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .refine(
      validateNigerianPhoneFormat,
      'Enter a valid Nigerian phone number (e.g., 08012345678 or +2348012345678)'
    ),
  dateOfBirth: z.string().optional(),

  // Location Information
  state: z.string().default('Jigawa'),
  lga: z.string().min(1, 'LGA is required'),
  ward: z.string().min(1, 'Ward is required'),
  address: z.string().optional(),

  // Voter Information
  pvcNumber: z.string()
    .trim()
    .refine(
      (val) => val.length === 0 || /^\d{14}$/.test(val.replace(/\D/g, '')),
      'PVC must be 14 digits if provided'
    )
    .optional()
    .default(''),
  profilePhoto: z.string().optional(),

  // Additional Information
  occupation: z.string().optional(),
});

type SupporterFormData = z.infer<typeof supporterRegistrationSchema>;

// Jigawa State LGAs and their wards
const JIGAWA_LGAS: Record<string, string[]> = {
  'Dutse': [
    'Aujara',
    'Chamo',
    'Dutse',
    'Fagam',
    'Galambi',
    'Kachi',
    'Limawa',
    'Madobi',
    'Sakwaya',
    'Takur',
  ],
  'Jahun': [
    'Aujara',
    'Gangawa',
    'Harbo Sabuwa',
    'Harbo Tsohuwa',
    'Jabarna',
    'Jahun',
    'Kanwa',
    'Kafin Baka',
    'Gunka',
    'Yalleman',
  ],
  'Kiyawa': [
    'Andaza',
    'Fake',
    'Katanga',
    'Kiyawa',
    'Kwadaza',
    'Maje',
    'Tsirma',
    'Zango',
    'Karankiya',
    'Daban Gari',
  ],
  'Birnin Kudu': [
    'Birnin Kudu',
    'Kantoga',
    'Kangire',
    'Kwangwara',
    'Kiyako',
    'Sundumina',
    'Surko',
    'Lafiya',
    'Unguwar Ƴa',
    'Yalwan Damai',
    'Wurno',
  ],
  'Buji': [
    'Buji',
    'Chira',
    'Falageri',
    'Gantsa',
    'Kafin Madaki',
    'Yakun',
    'Ahoto',
    'Madabe',
    'Gwadayi',
    'Gagarawa',
  ],
  'Gwaram': [
    'Basirka',
    'Dingaya',
    'Fagam',
    'Gwaram',
    'Kwandiko',
    'Maruta',
    'Sara',
    'Tsangarwa',
    'Zandam',
    'Kila',
  ],
};

export default function SupporterRegistrationForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [registrationData, setRegistrationData] = useState<any>(null);
  const [error, setError] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [showPrivacyNotice, setShowPrivacyNotice] = useState(true);
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<SupporterFormData>({
    resolver: zodResolver(supporterRegistrationSchema),
    mode: 'onChange',
    defaultValues: {
      state: 'Jigawa',
    },
  });

  const watchedLga = watch('lga');
  const availableLGAs = Object.keys(JIGAWA_LGAS);
  const availableWards = watchedLga ? JIGAWA_LGAS[watchedLga] || [] : [];

  useEffect(() => {
    setValue('ward', '');
  }, [watchedLga, setValue]);

  // Handle photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Photo must be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('File must be an image');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        setProfilePhoto(base64String);
        setPhotoPreview(base64String);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle camera capture
  const startCamera = async () => {
    try {
      // Check if getUserMedia is available
      const constraints = {
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
        };
        setShowCamera(true);
        setError('');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Camera error:', errorMessage);
      if (errorMessage.includes('Permission denied')) {
        setError('Camera permission denied. Please allow camera access in browser settings and try again.');
      } else if (errorMessage.includes('NotSupported')) {
        setError('Camera not supported on this device. Please upload a photo instead.');
      } else {
        setError('Unable to access camera. Please check permissions and try again, or upload a photo instead.');
      }
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      try {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        const context = canvas.getContext('2d');

        if (!context) {
          setError('Failed to capture photo. Please try again.');
          return;
        }

        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        context.drawImage(video, 0, 0);

        const photoData = canvas.toDataURL('image/jpeg', 0.9);
        setProfilePhoto(photoData);
        setPhotoPreview(photoData);
        setError('');
        setShowCamera(false);

        // Stop camera stream
        const stream = video.srcObject as MediaStream;
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
      } catch (err) {
        setError('Failed to capture photo. Please try again.');
        console.error('Capture error:', err);
      }
    }
  };

  const cancelCamera = () => {
    try {
      setShowCamera(false);
      if (videoRef.current) {
        const stream = videoRef.current.srcObject as MediaStream;
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        videoRef.current.srcObject = null;
      }
    } catch (err) {
      console.error('Error closing camera:', err);
    }
  };

  const removePhoto = () => {
    setProfilePhoto(null);
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = async (data: SupporterFormData) => {
    // Validate that we're on the last step
    if (currentStep !== steps.length - 1) {
      setCurrentStep(steps.length - 1);
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Clean phone number: remove spaces, dashes, parentheses
      const cleanedPhone = data.phone.replace(/[\s\-\(\)]/g, '');
      
      // Clean PVC number: remove spaces, dashes
      const cleanedPVC = data.pvcNumber ? data.pvcNumber.replace(/[\s\-]/g, '') : '';

      const response = await fetch('/api/supporters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          phone: cleanedPhone,
          pvcNumber: cleanedPVC || undefined,
          state: 'Jigawa',
          profilePhoto: profilePhoto || undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.details) {
          // Show specific validation errors
          if (typeof result.details === 'object' && result.details !== null) {
            const errorMessages = Object.values(result.details).join(', ');
            setError(`Validation failed: ${errorMessages}`);
          } else {
            // details is a string or other type
            setError(`Error: ${result.details}`);
          }
        } else {
          setError(result.error || 'Registration failed');
        }
        return;
      }

      const serverPhotoUrl = result?.supporter?.photoUrl;
      setSubmitted(true);
      setRegistrationData({
        ...result,
        supporter: {
          ...result.supporter,
          photoUrl: serverPhotoUrl || profilePhoto || '/default-avatar.png',
        },
      });
      reset();
      setProfilePhoto(null);
      setPhotoPreview(null);
      setShowCamera(false);
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { label: 'Personal Info', value: 'personal' },
    { label: 'Location', value: 'location' },
    { label: 'Voter Info', value: 'voter' },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      {showPrivacyNotice ? (
        <PrivacyNotice
          accepted={privacyAccepted}
          onAcceptedChange={setPrivacyAccepted}
          onAccept={() => setShowPrivacyNotice(false)}
          onDecline={() => {
            setError('Registration requires accepting the privacy notice.');
            setTimeout(() => setError(''), 5000);
          }}
        />
      ) : submitted && registrationData ? (
        <div className="w-full max-w-4xl mx-auto">
          <Card className="w-full p-8 mb-6">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Registration Successful!</h2>
              <p className="text-gray-600 mb-4">
                Welcome to the African Democratic Congress! Your membership card has been generated.
              </p>
            </div>
          </Card>

          <MembershipCard
            memberData={{
              fullName: `${registrationData.supporter.firstName} ${registrationData.supporter.lastName}`,
              cardId: registrationData.supporter.supporterId,
              state: 'Jigawa',
              lga: registrationData.supporter.lga,
              ward: registrationData.supporter.ward,
              photoUrl: registrationData.supporter.photoUrl || '/default-avatar.png',
              qrCodeUrl: registrationData?.qrCodeUrl,
              qrCodeData: `SUP:${registrationData.supporter.supporterId}|EMAIL:${registrationData.supporter.email}`,
            }}
          />

          <div className="text-center mt-6 no-print">
            <Button
              onClick={() => window.print()}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg mr-4"
            >
              Print Membership Card
            </Button>
            <Button
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="px-6 py-2"
            >
              Return to Home
            </Button>
          </div>
        </div>
      ) : (
        <Card className="w-full max-w-2xl mx-auto p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Supporter Registration</h1>
            <p className="text-gray-600">
              Join our campaign and be part of the change. Get your unique Supporter ID and QR code.
            </p>
          </div>

      {error && (
        <Alert className="mb-6 border-red-500 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <span className="text-red-600">{error}</span>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
            <Tabs value={steps[currentStep].value} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                {steps.map((step, idx) => (
                  <TabsTrigger
                    key={step.value}
                    value={step.value}
                    disabled={idx > currentStep}
                    onClick={() => setCurrentStep(idx)}
                  >
                    <span className="hidden sm:inline">{step.label}</span>
                    <span className="sm:hidden">{idx + 1}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
          {/* Step 1: Personal Information */}
          <TabsContent value="personal" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  {...register('firstName')}
                  className={errors.firstName ? 'border-red-500' : ''}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-600 mt-1">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  {...register('lastName')}
                  className={errors.lastName ? 'border-red-500' : ''}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-600 mt-1">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                {...register('email')}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Phone Number (Nigerian) *</Label>
              <Input
                id="phone"
                placeholder="e.g., 08012345678 or +234 801 234 5678"
                {...register('phone')}
                className={errors.phone ? 'border-red-500' : ''}
              />
              {errors.phone && (
                <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Format: 0801234567 (local) or +2348012345678 (international), spaces/dashes allowed
              </p>
            </div>

            <div>
              <Label htmlFor="dateOfBirth">Date of Birth (Optional)</Label>
              <Input
                id="dateOfBirth"
                type="date"
                {...register('dateOfBirth')}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              <Button
                type="button"
                onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
              >
                Next
              </Button>
            </div>
          </TabsContent>

          {/* Step 2: Location Information */}
          <TabsContent value="location" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="lga">Local Government Area *</Label>
                <select
                  id="lga"
                  {...register('lga')}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select LGA</option>
                  {availableLGAs.map((lgaOption) => (
                    <option key={lgaOption} value={lgaOption}>
                      {lgaOption}
                    </option>
                  ))}
                </select>
                {errors.lga && (
                  <p className="text-sm text-red-600 mt-1">{errors.lga.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="ward">Ward *</Label>
                <select
                  id="ward"
                  {...register('ward')}
                  disabled={!watchedLga}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select Ward</option>
                  {availableWards.map((wardOption) => (
                    <option key={wardOption} value={wardOption}>
                      {wardOption}
                    </option>
                  ))}
                </select>
                {errors.ward && (
                  <p className="text-sm text-red-600 mt-1">{errors.ward.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address (Optional)</Label>
              <Textarea
                id="address"
                placeholder="Street address or location details"
                {...register('address')}
                rows={3}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              >
                Previous
              </Button>
              <Button
                type="button"
                onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
              >
                Next
              </Button>
            </div>
          </TabsContent>

          {/* Step 3: Voter Information */}
          <TabsContent value="voter" className="space-y-4">
            <div>
              <Label htmlFor="pvcNumber">PVC Number (Permanent Voter's Card - Optional)</Label>
              <Input
                id="pvcNumber"
                placeholder="e.g., 1234567890123 or 12 3456 7890 1234"
                maxLength={20}
                {...register('pvcNumber')}
                className={errors.pvcNumber ? 'border-red-500' : ''}
              />
              {errors.pvcNumber && (
                <p className="text-sm text-red-600 mt-1">{errors.pvcNumber.message}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                14-digit PVC number (spaces allowed). Having a verified PVC helps track registration status
              </p>
            </div>

            <div>
              <Label htmlFor="occupation">Occupation (Optional)</Label>
              <Input
                id="occupation"
                placeholder="e.g., Engineer, Teacher, Farmer"
                {...register('occupation')}
              />
            </div>

            <div>
              <Label className="text-base font-semibold mb-3 block">Profile Photo *</Label>

              {!photoPreview ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={startCamera}
                      className="flex items-center gap-2"
                    >
                      <Camera className="w-4 h-4" />
                      Take Photo
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Upload Photo
                    </Button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border-2 border-blue-500 mx-auto"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={removePhoto}
                    className="absolute -top-2 -right-2 w-6 h-6 p-0"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              )}

              {/* Camera Interface */}
              {showCamera && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
                    <video
                      ref={videoRef}
                      autoPlay
                      className="w-full rounded-lg mb-4"
                    />
                    <canvas ref={canvasRef} className="hidden" />
                    <div className="flex gap-3">
                      <Button onClick={capturePhoto} className="flex-1">
                        Capture
                      </Button>
                      <Button onClick={cancelCamera} variant="outline" className="flex-1">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              >
                Previous
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Registering...' : 'Complete Registration'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </form>

      <div className="mt-6 pt-6 border-t text-center text-sm text-gray-600">
        Already registered? <a href="/login" className="text-blue-600 hover:underline">View your profile</a>
      </div>
        </Card>
      )}
    </div>
  );
}
