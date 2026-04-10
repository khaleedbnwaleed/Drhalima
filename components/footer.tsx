'use client'

import Link from 'next/link'
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react'

interface FooterProps {
  locale: 'en' | 'ha'
}

export default function Footer({ locale }: FooterProps) {
  const currentYear = new Date().getFullYear()

  const links = {
    en: {
      quickLinks: 'Quick Links',
      about: 'About',
      contact: 'Contact Us',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      followUs: 'Follow Us',
      contactInfo: 'Contact Information',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      copyright: `© ${currentYear} Dr. Halima Suleiman Zakari. All rights reserved.`,
    },
    ha: {
      quickLinks: 'Hadaddiyar Haƙoƙi',
      about: 'Game',
      contact: 'Tuntuɓi',
      privacy: 'Siyassun Sirri',
      terms: 'Sharƙan Aiki',
      followUs: 'Bi mu',
      contactInfo: 'Bayanan Tuntuɓi',
      email: 'Email',
      phone: 'Waya',
      address: 'Aiki',
      copyright: `© ${currentYear} Daktariya Halima Suleiman Zakari. Duk hakki an ajiye.`,
    }
  }

  const t = links[locale]

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-primary">Halima 2025</h3>
            <p className="text-foreground/70 text-sm leading-relaxed">
              {locale === 'en' 
                ? 'Building a better future through inclusive governance and community-driven change.'
                : 'Gina gida mafi kyau ta hanyar mulki mai ciki da bambanta da canjin da ke da kuma alaƙa da al\'ummomi.'
              }
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">{t.quickLinks}</h4>
            <nav className="flex flex-col gap-2 text-sm">
              <Link href="/about" className="text-foreground/70 hover:text-primary transition-colors">
                {t.about}
              </Link>
              <Link href="/contact" className="text-foreground/70 hover:text-primary transition-colors">
                {t.contact}
              </Link>
              <Link href="/admin/login" className="text-foreground/70 hover:text-primary transition-colors">
                {locale === 'en' ? 'Login' : 'Shiga'}
              </Link>
              <Link href="/privacy" className="text-foreground/70 hover:text-primary transition-colors">
                {t.privacy}
              </Link>
              <Link href="/terms" className="text-foreground/70 hover:text-primary transition-colors">
                {t.terms}
              </Link>
            </nav>
          </div>

          {/* Learn More */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Learn More</h4>
            <nav className="flex flex-col gap-2 text-sm">
              <Link href="/vision" className="text-foreground/70 hover:text-primary transition-colors">
                Vision
              </Link>
              <Link href="/platform" className="text-foreground/70 hover:text-primary transition-colors">
                Platform
              </Link>
              <Link href="/volunteer" className="text-foreground/70 hover:text-primary transition-colors">
                Volunteer
              </Link>
              <Link href="/member" className="text-foreground/70 hover:text-primary transition-colors">
                {locale === 'en' ? 'Member' : 'Membar'}
              </Link>
              <Link href="/supporter" className="text-foreground/70 hover:text-primary transition-colors">
                {locale === 'en' ? 'Supporter' : 'Mai Goyon Baya'}
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">{t.contactInfo}</h4>
            <div className="space-y-3 text-sm">
              <div className="flex gap-2 text-foreground/70 hover:text-primary transition-colors">
                <Mail size={18} />
                <a href="mailto:contact@halima2025.ng">contact@halima2025.ng</a>
              </div>
              <div className="flex gap-2 text-foreground/70 hover:text-primary transition-colors">
                <Phone size={18} />
                <a href="tel:+2348012345678">+234 801 234 5678</a>
              </div>
              <div className="flex gap-2 text-foreground/70">
                <MapPin size={18} />
                <span>Kano, Nigeria</span>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">{t.followUs}</h4>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border pt-8">
          <p className="text-center text-foreground/60 text-sm">
            {t.copyright}
          </p>
        </div>
      </div>
    </footer>
  )
}
