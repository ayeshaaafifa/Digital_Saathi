import React, { useRef, useState } from 'react';
import {
  Upload,
  Camera,
  ScanSearch,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Volume2,
  Square,
  Loader2,
  Lock,
  Trash2,
} from 'lucide-react';
import type { Language, ScreenshotAnalysis, TextScale } from '../types';
import type { UiStrings } from '../i18n/translations';
import { useFirebase } from '../context/FirebaseContext';
import { useSpeech } from '../hooks/useSpeech';

interface ScreenshotHelperProps {
  t: UiStrings;
  language: Language;
  textScale: TextScale;
}

type SampleScenarioKey = 'storage' | 'scam' | 'wifi';

function generateSampleScreenshotDataUrl(scenario: SampleScenarioKey): string {
  const canvas = document.createElement('canvas');
  canvas.width = 720;
  canvas.height = 460;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Simulated phone status bar
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, canvas.width, 44);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText('10:42 AM', 24, 28);
  ctx.fillText('4G   18%', 610, 28);

  // Card container
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 2;
  ctx.fillRect(60, 86, 600, 310);
  ctx.strokeRect(60, 86, 600, 310);

  if (scenario === 'storage') {
    ctx.fillStyle = '#b45309';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText('Storage Space Running Out', 96, 146);
    ctx.fillStyle = '#334155';
    ctx.font = '20px sans-serif';
    ctx.fillText('98% of internal phone storage is full.', 96, 196);
    ctx.fillText('Some system functions and WhatsApp photos', 96, 232);
    ctx.fillText('may not download until you free 1.5 GB.', 96, 268);
    ctx.fillStyle = '#0f766e';
    ctx.fillRect(96, 314, 210, 48);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('Manage Storage', 130, 344);
  } else if (scenario === 'scam') {
    ctx.fillStyle = '#be123c';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('SMS from +92-300-0000192', 96, 142);
    ctx.fillStyle = '#1e293b';
    ctx.font = '20px sans-serif';
    ctx.fillText('CONGRATULATIONS! Your SIM won Rs. 50,000', 96, 194);
    ctx.fillText('cash prize! Send your 6-digit OTP code and', 96, 230);
    ctx.fillText('CNIC photo to claim within 15 minutes:', 96, 266);
    ctx.fillStyle = '#1d4ed8';
    ctx.font = 'underline 20px sans-serif';
    ctx.fillText('http://prize-verify-claim-now.xyz/otp', 96, 314);
  } else {
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText('No Internet Connection', 96, 146);
    ctx.fillStyle = '#334155';
    ctx.font = '20px sans-serif';
    ctx.fillText('Wi-Fi "Home_Network" is Connected without', 96, 196);
    ctx.fillText('internet access. ERR_INTERNET_DISCONNECTED', 96, 232);
    ctx.fillText('Try checking your router or mobile data.', 96, 268);
    ctx.fillStyle = '#0f766e';
    ctx.fillRect(96, 314, 170, 48);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('Try Again', 140, 344);
  }

  return canvas.toDataURL('image/png');
}

