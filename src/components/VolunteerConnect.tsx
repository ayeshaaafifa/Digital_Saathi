import React, { useState } from 'react';
import { Info, CheckCircle2, XCircle, UserCheck, Send, Loader2 } from 'lucide-react';
import type { Language, TextScale } from '../types';
import type { UiStrings } from '../i18n/translations';
import { DEMO_VOLUNTEERS } from '../data/lessonsAndVolunteers';
import { useFirebase } from '../context/FirebaseContext';

interface VolunteerConnectProps {
  t: UiStrings;
  language: Language;
  textScale: TextScale;
}

export function VolunteerConnect({ t, language, textScale }: VolunteerConnectProps) {
  const { helpRequests, submitHelpRequest, changeHelpRequestStatus } = useFirebase();

  const [selectedVolunteerId, setSelectedVolunteerId] = useState(DEMO_VOLUNTEERS[0].id);
  const [topic, setTopic] = useState('Smartphone & WhatsApp Basics');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [updatingRequestId, setUpdatingRequestId] = useState<string | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);

  const selectedVolunteer =
    DEMO_VOLUNTEERS.find((v) => v.id === selectedVolunteerId) || DEMO_VOLUNTEERS[0];

  const bodySize =
    textScale === 'xlarge'
      ? 'text-lg sm:text-xl'
      : textScale === 'large'
        ? 'text-base sm:text-lg'
        : 'text-sm sm:text-base';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanDesc = description.trim();
    if (!cleanDesc || submitting) return;

    setSubmitting(true);
    setErrorMsg(null);
    setSubmitSuccess(false);

    try {
      await submitHelpRequest({
        topic,
        language,
        description: cleanDesc,
        volunteerId: selectedVolunteer.id,
        volunteerName: selectedVolunteer.name,
      });
      setDescription('');
      setSubmitSuccess(true);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unable to save help request.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (
    requestId: string,
    status: 'resolved' | 'cancelled',
  ) => {
    setRequestError(null);
    setUpdatingRequestId(requestId);
    try {
      await changeHelpRequestStatus(requestId, status);
    } catch (err) {
      setRequestError(
        err instanceof Error ? err.message : 'Unable to update request status right now.',
      );
    } finally {
      setUpdatingRequestId(null);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10 space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">{t.volunteers.heading}</h2>
        <p className={`text-slate-700 mt-1.5 max-w-3xl ${bodySize}`}>
          {t.volunteers.subheading}
        </p>
      </div>

      {/* Explicit Demo Notice */}
      <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 sm:p-5 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
        <div className="space-y-1 min-w-0">
          <p className="text-sm font-bold text-amber-950">{t.volunteers.demoBannerTitle}</p>
          <p className="text-sm text-amber-900 leading-relaxed">{t.volunteers.demoBannerBody}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Demo Volunteer Directory */}
        <div className="lg:col-span-7 min-w-0 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {DEMO_VOLUNTEERS.map((vol) => {
            const isSelected = vol.id === selectedVolunteerId;
            return (
              <article
                key={vol.id}
                className={`rounded-2xl border p-5 flex flex-col justify-between space-y-4 transition-colors ${
                  isSelected
                    ? 'bg-teal-50/60 border-teal-700'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    {vol.image ? (
                      <img
                        src={vol.image}
                        alt={vol.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-teal-700 text-white font-semibold flex items-center justify-center shrink-0">
                        {vol.name
                          .split(' ')
                          .map((p) => p[0])
                          .join('')}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-amber-800">
                        {t.volunteers.demoProfileLabel}
                      </p>
                      <h3 className="text-base font-bold text-slate-900 truncate">{vol.name}</h3>
                      <p className="text-xs sm:text-sm text-slate-600 truncate">{vol.city}</p>
                    </div>
                  </div>

                  <p className="text-sm font-bold text-teal-900">{vol.specialty[language]}</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{vol.bio[language]}</p>

                  <div className="text-xs sm:text-sm text-slate-600 space-y-1">
                    <p>
                      <span className="font-semibold text-slate-800">
                        {t.volunteers.speaksLabel}:{' '}
                      </span>
                      {vol.languages.join(' · ')}
                    </p>
                    <p>{vol.availability[language]}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedVolunteerId(vol.id)}
                  aria-pressed={isSelected}
                  className={`w-full inline-flex items-center justify-center gap-2 min-h-[48px] px-4 py-2.5 rounded-xl text-sm sm:text-base font-semibold transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-teal-700 text-white'
                      : 'bg-slate-50 border border-slate-300 text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <UserCheck className="w-4 h-4 shrink-0" />
                  <span>
                    {isSelected
                      ? t.volunteers.selectedVolunteer
                      : t.volunteers.selectVolunteer}
                  </span>
                </button>
              </article>
            );
          })}
        </div>

        {/* Help Request Form & User's Logged Requests */}
        <div className="lg:col-span-5 min-w-0 space-y-6">
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 space-y-4"
          >
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">{t.volunteers.formTitle}</h3>
              <p className="text-xs sm:text-sm text-teal-800 mt-0.5 break-words">
                {t.volunteers.selectedVolunteer}: {selectedVolunteer.name} ({t.volunteers.demoProfileLabel})
              </p>
            </div>

            <div>
              <label
                htmlFor="help-topic"
                className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5"
              >
                {t.volunteers.topicLabel}
              </label>
              <select
                id="help-topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className={`w-full min-h-[48px] rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-slate-900 focus:border-teal-700 focus:outline-none ${bodySize}`}
              >
                <option value="Smartphone & WhatsApp Basics">Smartphone & WhatsApp Basics</option>
                <option value="Email & Online Forms">Email & Online Forms</option>
                <option value="Scam / Suspicious SMS Check">Scam / Suspicious SMS Check</option>
                <option value="Utility Bills & Digital Services">Utility Bills & Digital Services</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="help-description"
                className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5"
              >
                {t.volunteers.descriptionLabel}
              </label>
              <textarea
                id="help-description"
                rows={4}
                maxLength={600}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t.volunteers.descriptionPlaceholder}
                className={`w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 placeholder:text-slate-500 focus:border-teal-700 focus:outline-none ${bodySize}`}
              />
            </div>

            {errorMsg && (
              <p role="alert" className="text-xs sm:text-sm text-rose-700 font-medium">
                {errorMsg}
              </p>
            )}

            {submitSuccess && (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-emerald-950">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{t.volunteers.statusLabels.submitted}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || !description.trim()}
              className="w-full inline-flex items-center justify-center gap-2 min-h-[50px] px-5 py-3 rounded-xl bg-teal-700 text-white text-base font-semibold hover:bg-teal-800 disabled:opacity-50 transition-colors cursor-pointer"
            >
              {submitting ? (
                <Loader2 className="w-5 h-5 animate-spin shrink-0" />
              ) : (
                <Send className="w-4 h-4 shrink-0" />
              )}
              <span>{submitting ? t.volunteers.submitting : t.volunteers.submitButton}</span>
            </button>
          </form>

          {/* Saved Help Requests List */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="text-base font-bold text-slate-900">
                {t.volunteers.myRequestsTitle}
              </h3>
              <span className="text-xs font-semibold text-slate-600 tabular-nums">
                {helpRequests.length}
              </span>
            </div>

            {requestError && (
              <p role="alert" className="text-xs sm:text-sm text-rose-700 font-medium">
                {requestError}
              </p>
            )}

            {helpRequests.length === 0 ? (
              <p className="text-sm text-slate-600">{t.volunteers.noRequestsYet}</p>
            ) : (
              <div className="space-y-3">
                {helpRequests.map((req) => (
                  <div
                    key={req.requestId}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 space-y-2.5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
                      <span className="font-bold text-slate-900">{req.topic}</span>
                      <span
                        className={`font-semibold ${
                          req.status === 'resolved'
                            ? 'text-emerald-800'
                            : req.status === 'cancelled'
                              ? 'text-slate-600'
                              : 'text-teal-800'
                        }`}
                      >
                        {t.volunteers.statusLabels[req.status]}
                      </span>
                    </div>
                    <p className="text-sm text-slate-800 leading-relaxed break-words">
                      {req.description}
                    </p>
                    <p className="text-xs text-slate-600">
                      {req.volunteerName} · {req.createdAtText}
                    </p>

                    {req.status === 'submitted' && (
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <button
                          type="button"
                          disabled={updatingRequestId === req.requestId}
                          onClick={() => handleStatusChange(req.requestId, 'resolved')}
                          className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs sm:text-sm font-semibold hover:bg-emerald-800 disabled:opacity-50 cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span>{t.volunteers.markResolved}</span>
                        </button>
                        <button
                          type="button"
                          disabled={updatingRequestId === req.requestId}
                          onClick={() => handleStatusChange(req.requestId, 'cancelled')}
                          className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs sm:text-sm font-semibold hover:bg-slate-100 disabled:opacity-50 cursor-pointer"
                        >
                          <XCircle className="w-4 h-4 shrink-0" />
                          <span>{t.volunteers.cancelRequest}</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
