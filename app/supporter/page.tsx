'use client';

import Header from '@/components/header';
import Footer from '@/components/footer';
import SupporterRegistrationForm from '@/components/supporter-registration-form';

export default function SupporterPage() {
  const locale: 'en' = 'en'

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12 px-4">
        <div className="container mx-auto">
          <SupporterRegistrationForm />
        </div>
      </main>
      <Footer locale={locale} />
    </div>
  );
}
