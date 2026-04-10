'use client'

import { useState } from 'react'
import Image from 'next/image'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function EmpowermentPage() {
  const [activeProgram, setActiveProgram] = useState(0)
  const [currentImageIndex, setCurrentImageIndex] = useState<Record<number, number>>({
    0: 0, 1: 0, 2: 0, 3: 0, 4: 0
  })
  const [locale, setLocale] = useState<'en' | 'ha'>('en')

  const programs = [
    {
      id: 0,
      title_en: 'Women Economic Empowerment',
      title_ha: 'Haɓaka Tattalin Arziki na Mace',
      desc_en: 'Empowering women entrepreneurs with capital, training, and mentorship to establish and grow their businesses. This program has provided over ₦50 million in microfinance and business development support to hundreds of women across Jigawa State.',
      desc_ha: 'Bayar wa matan kasuwanci jari, horo, da goyon bayan don kafa da haɓaka kasuwancin su. Wannan shirye ya ba da fiye da ₦50 miliyan a kasuwanci karama da goyon bayan haɓaka kasuwanci ga jamilai mutane a fadin Jigawa.',
      images: [
        'https://images.unsplash.com/photo-1552921206-f6e426451bfc?w=800&h=500&fit=crop',
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a5?w=800&h=500&fit=crop',
        'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop',
      ]
    },
    {
      id: 1,
      title_en: 'Youth Skills Training Program',
      title_ha: 'Shiryen Koyo Sana\'a ga Matasa',
      desc_en: 'Building sustainable livelihoods through vocational and technical skills training. Over 5,000 youth have been trained in trades like welding, plumbing, tailoring, and digital marketing, resulting in 70% employment or self-employment rates.',
      desc_ha: 'Samar da jiyar kasuwanci ta hanyar koyon sana\'a da kwararre. Matasa sama da 5,000 an horo su a sana\'a yadda gasa, rufe, tela, da kasuwancin dijital. 70% daga cikinsu suka samun aiki ko sai kawai su kasua kansu.',
      images: [
        'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop',
        'https://images.unsplash.com/photo-1522071820081-93f39c48af00?w=800&h=500&fit=crop',
        'https://images.unsplash.com/photo-1552921206-f6e426451bfc?w=800&h=500&fit=crop',
      ]
    },
    {
      id: 2,
      title_en: 'Healthcare Access Initiative',
      title_ha: 'Shiryen Samun Lafiya',
      desc_en: 'Bringing quality healthcare to underserved communities through mobile clinics and partnerships with healthcare providers. Provided medical support to 85 VVF survivors and conducted over 10,000 health screenings in rural areas.',
      desc_ha: 'Kawo da lafiya mai kyau zuwa jama\'a marubuta ta hanyar gida na kwata-kwatan na lafiya. An ba da goyon bayan lafiya ga 85 marubutan VVF.',
      images: [
        'https://images.unsplash.com/photo-1631217314830-4e567306220a?w=800&h=500&fit=crop',
        'https://images.unsplash.com/photo-1576091160550-112173f7f869?w=800&h=500&fit=crop',
        'https://images.unsplash.com/photo-1579154204601-01d82b27d100?w=800&h=500&fit=crop',
      ]
    },
    {
      id: 3,
      title_en: 'Education & Scholarship Program',
      title_ha: 'Shiryen Ilimi da Karatua',
      desc_en: 'Removing barriers to quality education through scholarships, school infrastructure development, and teacher training. 2,000+ students have received scholarships, and 15 schools have been renovated with improved learning facilities.',
      desc_ha: 'Kawar da cikin ilimi ta hanyar karatua, gina abubuwan seela, da horo mai kyau. Dubukan 2,000 da fiye karatu sun sami karatua.',
      images: [
        'https://images.unsplash.com/photo-1427504494785-cdaeb3a22dc0?w=800&h=500&fit=crop',
        'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&h=500&fit=crop',
        'https://images.unsplash.com/photo-1427504494785-cdaeb3a22dc0?w=800&h=500&fit=crop',
      ]
    },
    {
      id: 4,
      title_en: 'Community Development Projects',
      title_ha: 'Ayyukan Ci Gaba na Al\'ummomi',
      desc_en: 'Creating sustainable community infrastructure including water systems, roads, and market facilities. Projects focus on areas with the greatest need, directly benefiting over 50,000 community members through improved access to essential services.',
      desc_ha: 'Samar da halaka jama\'a yadda aka gina rufe ruwan sha, hanya, da kasuwancin gida. Abubuwan nan sun damje wa 50,000 da fiye mutane.',
      images: [
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=500&fit=crop',
        'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop',
        'https://images.unsplash.com/photo-1517457373614-b7152f800fd1?w=800&h=500&fit=crop',
      ]
    }
  ]

  const content = {
    en: {
      title: 'Empowerment',
      subtitle: 'Transforming Lives Through Sustainable Development',
      description: 'Dr. Halima Suleiman Zakari believes in creating lasting impact through comprehensive empowerment programs. Our initiatives focus on education, healthcare, economic opportunity, and community development to lift individuals and families out of poverty and enable them to achieve their full potential.',
    },
    ha: {
      title: 'Ci Gaba',
      subtitle: 'Canja Rayuwa Ta Hanyar Ci Gaban Jiya-jiya',
      description: 'Daktariya Halima Suleiman Zakari ta yarda cewa an iya kawo da tasiri ta hanyar babbbar shire na ci gaba. Abubuwan da muke yi suna auna ilimi, lafiya, kasuwanci, da ci gaba na al\'ummomi don tashi ga mutane da iyalai da wahala da bai su samun iko gaida.',
    }
  }

  const currentContent = content[locale]
  const currentProgram = programs[activeProgram]
  const programImages = currentProgram.images
  const currentProgramImageIndex = currentImageIndex[activeProgram] || 0

  const nextImage = () => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [activeProgram]: (prev[activeProgram] + 1) % programImages.length
    }))
  }

  const prevImage = () => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [activeProgram]: (prev[activeProgram] - 1 + programImages.length) % programImages.length
    }))
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-20 pb-12 px-4 md:px-8 lg:px-16 bg-gradient-to-b from-primary/5">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold text-primary">{currentContent.title}</h1>
          <p className="text-2xl font-semibold text-foreground/80">{currentContent.subtitle}</p>
          <p className="text-lg text-foreground/70 leading-relaxed max-w-3xl mx-auto">
            {currentContent.description}
          </p>
        </div>
      </section>

      {/* Program Navigation Tabs */}
      <section className="py-8 px-4 md:px-8 lg:px-16 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center">
            {programs.map((program, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveProgram(idx)
                  setCurrentImageIndex(prev => ({ ...prev, [idx]: 0 }))
                }}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  activeProgram === idx
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-background border border-border hover:border-primary'
                }`}
              >
                {locale === 'en' ? program.title_en : program.title_ha}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Program Detail */}
      <section className="py-12 px-4 md:px-8 lg:px-16">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Program Title & Description */}
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-primary">
              {locale === 'en' ? currentProgram.title_en : currentProgram.title_ha}
            </h2>
            <p className="text-lg text-foreground/80 leading-relaxed">
              {locale === 'en' ? currentProgram.desc_en : currentProgram.desc_ha}
            </p>
          </div>

          {/* Image Carousel */}
          <div className="relative group">
            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted shadow-lg">
              <Image
                src={programImages[currentProgramImageIndex]}
                alt={`${locale === 'en' ? currentProgram.title_en : currentProgram.title_ha} image`}
                fill
                className="w-full h-full object-cover"
              />
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-primary rounded-full p-2 shadow-lg transition-all opacity-0 group-hover:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-primary rounded-full p-2 shadow-lg transition-all opacity-0 group-hover:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>

            {/* Image Indicators */}
            <div className="flex gap-2 justify-center mt-6">
              {programImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(prev => ({ ...prev, [activeProgram]: idx }))}
                  className={`w-3 h-3 rounded-full transition-all ${
                    idx === currentProgramImageIndex ? 'bg-primary w-8' : 'bg-muted'
                  }`}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer locale={locale} />
    </div>
  )
}
