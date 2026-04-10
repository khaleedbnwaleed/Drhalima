'use client'

import Header from '@/components/header'
import Footer from '@/components/footer'
import SupporterVerification from '@/components/supporter-verification'

export default function VerifyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <section className="pt-20 pb-12 px-4 md:px-8 lg:px-16 bg-linear-to-b from-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-primary mb-4">Verify Membership</h1>
          <p className="text-xl text-foreground/80">
            Confirm whether a supporter is registered using their email, phone number, or supporter ID.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 md:px-8 lg:px-16">
        <div className="max-w-4xl mx-auto">
          <SupporterVerification />
        </div>
      </section>

      <Footer locale="en" />
    </div>
  )
}
