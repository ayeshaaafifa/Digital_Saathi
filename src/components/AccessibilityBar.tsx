import {
  Globe,
  Type as TypeIcon,
  Contrast,
  ArrowLeft,
  ArrowRight,
  Home,
  ShieldCheck,
} from 'lucide-react';
import type { Language, TextScale } from '../types';
import type { UiStrings } from '../i18n/translations';
import { useFirebase } from '../context/FirebaseContext';

interface AccessibilityBarProps {
  t: UiStrings;
  language: Language;
  onChangeLanguage: (lang: Language) => void;
  textScale: TextScale;
  onChangeTextScale: (scale: TextScale) => void;
  highContrast: boolean;
  onToggleHighContrast: () => void;
  showBackToHome?: boolean;
  onBackToHome?: () => void;
}

export function AccessibilityBar({
  t,
  language,
  onChangeLanguage,
  textScale,
  onChangeTextScale,
  highContrast,
  onToggleHighContrast,
  showBackToHome = false,
  onBackToHome,
}: AccessibilityBarProps) {
  const { user, profile, authError } = useFirebase();
  const isRtl = language === 'ur';
  const BackArrow = isRtl ? ArrowRight : ArrowLeft;

  const textScaleOptions: { id: TextScale; shortLabel: string; label: string }[] = [
    { id: 'normal', shortLabel: 'A', label: t.controls.textStandard },
    { id: 'large', shortLabel: 'A+', label: t.controls.textLarge },
    { id: 'xlarge', shortLabel: 'A++', label: t.controls.textXLarge },
  ];

  return (
    <div className="bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Left Group: Back to Home (when inside a sub-view) + Language Switcher */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {showBackToHome && onBackToHome && (
              <button
                type="button"
                onClick={onBackToHome}
                className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-semibold hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <BackArrow className="w-4 h-4 text-teal-700 shrink-0" />
                <Home className="w-4 h-4 text-teal-700 shrink-0" />
                <span>{t.controls.backToHome}</span>
              </button>
            )}

            <div className="flex flex-wrap items-center gap-2 max-w-full">
              <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-700">
                <Globe className="w-4 h-4 text-teal-700 shrink-0" />
                <span>{t.controls.languageLabel}</span>
              </span>
              <div
                role="group"
                aria-label={t.controls.languageLabel}
                className="inline-flex flex-wrap items-center p-1 bg-white border border-slate-200 rounded-xl gap-1 max-w-full"
              >
                {(
                  [
                    { id: 'en', label: 'English' },
                    { id: 'ur', label: 'اردو' },
                    { id: 'roman-ur', label: 'Roman Urdu' },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onChangeLanguage(opt.id)}
                    aria-pressed={language === opt.id}
                    className={`min-h-[40px] px-3 sm:px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      language === opt.id
                        ? 'bg-teal-700 text-white'
                        : 'text-slate-700 hover:text-teal-900 hover:bg-slate-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Group: Text Size Options + High Contrast Toggle + Account Status */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto lg:justify-end">
            <div className="flex flex-wrap items-center gap-2 max-w-full">
              <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-700">
                <TypeIcon className="w-4 h-4 text-teal-700 shrink-0" />
                <span>{t.controls.textSizeLabel}</span>
              </span>
              <div
                role="group"
                aria-label={t.controls.textSizeLabel}
                className="inline-flex flex-wrap items-center p-1 bg-white border border-slate-200 rounded-xl gap-1 max-w-full"
              >
                {textScaleOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onChangeTextScale(opt.id)}
                    aria-pressed={textScale === opt.id}
                    className={`min-h-[40px] px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      textScale === opt.id
                        ? 'bg-teal-700 text-white'
                        : 'text-slate-700 hover:text-teal-900 hover:bg-slate-50'
                    }`}
                  >
                    <span className="font-bold me-1">{opt.shortLabel}</span>
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={onToggleHighContrast}
              aria-pressed={highContrast}
              className={`inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-xl border text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                highContrast
                  ? 'bg-teal-700 border-teal-800 text-white'
                  : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100'
              }`}
            >
              <Contrast className={`w-4 h-4 shrink-0 ${highContrast ? 'text-white' : 'text-teal-700'}`} />
              <span>{highContrast ? t.controls.highContrastOn : t.controls.highContrastOff}</span>
            </button>

            <div className="text-xs sm:text-sm text-slate-700 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                {user
                  ? `${t.auth.signedInAs} ${profile?.displayName || user.displayName || 'Learner'}`
                  : t.auth.guestMode}
              </span>
            </div>
          </div>
        </div>

        {authError && (
          <p role="alert" className="text-xs sm:text-sm text-rose-700 font-medium">
            {authError}
          </p>
        )}
      </div>
    </div>
  );
}
