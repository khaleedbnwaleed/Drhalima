'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Heart, Users, Newspaper, Image as ImageIcon, Mail, UserCheck, LogIn, Home, Languages } from 'lucide-react'
import { useState } from 'react'

interface HeaderProps {
  locale?: 'en' | 'ha'
  setLocale?: (locale: 'en' | 'ha') => void
}

export default function Header({ locale = 'en', setLocale }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { label: locale === 'en' ? 'Home' : 'Gida', href: '/', icon: Home },
    { label: locale === 'en' ? 'About' : 'Game', href: '/about', icon: Users },
    { label: locale === 'en' ? 'News' : 'Labarai', href: '/news', icon: Newspaper },
    { label: locale === 'en' ? 'Gallery' : 'Hotuna', href: '/gallery', icon: ImageIcon },
    { label: locale === 'en' ? 'Contact' : 'Tuntuɓi', href: '/contact', icon: Mail },
    { label: locale === 'en' ? 'Verify' : 'Tabbatarwa', href: '/verify', icon: UserCheck },
  ]

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex h-20 items-center justify-between">
          {/* Logo/Brand Section */}
          <div className="flex items-center space-x-3">
            <Image src="/Logo.png" alt="Dr. Halima Sulaiman Logo" width={48} height={48} className="rounded-lg" />
            <div className="hidden sm:block">
              <Link href="/" className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                Dr. Halima Sulaiman
              </Link>
              <p className="text-xs text-gray-600 leading-tight">2025 Campaign</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
              >
                <item.icon size={16} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Login Links */}
          <div className="hidden md:flex items-center space-x-3 ml-4">
            {/* Language Toggle */}
            {setLocale && (
              <button
                onClick={() => setLocale(locale === 'en' ? 'ha' : 'en')}
                className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                aria-label="Toggle language"
              >
                <Languages size={16} />
                <span>{locale === 'en' ? 'EN' : 'HA'}</span>
              </button>
            )}
            <div className="h-6 w-px bg-gray-300"></div>
            <Link
              href="/supporter-login"
              className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <LogIn size={16} />
              <span>Supporter</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={24} className="text-gray-700" /> : <Menu size={24} className="text-gray-700" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
          <nav className="px-4 py-6 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon size={18} />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
            <div className="border-t border-gray-200 my-4"></div>
            {/* Language Toggle Mobile */}
            {setLocale && (
              <button
                onClick={() => {
                  setLocale(locale === 'en' ? 'ha' : 'en')
                  setMobileMenuOpen(false)
                }}
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 w-full text-left"
              >
                <Languages size={18} />
                <span className="font-medium">Language: {locale === 'en' ? 'English' : 'Hausa'}</span>
              </button>
            )}
            <Link
              href="/supporter-login"
              className="flex items-center space-x-3 px-4 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              <LogIn size={18} />
              <span className="font-medium">Supporter Login</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
