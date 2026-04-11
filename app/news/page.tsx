'use client'

import { useState } from 'react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Card } from '@/components/ui/card'
import { Clock, User } from 'lucide-react'

export default function NewsPage() {
  const [locale, setLocale] = useState<'en' | 'ha'>('en')

  const posts = [
    {
      id: 1,
      title_en: 'Dr. Halima Launches Educational Initiative',
      title_ha: 'Daktariya Halima ta Fara Shiryen Ilimi',
      excerpt_en: 'A comprehensive plan to bring quality education to all children in the state.',
      excerpt_ha: 'Abin takaita don kawo da ilimi kyau ga dukan yara a jiha.',
      content_en: 'Dr. Halima unveiled her ambitious educational initiative aimed at transforming the lives of thousands of children across the state. The program will focus on establishing new schools, training teachers, and providing scholarships to deserving students.',
      content_ha: 'Daktariya Halima ta bayyana abin ƙaura na ilimi wanda zai yi canja ta rayuwa ta yara da yawa. Shiryin zai yanke kan kafa kasuwa, horo malikin makarantu, da baje labarin ilimi ga talibai.',
      date: '2024-12-15',
      author_en: 'Campaign Team',
      author_ha: 'Abin Aiki',
      image: 'https://images.unsplash.com/photo-1427504494785-cdaeb3a22dc0?w=600&h=400&fit=crop',
    },
    {
      id: 2,
      title_en: 'Healthcare Initiative Reaches 10,000 People',
      title_ha: 'Shiryen Lafiya ta Kaiwa ga Mutane 10,000',
      excerpt_en: 'Free medical services provided to underserved communities.',
      excerpt_ha: 'Aiki lafiya na karee an baje ga al\'ummomi masu wahala.',
      content_en: 'The healthcare outreach program successfully provided free medical consultations and treatments to over 10,000 people in remote areas. This initiative demonstrates our commitment to accessible healthcare for all.',
      content_ha: 'Shiryen lafiya ya baje labarin aiki lafiya na karee ga jama\'a 10,000 a waje. Wannan shirye ya nuna alƙaki ta kawo da lafiya ga kowa.',
      date: '2024-12-10',
      author_en: 'Campaign Team',
      author_ha: 'Abin Aiki',
      image: 'https://images.unsplash.com/photo-1576091160550-112173f7f869?w=600&h=400&fit=crop',
    },
    {
      id: 3,
      title_en: 'Women Empowerment Program Launched',
      title_ha: 'An Fara Shiryen Haɓakar Jarirai',
      excerpt_en: 'Providing skills training and business support to 5,000 women.',
      excerpt_ha: 'An baja labarin sana\'a da goyon bayan kasua ga jarirai 5,000.',
      content_en: 'The women empowerment initiative was officially launched with the goal of training and supporting 5,000 women in business and vocational skills. This program will create economic opportunities and foster financial independence.',
      content_ha: 'An fara shiryen haɓakar jarirai tare da baba da karfe na 5,000 a aiki da sana\'a. Wannan shirye zai samar da kasua da karfi na kuɗi.',
      date: '2024-12-05',
      author_en: 'Campaign Team',
      author_ha: 'Abin Aiki',
      image: 'https://images.unsplash.com/photo-1552921206-f6e426451bfc?w=600&h=400&fit=crop',
    },
    {
      id: 4,
      title_en: 'Community Engagement Tour Concludes',
      title_ha: 'An Kawo da Taron Al\'ummomi',
      excerpt_en: 'Dr. Halima meets with over 50,000 community members.',
      excerpt_ha: 'Daktariya Halima ta hadu da jama\'a 50,000.',
      content_en: 'The comprehensive community engagement tour visited all 34 local government areas, engaging with over 50,000 residents. The insights gathered will inform policy development and implementation strategies.',
      content_ha: 'Taron al\'ummomi ya ziyarci dukan LGAs 34 tare da hadawa da jama\'a 50,000. Abin da aka samu zai bambanta da aiki na mulki.',
      date: '2024-11-28',
      author_en: 'Campaign Team',
      author_ha: 'Abin Aiki',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
    },
  ]

  const t = {
    en: {
      title: 'Campaign News',
      subtitle: 'Latest updates from Dr. Halima\'s campaign',
      readMore: 'Read More',
      postedBy: 'Posted by',
    },
    ha: {
      title: 'Labarai',
      subtitle: 'Sabon labari daga yunƙurin Daktariya',
      readMore: 'Karanta Gari',
      postedBy: 'Ita',
    }
  }

  const currentT = t[locale]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header locale={locale} setLocale={setLocale} />

      {/* Hero */}
      <section className="pt-20 pb-12 px-4 md:px-8 lg:px-16 bg-gradient-to-b from-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-primary mb-4">{currentT.title}</h1>
          <p className="text-xl text-foreground/80">{currentT.subtitle}</p>
        </div>
      </section>

      {/* News Posts */}
      <section className="py-12 px-4 md:px-8 lg:px-16">
        <div className="max-w-4xl mx-auto space-y-8">
          {posts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="grid md:grid-cols-3 gap-0">
                <div className="md:col-span-1 relative aspect-video md:aspect-auto overflow-hidden">
                  <img
                    src={post.image}
                    alt={locale === 'en' ? post.title_en : post.title_ha}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="md:col-span-2 p-6 md:p-8">
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {locale === 'en' ? post.title_en : post.title_ha}
                  </h3>

                  <div className="flex flex-wrap gap-4 text-sm text-foreground/60 mb-4">
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      <span>{new Date(post.date).toLocaleDateString(locale === 'en' ? 'en-US' : 'ha-NG')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User size={16} />
                      <span>{locale === 'en' ? post.author_en : post.author_ha}</span>
                    </div>
                  </div>

                  <p className="text-foreground/80 mb-6 leading-relaxed">
                    {locale === 'en' ? post.excerpt_en : post.excerpt_ha}
                  </p>

                  <button className="text-primary hover:text-primary/80 font-semibold transition-colors">
                    {currentT.readMore} →
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <Footer locale={locale} />
    </div>
  )
}
