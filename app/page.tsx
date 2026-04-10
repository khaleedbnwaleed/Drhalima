import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Heart, Users, Megaphone, Globe, CheckCircle } from 'lucide-react'
import Header from '@/components/header'
import Footer from '@/components/footer'

const t = {
    en: {
      nav: { home: 'Home', about: 'About', platform: 'Platform', vision: 'Vision', gallery: 'Gallery', news: 'News', member: 'Member', volunteer: 'Volunteer', contact: 'Contact' },
      hero: { title: 'Building a Better Future Together', subtitle: 'Join Dr. Halima Suleiman Zakari\'s movement for positive change and inclusive governance', cta: 'Register as a Member' },
      pillars: 'Our Pillars',
      pillar1: { title: 'Education for All', desc: 'Quality education accessible to every child' },
      pillar2: { title: 'Healthcare', desc: 'Affordable healthcare for all communities' },
      pillar3: { title: 'Economic Growth', desc: 'Job creation and business opportunities' },
      pillar4: { title: 'Good Governance', desc: 'Transparent and accountable leadership' },
      stats: { volunteers: 'Active Volunteers', supporters: 'Campaign Supporters', donations: 'Funds Raised', communities: 'Communities Reached' }
    },
    ha: {
      nav: { home: 'Gida', about: 'Game', platform: 'Bâkin Aiki', vision: 'Wahayi', gallery: 'Hotuna', news: 'Labarai', member: 'Membar', volunteer: 'Taimakawa', contact: 'Tuntuɓi' },
      hero: { title: 'Gina Gida Mafi Kyau Tare', subtitle: 'Shiga cikin yunƙurin Daktariya Halima Suleiman Zakari don daidaitaccen sashen kudi', cta: 'Yi Rajista a Matsayin Memba' },
      pillars: 'Abubuwan Ginawa',
      pillar1: { title: 'Ilimi don Kowa', desc: 'Ilimi mai kyau ga kowa daga yara' },
      pillar2: { title: 'Lafiya', desc: 'Aiki da lafiya na karee ga dukan al\'ummomin' },
      pillar3: { title: 'Haɓaka Tattalin Arziki', desc: 'Samar da aiki da kasua' },
      pillar4: { title: 'Cin Gida Mai Kyau', desc: 'Mulki mai bayyananniya da albaski' },
      stats: { volunteers: 'Masu Taimakawa', supporters: 'Masu Goyon Baya', donations: 'Kuɗi da aka tara', communities: 'Al\'ummomi da aka kaiwa' }
    }
  }

export default function Home() {
  const locale = 'en'
  const currentT = t[locale]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header locale={locale} />
      
      {/* Hero Section */}
      <section 
        className="relative pt-20 pb-16 md:pb-32 px-4 md:px-8 lg:px-16 bg-cover bg-center bg-no-repeat min-h-100 md:min-h-150 flex items-center justify-center"
        style={{
          backgroundImage: 'url(/campaign-hero.jpg)',
        }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-balance text-white drop-shadow-lg">
            {currentT.hero.title}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/95 text-balance leading-relaxed drop-shadow-md">
            {currentT.hero.subtitle}
          </p>
          <div className="flex gap-4 justify-center pt-8 flex-wrap">
            <Link href="/member">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                {currentT.hero.cta}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-primary">
            {currentT.pillars}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {[
              { Icon: Users, title: currentT.pillar1.title, desc: currentT.pillar1.desc },
              { Icon: Heart, title: currentT.pillar2.title, desc: currentT.pillar2.desc },
              { Icon: Megaphone, title: currentT.pillar3.title, desc: currentT.pillar3.desc },
              { Icon: Globe, title: currentT.pillar4.title, desc: currentT.pillar4.desc },
            ].map((pillar, idx) => (
              <Card key={idx} className="p-6 hover:shadow-lg transition-shadow">
                <pillar.Icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2 text-foreground">
                  {pillar.title}
                </h3>
                <p className="text-foreground/70">
                  {pillar.desc}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-primary text-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: currentT.stats.volunteers, value: '2,500+' },
            { label: currentT.stats.supporters, value: '15,000+' },
            { label: currentT.stats.communities, value: '45+' },
          ].map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-5xl font-bold mb-2">{stat.value}</div>
              <p className="text-white/80">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-8 lg:px-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold text-primary">
            Ready to Join the Movement?
          </h2>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/member">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                {currentT.nav.member}
              </Button>
            </Link>
            <Link href="/volunteer">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                {currentT.nav.volunteer}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      

      <Footer locale={locale} />
    </div>
  )
}
