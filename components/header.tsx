'use client'

import Link from 'next/link'
import { Menu, X, Heart, Users, Newspaper, Image, Mail, UserCheck, LogIn, Home } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'About', href: '/about', icon: Users },
    { label: 'News', href: '/news', icon: Newspaper },
    { label: 'Gallery', href: '/gallery', icon: Image },
    { label: 'Contact', href: '/contact', icon: Mail },
    { label: 'Member', href: '/member', icon: UserCheck },
    { label: 'Supporter', href: '/supporter', icon: Heart },
    { label: 'Verify', href: '/verify', icon: UserCheck },
  ]

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex h-20 items-center justify-between">
          {/* Logo/Brand Section */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">HS</span>
            </div>
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
            <Link
              href="/admin/login"
              className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              <LogIn size={16} />
              <span>Admin</span>
            </Link>
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
            <Link
              href="/admin/login"
              className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              <LogIn size={18} />
              <span className="font-medium">Admin Login</span>
            </Link>
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
