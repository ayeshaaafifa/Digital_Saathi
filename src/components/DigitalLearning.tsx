import { useState } from 'react';
import { CheckCircle2, Circle, Volume2, Square, X, BookOpen, Loader2 } from 'lucide-react';
import type { Language, LessonCategory, TextScale, TutorialLesson } from '../types';
import type { UiStrings } from '../i18n/translations';
import { TUTORIAL_LESSONS } from '../data/lessonsAndVolunteers';
import { useFirebase } from '../context/FirebaseContext';
import { useSpeech } from '../hooks/useSpeech';

interface DigitalLearningProps {
  t: UiStrings;
  language: Language;
  textScale: TextScale;
}

export function DigitalLearning({ t, language, textScale }: DigitalLearningProps) {
  const { completedLessonIds, toggleLessonComplete } = useFirebase();
  const { speakingId, loadingAudioId, speak, stopSpeaking } = useSpeech();

  const [category, setCategory] = useState<LessonCategory>('all');
  const [activeLesson, setActiveLesson] = useState<TutorialLesson | null>(null);
  const [selectedQuizIndex, setSelectedQuizIndex] = useState<number | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const filteredLessons =
    category === 'all'
      ? TUTORIAL_LESSONS
      : TUTORIAL_LESSONS.filter((l) => l.category === category);

  const categories: { id: LessonCategory; label: string }[] = [
    { id: 'all', label: t.learn.categories.all },
    { id: 'smartphone', label: t.learn.categories.smartphone },
    { id: 'messaging', label: t.learn.categories.messaging },
    { id: 'forms', label: t.learn.categories.forms },
    { id: 'safety', label: t.learn.categories.safety },
    { id: 'services', label: t.learn.categories.services },
  ];

  const bodySize =
    textScale === 'xlarge'
      ? 'text-lg sm:text-xl'
      : textScale === 'large'
        ? 'text-base sm:text-lg'
        : 'text-sm sm:text-base';

  const handleOpenLesson = (lesson: TutorialLesson) => {
    stopSpeaking();
    setActiveLesson(lesson);
    setSelectedQuizIndex(null);
    setSaveError(null);
  };

  const handleToggleComplete = async (lessonId: string) => {
    setSavingId(lessonId);
    setSaveError(null);
    try {
      await toggleLessonComplete(lessonId);
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : 'Unable to save lesson progress right now.',
      );
    } finally {
      setSavingId(null);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div className="min-w-0">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">{t.learn.heading}</h2>
          <p className={`text-slate-700 mt-1.5 max-w-3xl ${bodySize}`}>{t.learn.subheading}</p>
        </div>
        <div className="text-sm sm:text-base font-bold text-teal-900 tabular-nums">
          {completedLessonIds.length} / {TUTORIAL_LESSONS.length} {t.learn.completedLabel}
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100 border border-slate-200 rounded-xl mb-6 w-full sm:w-fit max-w-full">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setCategory(cat.id)}
            aria-pressed={category === cat.id}
            className={`min-h-[44px] px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              category === cat.id
                ? 'bg-teal-700 text-white'
                : 'text-slate-700 hover:text-slate-900 hover:bg-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLessons.map((lesson) => {
          const isCompleted = completedLessonIds.includes(lesson.id);
          return (
            <article
              key={lesson.id}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between"
            >
              <div>
                {lesson.image && (
                  <div className="aspect-[4/3] bg-slate-100 overflow-hidden border-b border-slate-100">
                    <img
                      src={lesson.image}
                      alt={lesson.title[language]}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between gap-2 text-xs sm:text-sm text-slate-600">
                    <span>
                      {lesson.level[language]} · {lesson.durationMinutes} min
                    </span>
                    {isCompleted && (
                      <span className="inline-flex items-center gap-1 text-emerald-800 font-bold">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>{t.learn.completedLabel}</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 leading-snug">
                    {lesson.title[language]}
                  </h3>

                  <p className={`text-slate-700 leading-relaxed ${bodySize}`}>
                    {lesson.summary[language]}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-2">
                <button
                  type="button"
                  onClick={() => handleOpenLesson(lesson)}
                  className={`w-full inline-flex items-center justify-center gap-2 min-h-[48px] px-4 py-2.5 rounded-xl text-sm sm:text-base font-semibold transition-colors cursor-pointer ${
                    isCompleted
                      ? 'bg-emerald-50 border border-emerald-300 text-emerald-950 hover:bg-emerald-100'
                      : 'bg-teal-700 text-white hover:bg-teal-800'
                  }`}
                >
                  <BookOpen className="w-4 h-4 shrink-0" />
                  <span>{isCompleted ? t.learn.reviewLesson : t.learn.startLesson}</span>
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* Interactive Lesson Walkthrough Modal */}
      {activeLesson && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="lesson-dialog-title"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
        >
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-7 space-y-6">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="space-y-1 min-w-0">
                <p className="text-xs sm:text-sm text-teal-800 font-semibold">
                  {activeLesson.level[language]} · {activeLesson.durationMinutes} min
                </p>
                <h3 id="lesson-dialog-title" className="text-xl sm:text-2xl font-bold text-slate-900">
                  {activeLesson.title[language]}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  stopSpeaking();
                  setActiveLesson(null);
                }}
                aria-label={t.learn.closeLesson}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {activeLesson.steps.map((step, i) => {
                const speakId = `lesson-${activeLesson.id}-${i}`;
                const isSpeaking = speakingId === speakId;
                const isLoading = loadingAudioId === speakId;

                return (
                  <div
                    key={speakId}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2.5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-8 h-8 rounded-lg bg-teal-700 text-white text-sm font-bold flex items-center justify-center shrink-0 tabular-nums">
                          {i + 1}
                        </span>
                        <h4 className="text-base font-bold text-slate-900 min-w-0 break-words">
                          {step.title[language]}
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          speak(
                            speakId,
                            `${step.title[language]}. ${step.instruction[language]}`,
                            language,
                          )
                        }
                        disabled={isLoading}
                        className="inline-flex items-center gap-1.5 min-h-[44px] px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs sm:text-sm font-semibold text-slate-900 hover:bg-slate-100 cursor-pointer shrink-0"
                      >
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin text-teal-700" />
                        ) : isSpeaking ? (
                          <Square className="w-4 h-4 text-teal-700 fill-teal-700" />
                        ) : (
                          <Volume2 className="w-4 h-4 text-teal-700" />
                        )}
                        <span>
                          {isSpeaking ? t.controls.stopAudio : t.controls.readAloud}
                        </span>
                      </button>
                    </div>
                    <p className={`text-slate-800 leading-relaxed break-words ${bodySize}`}>
                      {step.instruction[language]}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Quick Practice Check */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
              <p className="text-xs font-semibold text-teal-800">{t.learn.quickCheck}</p>
              <p className="text-base font-semibold text-slate-900">
                {activeLesson.quizQuestion[language]}
              </p>
              <div className="space-y-2">
                {activeLesson.quizOptions.map((opt, idx) => {
                  const chosen = selectedQuizIndex === idx;
                  const isCorrect = idx === activeLesson.quizCorrectIndex;
                  return (
                    <button
                      key={`quiz-opt-${idx}`}
                      type="button"
                      onClick={() => setSelectedQuizIndex(idx)}
                      className={`w-full text-start min-h-[44px] px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors cursor-pointer ${
                        chosen
                          ? isCorrect
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-950'
                            : 'border-rose-500 bg-rose-50 text-rose-950'
                          : 'border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      {opt[language]}
                    </button>
                  );
                })}
              </div>
              {selectedQuizIndex !== null && (
                <p
                  className={`text-sm font-medium ${
                    selectedQuizIndex === activeLesson.quizCorrectIndex
                      ? 'text-emerald-800'
                      : 'text-rose-800'
                  }`}
                >
                  {selectedQuizIndex === activeLesson.quizCorrectIndex
                    ? t.learn.correctFeedback
                    : t.learn.tryAgainFeedback}
                </p>
              )}
            </div>

            {saveError && (
              <div
                role="alert"
                className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm font-medium text-rose-900"
              >
                {saveError}
              </div>
            )}

            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleToggleComplete(activeLesson.id)}
                disabled={savingId === activeLesson.id}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[48px] px-5 py-2.5 rounded-xl text-sm sm:text-base font-semibold transition-colors cursor-pointer ${
                  completedLessonIds.includes(activeLesson.id)
                    ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                    : 'bg-teal-700 text-white hover:bg-teal-800'
                }`}
              >
                {completedLessonIds.includes(activeLesson.id) ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 shrink-0" />
                )}
                <span>
                  {completedLessonIds.includes(activeLesson.id)
                    ? t.learn.completedBadge
                    : t.learn.markComplete}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  stopSpeaking();
                  setActiveLesson(null);
                }}
                className="w-full sm:w-auto min-h-[48px] px-5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm sm:text-base font-semibold hover:bg-slate-50 cursor-pointer"
              >
                {t.learn.closeLesson}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
