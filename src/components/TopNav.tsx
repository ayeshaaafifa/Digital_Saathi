import {
  MessageSquareHeart,
  Camera,
  BookOpen,
  Users,
  BarChart3,
  LogIn,
  LogOut,
} from 'lucide-react';
import type { NavSection } from '../types';
import type { UiStrings } from '../i18n/translations';
import { useFirebase } from '../context/FirebaseContext';

interface TopNavProps {
  t: UiStrings;
  activeSection: NavSection;
  onSelectSection: (section: NavSection) => void;
}

export function TopNav({ t, activeSection, onSelectSection }: TopNavProps) {
  const { user, signingIn, signIn, signOut } = useFirebase();

  const navItems: { id: NavSection; label: string; icon: typeof MessageSquareHeart }[] = [
    { id: 'chat', label: t.nav.chat, icon: MessageSquareHeart },
    { id: 'screenshot', label: t.nav.screenshot, icon: Camera },
    { id: 'learn', label: t.nav.learn, icon: BookOpen },
    { id: 'volunteers', label: t.nav.volunteers, icon: Users },
    { id: 'impact', label: t.nav.impact, icon: BarChart3 },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 md:h-16 flex items-center justify-between gap-4 md:gap-8">
          {/* Zone 1: Brand Wordmark */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              onSelectSection('home');
            }}
            aria-current={activeSection === 'home' ? 'page' : undefined}
            className="text-lg md:text-xl font-bold tracking-tight text-teal-900 whitespace-nowrap shrink-0"
          >
            {t.brand}
          </a>

          {/* Zone 2: 5 Single-Line Links with Clear Icons */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-3 lg:gap-6 text-sm font-medium text-slate-700 min-w-0"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectSection(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`inline-flex items-center gap-1.5 min-h-[44px] px-1.5 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'border-teal-700 text-teal-900 font-semibold'
                      : 'border-transparent hover:text-teal-800 hover:border-teal-300'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-teal-700' : 'text-slate-600'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Single Primary Action */}
          <div className="flex items-center shrink-0">
            {user ? (
              <button
                type="button"
                onClick={signOut}
                className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 min-h-[40px] md:min-h-[44px] rounded-xl border border-slate-300 bg-white text-slate-900 text-xs sm:text-sm font-semibold hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-teal-700 shrink-0" />
                <span className="truncate max-w-[110px]">{t.auth.signOut}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={signIn}
                disabled={signingIn}
                className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 min-h-[40px] md:min-h-[44px] rounded-xl bg-teal-700 text-white text-xs sm:text-sm font-semibold hover:bg-teal-800 disabled:opacity-60 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <LogIn className="w-4 h-4 shrink-0" />
                <span>{signingIn ? t.auth.signingIn : t.auth.signIn}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Thumb-Zone Navigation (60px height, stays <= 15% aggregate sticky height with 48px header) */}
      <nav
        aria-label="Mobile quick navigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 h-[60px] bg-white/95 backdrop-blur-md border-t border-slate-200 grid grid-cols-5 items-center"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectSection(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`h-full min-h-[44px] flex flex-col items-center justify-center gap-1 px-1 border-t-2 transition-colors cursor-pointer ${
                isActive
                  ? 'border-teal-700 text-teal-900 font-bold bg-teal-50/60'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-teal-700' : ''}`} />
              <span className="text-[11px] leading-none truncate max-w-full">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
