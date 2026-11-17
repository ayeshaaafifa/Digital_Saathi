import { useState } from 'react';
import { ArrowRight, ArrowLeft, Camera, MessageSquareHeart } from 'lucide-react';
import type { Language, NavSection, TextScale } from '../types';
import type { UiStrings } from '../i18n/translations';
import { useFirebase } from '../context/FirebaseContext';

interface HeroOverviewProps {
  t: UiStrings;
  language: Language;
  textScale: TextScale;
  onNavigate: (section: NavSection) => void;
}

export function HeroOverview({
  t,
  language,
  textScale,
  onNavigate,
}: HeroOverviewProps) {
  const { user } = useFirebase();
  const [imgFailed, setImgFailed] = useState(false);
  const isRtl = language === 'ur';
  const DirectionalArrow = isRtl ? ArrowLeft : ArrowRight;

  const isEnlarged = textScale !== 'normal';

  return (
    <section className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-center space-y-5 sm:space-y-6 min-w-0">
            <p className="text-sm font-semibold text-teal-800">{t.hero.kicker}</p>

            <h1
              className={`font-bold tracking-tight text-slate-900 text-balance ${
                isEnlarged
                  ? 'text-2xl sm:text-4xl lg:text-[42px] leading-[1.24]'
                  : 'text-2xl sm:text-4xl lg:text-[42px] leading-[1.18]'
              }`}
            >
              {t.hero.headline}
            </h1>

            <p
              className={`text-slate-700 max-w-2xl leading-relaxed ${
                textScale === 'xlarge'
                  ? 'text-lg sm:text-xl'
                  : textScale === 'large'
                    ? 'text-base sm:text-xl'
                    : 'text-base sm:text-lg'
              }`}
            >
              {t.hero.subheadline}
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3.5 pt-1">
              <button
                type="button"
                onClick={() => onNavigate('chat')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 min-h-[50px] px-6 py-3 rounded-xl bg-teal-700 text-white text-base font-semibold hover:bg-teal-800 transition-colors cursor-pointer"
              >
                <MessageSquareHeart className="w-5 h-5 shrink-0" />
                <span>{t.hero.primaryCta}</span>
                <DirectionalArrow className="w-4 h-4 shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('screenshot')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 min-h-[50px] px-5 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 text-base font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Camera className="w-5 h-5 text-teal-700 shrink-0" />
                <span>{t.hero.secondaryCta}</span>
              </button>
            </div>

            <div className="pt-3 border-t border-slate-100 text-xs sm:text-sm text-slate-600 flex flex-wrap items-center gap-x-2 gap-y-1">
              <span>{t.hero.trustLine}</span>
              <span aria-hidden="true">·</span>
              <span>{user ? t.auth.syncSavedNote : t.auth.guestSaveNote}</span>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="h-full min-h-[240px] sm:min-h-[280px] lg:min-h-[360px] rounded-2xl overflow-hidden border border-slate-200 bg-teal-50">
              {!imgFailed ? (
                <img
                  src="/src/assets/images/hero_community_learning_1794919206299.jpg"
                  alt={t.hero.imageAlt}
                  referrerPolicy="no-referrer"
                  onError={() => setImgFailed(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-teal-50 to-emerald-50">
                  <MessageSquareHeart className="w-12 h-12 text-teal-700 mb-3" />
                  <p className="text-base font-semibold text-teal-950">{t.brand}</p>
                  <p className="text-sm text-slate-700 mt-1">{t.hero.kicker}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