export function ScreenshotHelper({ t, language, textScale }: ScreenshotHelperProps) {
  const { recordScreenshotAnalyzed } = useFirebase();
  const { speakingId, loadingAudioId, speak } = useSpeech();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/png');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<ScreenshotAnalysis | null>(null);

  const bodySize =
    textScale === 'xlarge'
      ? 'text-lg sm:text-xl'
      : textScale === 'large'
        ? 'text-base sm:text-lg'
        : 'text-sm sm:text-base';

  const clearSelection = () => {
    setPreviewUrl(null);
    setSelectedFileName(null);
    setAnalysis(null);
    setErrorMsg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileSelected = (file: File | null) => {
    if (!file) return;
    setErrorMsg(null);
    setAnalysis(null);

    const normalizedType = file.type.toLowerCase();
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const isJpeg =
      normalizedType === 'image/jpeg' ||
      normalizedType === 'image/jpg' ||
      (!normalizedType && (ext === 'jpg' || ext === 'jpeg'));
    const isPng = normalizedType === 'image/png' || (!normalizedType && ext === 'png');

    if (!isJpeg && !isPng) {
      setPreviewUrl(null);
      setSelectedFileName(null);
      setErrorMsg(t.screenshot.unsupportedFileError);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    if (file.size === 0) {
      setPreviewUrl(null);
      setSelectedFileName(null);
      setErrorMsg(t.screenshot.readError);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setPreviewUrl(null);
      setSelectedFileName(null);
      setErrorMsg(t.screenshot.fileTooLargeError);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    setMimeType(isPng ? 'image/png' : 'image/jpeg');
    setSelectedFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string' && reader.result.startsWith('data:image/')) {
        setPreviewUrl(reader.result);
      } else {
        setErrorMsg(t.screenshot.readError);
      }
    };
    reader.onerror = () => {
      setErrorMsg(t.screenshot.readError);
    };
    reader.readAsDataURL(file);
  };

  const runAnalysis = async (dataUrlOverride?: string, mimeOverride?: string) => {
    const targetDataUrl = dataUrlOverride || previewUrl;
    const targetMime = mimeOverride || mimeType;
    if (!targetDataUrl) return;

    const base64 = targetDataUrl.split(',')[1] || '';
    if (!base64) {
      setErrorMsg(t.screenshot.readError);
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setAnalysis(null);

    try {
      const res = await fetch('/api/analyze-screenshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64,
          mimeType: targetMime,
          language,
          note: note.trim(),
        }),
      });

      let data: (ScreenshotAnalysis & { error?: string }) | null = null;
      try {
        data = (await res.json()) as ScreenshotAnalysis & { error?: string };
      } catch {
        throw new Error('The server returned an unexpected response. Please try again.');
      }

      if (!res.ok) {
        throw new Error(data?.error || 'Could not analyze screenshot right now.');
      }

      setAnalysis(data);
      recordScreenshotAnalyzed().catch(() => {});
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unable to analyze screenshot.');
    } finally {
      setLoading(false);
    }
  };

  const handleSampleClick = async (scenario: SampleScenarioKey) => {
    const dataUrl = generateSampleScreenshotDataUrl(scenario);
    if (!dataUrl) return;
    setSelectedFileName(`sample-${scenario}.png`);
    setPreviewUrl(dataUrl);
    setMimeType('image/png');
    await runAnalysis(dataUrl, 'image/png');
  };

  const renderRiskBanner = (level: ScreenshotAnalysis['riskLevel']) => {
    if (level === 'danger') {
      return (
        <div className="flex items-center gap-2.5 rounded-xl bg-rose-50 border border-rose-300 px-4 py-3 text-rose-900">
          <ShieldAlert className="w-5 h-5 text-rose-700 shrink-0" />
          <span className="text-sm font-semibold">{t.screenshot.riskLabels.danger}</span>
        </div>
      );
    }
    if (level === 'caution') {
      return (
        <div className="flex items-center gap-2.5 rounded-xl bg-amber-50 border border-amber-300 px-4 py-3 text-amber-950">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
          <span className="text-sm font-semibold">{t.screenshot.riskLabels.caution}</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2.5 rounded-xl bg-emerald-50 border border-emerald-300 px-4 py-3 text-emerald-950">
        <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
        <span className="text-sm font-semibold">{t.screenshot.riskLabels.safe}</span>
      </div>
    );
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">{t.screenshot.heading}</h2>
        <p className={`text-slate-700 mt-1.5 max-w-3xl ${bodySize}`}>
          {t.screenshot.subheading}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Upload & Sample Trigger Column */}
        <div className="lg:col-span-6 min-w-0 bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 space-y-5">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFileSelected(e.dataTransfer.files?.[0] || null);
            }}
            className="border-2 border-dashed border-slate-300 rounded-2xl p-5 sm:p-6 text-center bg-slate-50 space-y-3"
          >
            <Upload className="w-9 h-9 text-teal-700 mx-auto" />
            <p className="text-base font-bold text-slate-900">{t.screenshot.uploadTitle}</p>
            <p className="text-xs sm:text-sm text-slate-700">{t.screenshot.uploadHint}</p>

            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,image/jpeg,image/png"
              className="hidden"
              onChange={(e) => handleFileSelected(e.target.files?.[0] || null)}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[48px] px-5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm sm:text-base font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Camera className="w-5 h-5 text-teal-700 shrink-0" />
              <span>{t.screenshot.chooseFile}</span>
            </button>
          </div>

          {errorMsg && !previewUrl && (
            <div
              role="alert"
              className="flex items-start gap-2.5 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-sm font-medium"
            >
              <AlertTriangle className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
              <span className="min-w-0 break-words">{errorMsg}</span>
            </div>
          )}

          {previewUrl && (
            <div className="space-y-4">
              {selectedFileName && (
                <div className="flex items-center justify-between gap-3 text-xs sm:text-sm text-slate-700">
                  <span className="truncate font-semibold min-w-0">{selectedFileName}</span>
                  <button
                    type="button"
                    onClick={clearSelection}
                    disabled={loading}
                    className="inline-flex items-center gap-1.5 min-h-[44px] px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 font-semibold hover:bg-rose-100 cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-4 h-4 shrink-0" />
                    <span>{t.screenshot.clearButton}</span>
                  </button>
                </div>
              )}

              <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 max-h-72 flex items-center justify-center">
                <img
                  src={previewUrl}
                  alt="Uploaded screenshot preview"
                  className="max-h-72 w-auto object-contain"
                />
              </div>

              <div>
                <label
                  htmlFor="screenshot-note"
                  className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5"
                >
                  {t.screenshot.noteLabel}
                </label>
                <input
                  id="screenshot-note"
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={t.screenshot.notePlaceholder}
                  className={`w-full min-h-[46px] rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-slate-900 placeholder:text-slate-500 focus:border-teal-700 focus:outline-none ${bodySize}`}
                />
              </div>

              <button
                type="button"
                onClick={() => runAnalysis()}
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 min-h-[50px] px-5 py-3 rounded-xl bg-teal-700 text-white text-base font-semibold hover:bg-teal-800 disabled:opacity-60 transition-colors cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin shrink-0" />
                ) : (
                  <ScanSearch className="w-5 h-5 shrink-0" />
                )}
                <span>{loading ? t.screenshot.analyzing : t.screenshot.analyzeButton}</span>
              </button>
            </div>
          )}

          {/* Sample Demo Screens for Live Testing */}
          <div className="pt-4 border-t border-slate-100 space-y-2.5">
            <p className="text-sm font-bold text-slate-900">{t.screenshot.sampleTitle}</p>
            <p className="text-xs sm:text-sm text-slate-700">{t.screenshot.sampleSubtitle}</p>
            <div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-2.5">
              <button
                type="button"
                disabled={loading}
                onClick={() => handleSampleClick('storage')}
                className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-semibold text-slate-900 hover:border-teal-600 hover:bg-teal-50 transition-colors cursor-pointer text-start sm:text-center"
              >
                Sample: Storage Full
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => handleSampleClick('scam')}
                className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-semibold text-slate-900 hover:border-teal-600 hover:bg-teal-50 transition-colors cursor-pointer text-start sm:text-center"
              >
                Sample: Suspicious Prize SMS
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => handleSampleClick('wifi')}
                className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-semibold text-slate-900 hover:border-teal-600 hover:bg-teal-50 transition-colors cursor-pointer text-start sm:text-center"
              >
                Sample: Wi-Fi Disconnected
              </button>
            </div>
          </div>

          <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-3.5">
            <Lock className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
            <span>{t.screenshot.privacyBanner}</span>
          </div>
        </div>

        {/* Analysis Output Column */}
        <div className="lg:col-span-6 min-w-0 bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 space-y-5">
          {loading && (
            <div className="py-12 text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-teal-700 mx-auto" />
              <p className="text-sm font-medium text-slate-700">{t.screenshot.analyzing}</p>
            </div>
          )}

          {errorMsg && previewUrl && (
            <div
              role="alert"
              className="flex items-start gap-2.5 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-sm font-medium"
            >
              <AlertTriangle className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {!loading && !analysis && !errorMsg && (
            <div className="py-10 text-center space-y-3">
              <ShieldCheck className="w-10 h-10 text-teal-700 mx-auto" />
              <p className="text-base font-semibold text-slate-900">
                {t.screenshot.analyzeButton}
              </p>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                {t.screenshot.subheading}
              </p>
            </div>
          )}

          {analysis && !loading && (
            <div className="space-y-5">
              {renderRiskBanner(analysis.riskLevel)}

              <div className="flex flex-wrap items-start justify-between gap-3">
                <h3 className="text-xl font-bold text-slate-900 break-words min-w-0">
                  {analysis.title}
                </h3>
                <button
                  type="button"
                  onClick={() => speak('screenshot-result', analysis.spokenText, language)}
                  disabled={loadingAudioId === 'screenshot-result'}
                  className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-xs sm:text-sm font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  {loadingAudioId === 'screenshot-result' ? (
                    <Loader2 className="w-4 h-4 animate-spin text-teal-700" />
                  ) : speakingId === 'screenshot-result' ? (
                    <Square className="w-4 h-4 text-teal-700 fill-teal-700" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-teal-700" />
                  )}
                  <span>
                    {loadingAudioId === 'screenshot-result'
                      ? t.controls.loadingAudio
                      : speakingId === 'screenshot-result'
                        ? t.controls.stopAudio
                        : t.controls.readAloud}
                  </span>
                </button>
              </div>

              {analysis.detectedError && (
                <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 space-y-1">
                  <p className="text-xs font-semibold text-slate-700">
                    {t.screenshot.detectedErrorLabel}
                  </p>
                  <p className="text-sm font-semibold text-slate-900 break-words">
                    {analysis.detectedError}
                  </p>
                </div>
              )}

              <p className={`text-slate-800 leading-relaxed break-words ${bodySize}`}>
                {analysis.explanation}
              </p>

              <div className="space-y-2.5">
                <p className="text-xs sm:text-sm font-semibold text-slate-700">
                  {t.screenshot.stepsTitle}
                </p>
                <ol className="space-y-2.5">
                  {analysis.steps.map((step, i) => (
                    <li
                      key={`ss-step-${i}`}
                      className="flex items-start gap-3 rounded-xl bg-slate-50 border border-slate-200 p-3.5 sm:p-4"
                    >
                      <span className="w-8 h-8 rounded-lg bg-teal-700 text-white text-sm font-bold flex items-center justify-center shrink-0 tabular-nums">
                        {i + 1}
                      </span>
                      <span className={`text-slate-900 leading-relaxed min-w-0 break-words ${bodySize}`}>
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              {analysis.doNotDo && (
                <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 space-y-1">
                  <p className="text-xs sm:text-sm font-bold text-rose-900">
                    {t.screenshot.doNotDoTitle}
                  </p>
                  <p className="text-sm text-rose-950 leading-relaxed break-words">
                    {analysis.doNotDo}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
