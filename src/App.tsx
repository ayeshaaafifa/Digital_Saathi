import { useEffect, useState } from 'react';
import { MessageSquareHeart, Camera, BookOpen, Users, ArrowRight, ArrowLeft } from 'lucide-react';
import type { Language, NavSection, TextScale } from './types';
import { TRANSLATIONS } from './i18n/translations';
import { FirebaseProvider, useFirebase } from './context/FirebaseContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { TopNav } from './components/TopNav';
import { AccessibilityBar } from './components/AccessibilityBar';
import { HeroOverview } from './components/HeroOverview';
import { AiSaathiChat } from './components/AiSaathiChat';
import { ScreenshotHelper } from './components/ScreenshotHelper';
import { DigitalLearning } from './components/DigitalLearning';
import { VolunteerConnect } from './components/VolunteerConnect';
import { ImpactDashboard } from './components/ImpactDashboard';

function getInitialLanguage(): Language {
  try {
    const saved = localStorage.getItem('ds_language');
    if (saved === 'en' || saved === 'ur' || saved === 'roman-ur') {
      return saved;
    }
  } catch {
    // Ignore storage read errors
  }
  return 'en';
}

function getInitialTextScale(): TextScale {
  try {
    const saved = localStorage.getItem('ds_text_scale');
    if (saved === 'large' || saved === 'xlarge' || saved === 'normal') {
      return saved;
    }
  } catch {
    // Ignore storage read errors
  }
  return 'normal';
}

function getInitialHighContrast(): boolean {
  try {
    return localStorage.getItem('ds_high_contrast') === 'true';
  } catch {
    return false;
  }
}

function DigitalSaathiContent({
  language,
  onChangeLanguage,
}: {
  language: Language;
  onChangeLanguage: (lang: Language) => void;
}) {
  const { setLanguagePreference } = useFirebase();
  const [activeSection, setActiveSection] = useState<NavSection>('home');
  const [textScale, setTextScale] = useState<TextScale>(getInitialTextScale);
  const [highContrast, setHighContrast] = useState<boolean>(getInitialHighContrast);

  const t = TRANSLATIONS[language];
  const DirectionalArrow = language === 'ur' ? ArrowLeft : ArrowRight;

  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove('text-scale-large', 'text-scale-xlarge');
    if (textScale === 'large') {
      html.classList.add('text-scale-large');
    } else if (textScale === 'xlarge') {
      html.classList.add('text-scale-xlarge');
    }
    try {
      localStorage.setItem('ds_text_scale', textScale);
    } catch {
      // Ignore storage write errors
    }
  }, [textScale]);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle('high-contrast', highContrast);
    try {
      localStorage.setItem('ds_high_contrast', String(highContrast));
    } catch {
      // Ignore storage write errors
    }
  }, [highContrast]);

  const handleLanguageChange = (nextLang: Language) => {
    onChangeLanguage(nextLang);
    setLanguagePreference(nextLang).catch(() => {});
  };

  const handleNavigate = (section: NavSection) => {
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 pb-20 md:pb-0">
      <TopNav t={t} activeSection={activeSection} onSelectSection={handleNavigate} />

      <AccessibilityBar
        t={t}
        language={language}
        onChangeLanguage={handleLanguageChange}
        textScale={textScale}
        onChangeTextScale={setTextScale}
        highContrast={highContrast}
        onToggleHighContrast={() => setHighContrast((prev) => !prev)}
        showBackToHome={activeSection !== 'home'}
        onBackToHome={() => handleNavigate('home')}
      />

      <main className="flex-1 min-w-0">
        {activeSection === 'home' && (
          <>
            <HeroOverview
              t={t}
              language={language}
              textScale={textScale}
              onNavigate={handleNavigate}
            />

            {/* Quick Feature Directory on Home */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  {
                    id: 'chat' as const,
                    icon: MessageSquareHeart,
                    title: t.chat.heading,
                    desc: t.chat.subheading,
                  },
                  {
                    id: 'screenshot' as const,
                    icon: Camera,
                    title: t.screenshot.heading,
                    desc: t.screenshot.subheading,
                  },
                  {
                    id: 'learn' as const,
                    icon: BookOpen,
                    title: t.learn.heading,
                    desc: t.learn.subheading,
                  },
                  {
                    id: 'volunteers' as const,
                    icon: Users,
                    title: t.volunteers.heading,
                    desc: t.volunteers.subheading,
                  },
                ].map((card) => {
                  const Icon = card.icon;
                  return (
                    <button
                      key={card.id}
                      type="button"
                      onClick={() => handleNavigate(card.id)}
                      className="text-start bg-white border border-slate-200 rounded-2xl p-5 hover:border-teal-700 transition-colors flex flex-col justify-between space-y-4 cursor-pointer min-h-[180px]"
                    >
                      <div className="space-y-3">
                        <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center">
                          <Icon className="w-6 h-6 text-teal-700" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900">{card.title}</h2>
                        <p className="text-sm text-slate-700 leading-relaxed">{card.desc}</p>
                      </div>
                      <span className="inline-flex items-center gap-2 text-sm font-bold text-teal-800 pt-1">
                        <span>{card.title}</span>
                        <DirectionalArrow className="w-4 h-4 shrink-0" />
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Embed AI Saathi Chat right below on the Home landing view for zero-latency access */}
            <div className="border-t border-slate-200 bg-slate-50">
              <AiSaathiChat t={t} language={language} textScale={textScale} />
            </div>
          </>
        )}

        {activeSection === 'chat' && (
          <AiSaathiChat t={t} language={language} textScale={textScale} />
        )}
        {activeSection === 'screenshot' && (
          <ScreenshotHelper t={t} language={language} textScale={textScale} />
        )}
        {activeSection === 'learn' && (
          <DigitalLearning t={t} language={language} textScale={textScale} />
        )}
        {activeSection === 'volunteers' && (
          <VolunteerConnect t={t} language={language} textScale={textScale} />
        )}
        {activeSection === 'impact' && (
          <ImpactDashboard t={t} textScale={textScale} />
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-slate-600">
          <p className="font-semibold text-slate-800">{t.footer.mission}</p>
          <p>{t.footer.gdgNote}</p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    const html = document.documentElement;
    html.dir = language === 'ur' ? 'rtl' : 'ltr';
    html.lang = language === 'ur' ? 'ur' : 'en';
    try {
      localStorage.setItem('ds_language', language);
    } catch {
      // Ignore storage write errors
    }
  }, [language]);

  return (
    <ErrorBoundary>
      <FirebaseProvider currentLanguage={language}>
        <DigitalSaathiContent language={language} onChangeLanguage={setLanguage} />
      </FirebaseProvider>
    </ErrorBoundary>
  );
}
