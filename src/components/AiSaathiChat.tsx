import { useState } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  Square,
  Bookmark,
  BookmarkCheck,
  ShieldAlert,
  Trash2,
  Loader2,
} from 'lucide-react';
import type { ChatMessage, Language, StructuredAiReply, TextScale } from '../types';
import { TRANSLATIONS, type UiStrings } from '../i18n/translations';
import { useFirebase } from '../context/FirebaseContext';
import { useSpeech } from '../hooks/useSpeech';

interface AiSaathiChatProps {
  t: UiStrings;
  language: Language;
  textScale: TextScale;
}

export function AiSaathiChat({ t, language, textScale }: AiSaathiChatProps) {
  const { savedChats, saveChatGuide, removeSavedGuide, recordQuestionAsked } = useFirebase();
  const {
    isRecognitionSupported,
    isListening,
    speechError,
    speakingId,
    loadingAudioId,
    startListening,
    speak,
  } = useSpeech();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [savedEntryIds, setSavedEntryIds] = useState<Record<string, boolean>>({});

  const askSaathi = async (questionText: string) => {
    const trimmed = questionText.trim();
    if (!trimmed || loading) return;

    setErrorMsg(null);
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
      language,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInputText('');
    setLoading(true);

    try {
      const historyPayload = nextMessages.slice(-6).map((m) => ({
        role: m.role,
        text: m.structured ? m.structured.summary : m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          language,
          history: historyPayload.slice(0, -1),
        }),
      });

      const data = (await res.json()) as StructuredAiReply & { error?: string };
      if (!res.ok) {
        throw new Error(data.error || 'Unable to get a response right now.');
      }

      const assistantMsg: ChatMessage = {
        id: `saathi-${Date.now()}`,
        role: 'assistant',
        text: data.summary,
        structured: {
          summary: data.summary,
          steps: data.steps || [],
          safetyTip: data.safetyTip || '',
          isSafetyWarning: Boolean(data.isSafetyWarning),
          detectedLanguage: data.detectedLanguage || language,
          followUps: data.followUps || [],
          spokenText: data.spokenText || data.summary,
        },
        language: data.detectedLanguage || language,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      recordQuestionAsked().catch(() => {});
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Network error. Please try again.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGuide = async (msg: ChatMessage, questionAsked: string) => {
    if (!msg.structured) return;
    setErrorMsg(null);
    try {
      await saveChatGuide({
        entryId: msg.id,
        language: msg.language,
        question: questionAsked,
        summary: msg.structured.summary,
        steps: msg.structured.steps,
      });
      setSavedEntryIds((prev) => ({ ...prev, [msg.id]: true }));
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Unable to save this guide right now.',
      );
    }
  };

  const handleRemoveGuide = async (entryId: string) => {
    setErrorMsg(null);
    try {
      await removeSavedGuide(entryId);
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Unable to remove this saved guide right now.',
      );
    }
  };

  const bodySize =
    textScale === 'xlarge'
      ? 'text-lg sm:text-xl'
      : textScale === 'large'
        ? 'text-base sm:text-lg'
        : 'text-sm sm:text-base';

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">{t.chat.heading}</h2>
        <p className={`text-slate-700 mt-1.5 max-w-3xl ${bodySize}`}>{t.chat.subheading}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Chat Workspace */}
        <div className="lg:col-span-8 min-w-0 bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 space-y-6">
          {/* Quick Start Prompts */}
          <div>
            <p className="text-xs sm:text-sm font-semibold text-slate-700 mb-3">
              {t.chat.quickPromptsTitle}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {t.chat.quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => askSaathi(prompt)}
                  disabled={loading}
                  className="text-start min-h-[44px] px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm font-medium hover:border-teal-600 hover:bg-teal-50/60 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Conversation Feed */}
          {messages.length > 0 && (
            <div className="space-y-5 pt-4 border-t border-slate-100">
              {messages.map((msg, idx) => {
                if (msg.role === 'user') {
                  const userIsUrdu = /[\u0600-\u06FF]/.test(msg.text);
                  return (
                    <div key={msg.id} className="flex justify-end">
                      <div
                        dir={userIsUrdu ? 'rtl' : 'ltr'}
                        className="max-w-xl bg-teal-700 text-white rounded-2xl px-4 py-3 space-y-1"
                      >
                        <p className={bodySize}>{msg.text}</p>
                        <p className="text-[11px] text-teal-100 tabular-nums">{msg.createdAt}</p>
                      </div>
                    </div>
                  );
                }

                const prevQuestion =
                  idx > 0 && messages[idx - 1].role === 'user' ? messages[idx - 1].text : msg.text;
                const isSpeaking = speakingId === msg.id;
                const isLoadingAudio = loadingAudioId === msg.id;
                const isSaved =
                  Boolean(savedEntryIds[msg.id]) || savedChats.some((s) => s.entryId === msg.id);
                const replyIsRtl = msg.language === 'ur';
                const isSafetyWarning = Boolean(msg.structured?.isSafetyWarning);
                const replyT = TRANSLATIONS[msg.language]?.chat || t.chat;

                return (
                  <div
                    key={msg.id}
                    dir={replyIsRtl ? 'rtl' : 'ltr'}
                    className={`rounded-2xl p-4 sm:p-5 space-y-4 border ${
                      isSafetyWarning
                        ? 'bg-rose-50/40 border-rose-300'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="text-xs font-semibold text-teal-800">
                        {t.brand} · {msg.createdAt}
                      </span>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            speak(
                              msg.id,
                              msg.structured?.spokenText || msg.text,
                              msg.language,
                            )
                          }
                          disabled={isLoadingAudio}
                          className="inline-flex items-center gap-2 min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs sm:text-sm font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          {isLoadingAudio ? (
                            <Loader2 className="w-4 h-4 animate-spin text-teal-700" />
                          ) : isSpeaking ? (
                            <Square className="w-4 h-4 text-teal-700 fill-teal-700" />
                          ) : (
                            <Volume2 className="w-4 h-4 text-teal-700" />
                          )}
                          <span>
                            {isLoadingAudio
                              ? t.controls.loadingAudio
                              : isSpeaking
                                ? t.controls.stopAudio
                                : t.controls.readAloud}
                          </span>
                        </button>

                        {msg.structured && (
                          <button
                            type="button"
                            onClick={() => handleSaveGuide(msg, prevQuestion)}
                            disabled={isSaved}
                            className={`inline-flex items-center gap-2 min-h-[44px] px-3.5 py-2 rounded-xl border text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                              isSaved
                                ? 'border-emerald-400 bg-emerald-50 text-emerald-950'
                                : 'border-slate-300 bg-white text-slate-900 hover:bg-slate-100'
                            }`}
                          >
                            {isSaved ? (
                              <BookmarkCheck className="w-4 h-4 text-emerald-700" />
                            ) : (
                              <Bookmark className="w-4 h-4 text-teal-700" />
                            )}
                            <span>{isSaved ? t.chat.savedGuide : t.chat.saveGuide}</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {isSafetyWarning && (
                      <div
                        role="alert"
                        className="flex items-start gap-3 rounded-xl bg-rose-100/80 border border-rose-300 p-3.5 text-rose-950"
                      >
                        <ShieldAlert className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
                        <div className="space-y-0.5 min-w-0">
                          <p className="text-sm font-bold">{replyT.credentialWarningTitle}</p>
                          <p className="text-xs sm:text-sm text-rose-900">
                            {replyT.credentialWarningSubtitle}
                          </p>
                        </div>
                      </div>
                    )}

                    <p className={`text-slate-900 font-medium leading-relaxed break-words ${bodySize}`}>
                      {msg.structured?.summary || msg.text}
                    </p>

                    {msg.structured && msg.structured.steps.length > 0 && (
                      <div className="space-y-2.5 pt-2">
                        <p className="text-xs sm:text-sm font-semibold text-slate-700">
                          {replyT.stepsHeading}
                        </p>
                        <ol className="space-y-2.5">
                          {msg.structured.steps.map((step, stepIdx) => (
                            <li
                              key={`${msg.id}-step-${stepIdx}`}
                              className="flex items-start gap-3 bg-white border border-slate-200 rounded-xl p-3.5 sm:p-4"
                            >
                              <span className="w-8 h-8 rounded-lg bg-teal-700 text-white text-sm font-bold flex items-center justify-center shrink-0 tabular-nums">
                                {stepIdx + 1}
                              </span>
                              <span
                                className={`text-slate-900 leading-relaxed min-w-0 break-words ${bodySize}`}
                              >
                                {step}
                              </span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {msg.structured?.safetyTip && (
                      <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl p-3.5">
                        <ShieldAlert className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
                        <div className="text-sm text-amber-950">
                          <span className="font-semibold">{replyT.safetyTipHeading}: </span>
                          <span>{msg.structured.safetyTip}</span>
                        </div>
                      </div>
                    )}

                    {msg.structured && msg.structured.followUps.length > 0 && (
                      <div className="pt-2">
                        <p className="text-xs font-medium text-slate-500 mb-2">
                          {t.chat.followUpsHeading}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {msg.structured.followUps.map((fup) => (
                            <button
                              key={fup}
                              type="button"
                              onClick={() => askSaathi(fup)}
                              disabled={loading}
                              className="min-h-[40px] px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-teal-900 font-medium hover:border-teal-600 hover:bg-teal-50 transition-colors text-start cursor-pointer"
                            >
                              {fup}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {loading && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-900">
              <Loader2 className="w-5 h-5 animate-spin text-teal-700 shrink-0" />
              <span className="text-sm font-medium">{t.chat.thinking}</span>
            </div>
          )}

          {errorMsg && (
            <div
              role="alert"
              className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-sm font-medium"
            >
              {errorMsg}
            </div>
          )}

          {/* Input & Voice Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              askSaathi(inputText);
            }}
            className="space-y-3 pt-2 border-t border-slate-100"
          >
            <label htmlFor="saathi-question-input" className="sr-only">
              {t.chat.inputPlaceholder}
            </label>
            <textarea
              id="saathi-question-input"
              rows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t.chat.inputPlaceholder}
              className={`w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-teal-700 focus:outline-none ${bodySize}`}
            />

            {!isRecognitionSupported && (
              <p className="text-xs text-slate-500">{t.chat.micUnsupported}</p>
            )}
            {speechError && (
              <p role="alert" className="text-xs text-rose-700 font-medium">
                {speechError}
              </p>
            )}

            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-between gap-3">
              <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5">
                {isRecognitionSupported && (
                  <button
                    type="button"
                    onClick={() => startListening(language, (text) => setInputText(text))}
                    className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[48px] px-5 py-2.5 rounded-xl border text-sm sm:text-base font-semibold transition-colors cursor-pointer ${
                      isListening
                        ? 'border-rose-500 bg-rose-50 text-rose-950'
                        : 'border-slate-300 bg-white text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {isListening ? (
                      <MicOff className="w-5 h-5 text-rose-700 shrink-0" />
                    ) : (
                      <Mic className="w-5 h-5 text-teal-700 shrink-0" />
                    )}
                    <span>{isListening ? t.chat.micListening : t.chat.micStart}</span>
                  </button>
                )}

                <span className="text-xs sm:text-sm text-slate-700">{t.chat.privacyNote}</span>
              </div>

              <button
                type="submit"
                disabled={loading || !inputText.trim()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-2.5 rounded-xl bg-teal-700 text-white text-base font-semibold hover:bg-teal-800 disabled:opacity-50 transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4 shrink-0" />
                <span>{t.chat.sendButton}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Saved Guides Sidebar */}
        <aside className="lg:col-span-4 min-w-0 bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">{t.chat.savedPanelTitle}</h3>
            <span className="text-xs font-semibold text-slate-600 tabular-nums">{savedChats.length}</span>
          </div>

          {savedChats.length === 0 ? (
            <p className="text-sm text-slate-600 leading-relaxed">{t.chat.noSavedYet}</p>
          ) : (
            <div className="space-y-3">
              {savedChats.map((item) => (
                <div
                  key={item.entryId}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900 leading-snug break-words min-w-0">
                      {item.question}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleRemoveGuide(item.entryId)}
                      aria-label="Remove saved guide"
                      className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-slate-600 hover:text-rose-700 hover:bg-white transition-colors cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.summary}</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-500">{item.createdAtText}</span>
                    <button
                      type="button"
                      onClick={() =>
                        speak(
                          `saved-${item.entryId}`,
                          `${item.summary} ${item.steps.join('. ')}`,
                          item.language,
                        )
                      }
                      className="inline-flex items-center gap-1 text-xs font-medium text-teal-800 hover:underline cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>
                        {speakingId === `saved-${item.entryId}`
                          ? t.controls.stopAudio
                          : t.controls.readAloud}
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
