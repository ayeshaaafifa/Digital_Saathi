import { useEffect, useState } from 'react';
import { ShieldCheck, CheckCircle2, Info } from 'lucide-react';
import type { TextScale } from '../types';
import type { UiStrings } from '../i18n/translations';
import { DEMO_PILOT_METRICS } from '../data/lessonsAndVolunteers';
import { useFirebase } from '../context/FirebaseContext';

interface ImpactDashboardProps {
  t: UiStrings;
  textScale: TextScale;
}

export function ImpactDashboard({ t, textScale }: ImpactDashboardProps) {
  const {
    user,
    profile,
    firestoreOnline,
    completedLessonIds,
    helpRequests,
    sessionQuestionsCount,
    sessionScreenshotsCount,
  } = useFirebase();

  const [geminiHealthy, setGeminiHealthy] = useState<boolean | null>(null);

  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json())
      .then((d: { geminiConfigured?: boolean }) => setGeminiHealthy(Boolean(d.geminiConfigured)))
      .catch(() => setGeminiHealthy(false));
  }, []);

  const realQuestions = user
    ? Math.max(profile?.questionsAskedCount || 0, sessionQuestionsCount)
    : sessionQuestionsCount;
  const realScreenshots = user
    ? Math.max(profile?.screenshotsAnalyzedCount || 0, sessionScreenshotsCount)
    : sessionScreenshotsCount;
  const realLessons = completedLessonIds.length;
  const realRequests = helpRequests.length;

  const bodySize =
    textScale === 'xlarge'
      ? 'text-lg sm:text-xl'
      : textScale === 'large'
        ? 'text-base sm:text-lg'
        : 'text-sm sm:text-base';

  const serviceStatusRows = [
    {
      name: 'AI Saathi Chat (Gemini 4 Hydrogen via Node.js)',
      connected: geminiHealthy === true,
      mode: geminiHealthy ? 'Live Server API' : 'Checking / Secret Required',
    },
    {
      name: 'Screenshot Helper (Gemini Vision Multimodal)',
      connected: geminiHealthy === true,
      mode: geminiHealthy ? 'Live Server API' : 'Checking / Secret Required',
    },
    {
      name: 'Read-Aloud Voice (Gemini 3.8 TTS + SpeechSynthesis)',
      connected: geminiHealthy === true,
      mode: geminiHealthy ? 'Live Audio + Browser Fallback' : 'Browser Speech Fallback',
    },
    {
      name: 'Firebase Authentication & Firestore Persistence',
      connected: firestoreOnline,
      mode: user ? 'Connected & Synced' : 'Connected (Sign in to sync)',
    },
    {
      name: 'Volunteer Live Matching Directory',
      connected: false,
      mode: 'Demo Showcase Profiles (Not Live Matching)',
    },
    {
      name: 'Community-Wide Pilot Counters',
      connected: false,
      mode: 'Sample Demo Data Only',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10 space-y-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">{t.impact.heading}</h2>
        <p className={`text-slate-700 mt-1.5 max-w-3xl ${bodySize}`}>{t.impact.subheading}</p>
      </div>

      {/* Real Activity Counters */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 space-y-5">
        <div className="border-b border-slate-100 pb-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-lg font-bold text-slate-900">{t.impact.realSectionTitle}</h3>
            <span className="text-xs sm:text-sm font-semibold text-emerald-800">
              Live Session & Account Data
            </span>
          </div>
          <p className="text-sm text-slate-700 mt-1">{t.impact.realSectionSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: t.impact.questionsLabel, value: realQuestions },
            { label: t.impact.screenshotsLabel, value: realScreenshots },
            { label: t.impact.lessonsLabel, value: realLessons },
            { label: t.impact.requestsLabel, value: realRequests },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-1"
            >
              <p className="text-3xl font-bold text-teal-900 tabular-nums">{stat.value}</p>
              <p className="text-xs sm:text-sm font-semibold text-slate-800">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Clearly Labeled Demo Pilot Showcase Counters */}
      <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-4 sm:p-6 space-y-5">
        <div className="border-b border-amber-200/70 pb-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-lg font-bold text-slate-900">{t.impact.demoSectionTitle}</h3>
            <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-amber-900">
              <Info className="w-4 h-4 shrink-0" />
              <span>Demo Sample Figures</span>
            </span>
          </div>
          <p className="text-sm text-slate-800 mt-1">{t.impact.demoSectionSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Learners Reached (Demo)', value: DEMO_PILOT_METRICS.demoUsersHelped },
            { label: 'Questions Answered (Demo)', value: DEMO_PILOT_METRICS.demoQuestionsAnswered },
            { label: 'Lessons Completed (Demo)', value: DEMO_PILOT_METRICS.demoLessonsCompleted },
            { label: 'Volunteer Sessions (Demo)', value: DEMO_PILOT_METRICS.demoVolunteerMatches },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl bg-white border border-amber-200 p-4 space-y-1"
            >
              <p className="text-3xl font-bold text-slate-900 tabular-nums">{stat.value}</p>
              <p className="text-xs sm:text-sm font-semibold text-slate-700">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Service Transparency & Privacy Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 min-w-0 bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 space-y-4">
          <h3 className="text-lg font-bold text-slate-900">{t.impact.architectureTitle}</h3>
          <div className="divide-y divide-slate-100">
            {serviceStatusRows.map((row) => (
              <div
                key={row.name}
                className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 text-sm"
              >
                <span className="font-semibold text-slate-900 break-words">{row.name}</span>
                <span
                  className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold shrink-0 ${
                    row.connected ? 'text-emerald-800' : 'text-amber-800'
                  }`}
                >
                  {row.connected ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : (
                    <Info className="w-4 h-4 shrink-0" />
                  )}
                  <span>{row.mode}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 min-w-0 bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0" />
            <h3 className="text-lg font-bold text-slate-900">{t.impact.privacyTitle}</h3>
          </div>
          <ul className="space-y-3">
            {t.impact.privacyPoints.map((pt) => (
              <li
                key={pt}
                className={`flex items-start gap-2.5 text-slate-800 leading-relaxed ${bodySize}`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-1" />
                <span className="min-w-0 break-words">{pt}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
