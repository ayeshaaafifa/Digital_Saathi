export type Language = 'en' | 'ur' | 'roman-ur';

export type TextScale = 'normal' | 'large' | 'xlarge';

export type NavSection = 'home' | 'chat' | 'screenshot' | 'learn' | 'volunteers' | 'impact';

export interface StructuredAiReply {
  summary: string;
  steps: string[];
  safetyTip: string;
  isSafetyWarning?: boolean;
  detectedLanguage?: Language;
  followUps: string[];
  spokenText: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  structured?: StructuredAiReply;
  language: Language;
  createdAt: string;
}

export interface ScreenshotAnalysis {
  title: string;
  detectedError?: string;
  explanation: string;
  riskLevel: 'safe' | 'caution' | 'danger';
  steps: string[];
  doNotDo: string;
  spokenText: string;
}

export type LessonCategory =
  | 'all'
  | 'smartphone'
  | 'messaging'
  | 'forms'
  | 'safety'
  | 'services';

export interface LocalizedText {
  en: string;
  ur: string;
  'roman-ur': string;
}

export interface LessonStep {
  title: LocalizedText;
  instruction: LocalizedText;
}

export interface TutorialLesson {
  id: string;
  category: Exclude<LessonCategory, 'all'>;
  durationMinutes: number;
  level: LocalizedText;
  title: LocalizedText;
  summary: LocalizedText;
  image?: string;
  steps: LessonStep[];
  quizQuestion: LocalizedText;
  quizOptions: LocalizedText[];
  quizCorrectIndex: number;
}

export interface VolunteerProfile {
  id: string;
  name: string;
  city: string;
  languages: string[];
  specialty: LocalizedText;
  availability: LocalizedText;
  bio: LocalizedText;
  image?: string;
  isDemoProfile: true;
}

export interface HelpRequestItem {
  requestId: string;
  userId: string;
  topic: string;
  language: Language;
  description: string;
  volunteerId: string;
  volunteerName: string;
  status: 'submitted' | 'resolved' | 'cancelled';
  createdAtText: string;
}

export interface SavedChatItem {
  entryId: string;
  language: Language;
  question: string;
  summary: string;
  steps: string[];
  createdAtText: string;
}

export interface UserProfileData {
  uid: string;
  displayName: string;
  preferredLanguage: Language;
  completedLessonsCount: number;
  questionsAskedCount: number;
  screenshotsAnalyzedCount: number;
}
