'use client'

import { useState } from 'react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Card } from '@/components/ui/card'
import { Award, Users, Target, Heart } from 'lucide-react'

export default function AboutPage() {
  const [locale, setLocale] = useState<'en' | 'ha'>('en')

  const content = {
    en: {
      title: 'About Dr. Halima Suleiman Zakari',
      hero: 'Ambassador of Change and Empowerment',
      background: 'A visionary philanthropist and businesswoman, Dr. Halima Suleiman Zakari has dedicated her life to transforming communities through education, healthcare, and economic empowerment. Her boundless commitment to serving others has touched the lives of thousands across Jigawa State and beyond.',
      section1Title: 'Background & Achievements',
      section1: `Dr. Halima Suleiman Zakari is an accomplished businesswoman and philanthropist with significant contributions to Nigeria:

• Chairperson of African Modular Refineries
• President of Precision Financial Services
• Founder of Nana Halima Empowerment Initiatives
• Founder of Nigeria-Canadian College
• UN Goodwill Ambassador & Peace Ambassador Award recipient

Her philanthropic initiatives have impacted the lives of tens of thousands through:
- Educational support and infrastructure development
- Healthcare outreach to vulnerable populations
- Economic empowerment programs for orphaned couples and youth
- Scholarship programs and vocational training
- Women's economic empowerment and rights advocacy`,
      section2Title: 'Core Values & Mission',
      values: [
        { icon: Heart, title: 'Compassion', desc: 'Serving the vulnerable and supporting those in need' },
        { icon: Target, title: 'Excellence', desc: 'Striving for quality and sustainable development' },
        { icon: Users, title: 'Empowerment', desc: 'Creating opportunities for economic and social advancement' },
        { icon: Award, title: 'Integrity', desc: 'Leading by example with transparency and honesty' },
      ],
      testimonialTitle: 'Impact Stories',
      testimonials: [
        { name: 'Healthcare Beneficiaries', role: 'VVF Hospital Patients', quote: '85 survivors of abuse received ₦50,000 each and critical support for their recovery. Her compassion gave us hope again.' },
        { name: 'Entrepreneurship Program', role: 'Business Owners', quote: '30 orphaned couples received ₦100,000 each to launch business ventures. This support transformed our futures.' },
      ],
    },
    ha: {
      title: 'Game Daktariya Halima Suleiman Zakari',
      hero: 'Jagorar Canja da Ci Gaba',
      background: 'Mai alheri da businesswoman, Daktariya Halima Suleiman Zakari ta ba da jira ta rayuwa don canjin al\'ummomi ta hanyar ilimi, lafiya, da bayar wa jama\'a. Almubilantarwa ta mai raɓa jiya-jiya ta taɓa rayuwa na dubukan mutane a Jigawa da sauran wurare.',
      section1Title: 'Aiki da Nasarori',
      section1: `Daktariya Halima Suleiman Zakari ita ce woman na aiki da alheri tare da abubuwan matakai a Najeriya:

• Shugaba na African Modular Refineries
• Shugaba na Precision Financial Services
• Mahalici na Nana Halima Empowerment Initiatives
• Mahalici na Nigeria-Canadian College
• Jami\'ar Goodwill na UN da Peace Ambassador Award

Shiriyar alheria ta ta aiki:
- Goyon bayan ilimi da haɓakar jiki
- Shirin lafiya ga marubuta
- Bayar wa matasa da maza da mata
- Shirin karatun ilimi da karancin sana\'a
- Haɓakar matar tattalin arziki da karfi`,
      section2Title: 'Daidaitaccen Abubuwa & Wahayi',
      values: [
        { icon: Heart, title: 'Ƙauna', desc: 'Aiki don marubuta da masu bukatu' },
        { icon: Target, title: 'Jajiya', desc: 'Ƙowar kyau da haɓakan jiya-jiya' },
        { icon: Users, title: 'Ci Gaba', desc: 'Samar da daukar jiya ga tattalin arziki' },
        { icon: Award, title: 'Gaskiya', desc: 'Jagorar ta bayyana da aiki sosai' },
      ],
      testimonialTitle: 'Labarin Tasiri',
      testimonials: [
        { name: 'Marubutan Lafiya', role: 'Jami\'an VVF Hospital', quote: '85 ga ga mita ta sufuri sami ₦50,000 da goyon bayan. Alheria ta bai muki niyya kuma.' },
        { name: 'Shirin Kasuwanci', role: 'Mai Kasuwanci', quote: '30 jama\'a sami ₦100,000 don fara kasuwanci. Bayar ta canja jiyar mu.' },
      ],
    }
  }

  const t = content[locale]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header locale={locale} setLocale={setLocale} />

      {/* Hero */}
      <section className="pt-20 pb-12 px-4 md:px-8 lg:px-16 bg-linear-to-b from-primary/5">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-4">{t.title}</h1>
          <p className="text-lg sm:text-xl md:text-2xl text-foreground/80">{t.hero}</p>
        </div>
      </section>

      {/* Background */}
      <section className="py-16 px-4 md:px-8 lg:px-16">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 md:p-12">
            <p className="text-lg text-foreground/80 leading-relaxed mb-8">
              {t.background}
            </p>
            <h2 className="text-3xl font-bold text-primary mb-4">{t.section1Title}</h2>
            <div className="prose prose-invert max-w-none">
              {t.section1.split('\n').map((line, idx) => (
                line.trim() ? (
                  <p key={idx} className="text-foreground/80 mb-3">
                    {line.includes('•') ? <span className="ml-4">{line}</span> : line}
                  </p>
                ) : null
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-primary mb-12">{t.section2Title}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.values.map((value, idx) => {
              const Icon = value.icon
              return (
                <Card key={idx} className="p-6">
                  <Icon className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                  <p className="text-foreground/70">{value.desc}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 md:px-8 lg:px-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-primary mb-12">{t.testimonialTitle}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {t.testimonials.map((testimonial, idx) => (
              <Card key={idx} className="p-8 border-l-4 border-l-primary">
                <p className="text-lg text-foreground/80 italic mb-4">"{testimonial.quote}"</p>
                <div>
                  <p className="font-bold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-foreground/60">{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer locale={locale} />
    </div>
  )
}
