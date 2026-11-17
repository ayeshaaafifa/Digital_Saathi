import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { collection, doc, onSnapshot, query, where } from 'firebase/firestore';
import {
  auth,
  db,
  testConnection,
  signInWithGoogle,
  signOutUser,
  ensureUserProfile,
  updateUserCounts,
  saveLessonProgressDoc,
  saveChatEntryDoc,
  deleteChatEntryDoc,
  createHelpRequestDoc,
  updateHelpRequestStatusDoc,
  handleFirestoreError,
  OperationType,
} from '../lib/firebase';
import type { HelpRequestItem, Language, SavedChatItem, UserProfileData } from '../types';

interface FirebaseContextValue {
  user: User | null;
  authReady: boolean;
  firestoreOnline: boolean;
  signingIn: boolean;
  authError: string | null;
  profile: UserProfileData | null;
  completedLessonIds: string[];
  savedChats: SavedChatItem[];
  helpRequests: HelpRequestItem[];
  sessionQuestionsCount: number;
  sessionScreenshotsCount: number;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  setLanguagePreference: (lang: Language) => Promise<void>;
  recordQuestionAsked: () => Promise<void>;
  recordScreenshotAnalyzed: () => Promise<void>;
  toggleLessonComplete: (lessonId: string) => Promise<void>;
  saveChatGuide: (item: {
    entryId: string;
    language: Language;
    question: string;
    summary: string;
    steps: string[];
  }) => Promise<void>;
  removeSavedGuide: (entryId: string) => Promise<void>;
  submitHelpRequest: (input: {
    topic: string;
    language: Language;
    description: string;
    volunteerId: string;
    volunteerName: string;
  }) => Promise<void>;
  changeHelpRequestStatus: (requestId: string, status: 'resolved' | 'cancelled') => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextValue | null>(null);

const LOCAL_LESSONS_KEY = 'digital_saathi_guest_lessons';
const LOCAL_CHATS_KEY = 'digital_saathi_guest_chats';
const LOCAL_REQUESTS_KEY = 'digital_saathi_guest_requests';
const LOCAL_METRICS_KEY = 'digital_saathi_guest_metrics';

export function FirebaseProvider({
  children,
  currentLanguage,
}: {
  children: React.ReactNode;
  currentLanguage: Language;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [firestoreOnline, setFirestoreOnline] = useState(true);
  const [signingIn, setSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(LOCAL_LESSONS_KEY);
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  });
  const [savedChats, setSavedChats] = useState<SavedChatItem[]>(() => {
    try {
      const raw = localStorage.getItem(LOCAL_CHATS_KEY);
      return raw ? (JSON.parse(raw) as SavedChatItem[]) : [];
    } catch {
      return [];
    }
  });
  const [helpRequests, setHelpRequests] = useState<HelpRequestItem[]>(() => {
    try {
      const raw = localStorage.getItem(LOCAL_REQUESTS_KEY);
      return raw ? (JSON.parse(raw) as HelpRequestItem[]) : [];
    } catch {
      return [];
    }
  });
  const [sessionQuestionsCount, setSessionQuestionsCount] = useState<number>(() => {
    try {
      const raw = localStorage.getItem(LOCAL_METRICS_KEY);
      const parsed = raw ? (JSON.parse(raw) as { q?: number }) : {};
      return parsed.q || 0;
    } catch {
      return 0;
    }
  });
  const [sessionScreenshotsCount, setSessionScreenshotsCount] = useState<number>(() => {
    try {
      const raw = localStorage.getItem(LOCAL_METRICS_KEY);
      const parsed = raw ? (JSON.parse(raw) as { s?: number }) : {};
      return parsed.s || 0;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    testConnection().then((ok) => setFirestoreOnline(ok));
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      setAuthReady(true);
      if (nextUser) {
        try {
          await ensureUserProfile(
            nextUser.uid,
            nextUser.displayName || 'Community Learner',
            currentLanguage,
          );
        } catch (err) {
          console.error('Failed to ensure user profile:', err);
        }
      } else {
        setProfile(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!authReady || !user) return;

    const userDocPath = `users/${user.uid}`;
    const unsubProfile = onSnapshot(
      doc(db, 'users', user.uid),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setProfile({
            uid: String(data.uid || user.uid),
            displayName: String(data.displayName || user.displayName || 'Learner'),
            preferredLanguage: (data.preferredLanguage as Language) || 'en',
            completedLessonsCount: Number(data.completedLessonsCount || 0),
            questionsAskedCount: Number(data.questionsAskedCount || 0),
            screenshotsAnalyzedCount: Number(data.screenshotsAnalyzedCount || 0),
          });
        }
      },
      (err) => {
        handleFirestoreError(err, OperationType.GET, userDocPath);
      },
    );

    const lessonsPath = `users/${user.uid}/lessonProgress`;
    const unsubLessons = onSnapshot(
      query(collection(db, 'users', user.uid, 'lessonProgress'), where('userId', '==', user.uid)),
      (snap) => {
        const ids: string[] = [];
        snap.forEach((d) => {
          const data = d.data();
          if (data.completed === true) {
            ids.push(String(data.lessonId || d.id));
          }
        });
        setCompletedLessonIds(ids);
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, lessonsPath);
      },
    );

    const chatsPath = `users/${user.uid}/chatHistory`;
    const unsubChats = onSnapshot(
      query(collection(db, 'users', user.uid, 'chatHistory'), where('userId', '==', user.uid)),
      (snap) => {
        const items: (SavedChatItem & { sortMs: number })[] = [];
        snap.forEach((d) => {
          const data = d.data();
          const sortMs = data.createdAt?.toMillis ? data.createdAt.toMillis() : Date.now();
          items.push({
            entryId: String(data.entryId || d.id),
            language: (data.language as Language) || 'en',
            question: String(data.question || ''),
            summary: String(data.summary || ''),
            steps: Array.isArray(data.steps) ? data.steps.map(String) : [],
            createdAtText: data.createdAt?.toDate
              ? data.createdAt.toDate().toLocaleDateString()
              : 'Saved',
            sortMs,
          });
        });
        items.sort((a, b) => b.sortMs - a.sortMs);
        setSavedChats(items.map(({ sortMs: _sortMs, ...rest }) => rest));
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, chatsPath);
      },
    );

    const reqPath = `users/${user.uid}/helpRequests`;
    const unsubReqs = onSnapshot(
      query(collection(db, 'users', user.uid, 'helpRequests'), where('userId', '==', user.uid)),
      (snap) => {
        const items: (HelpRequestItem & { sortMs: number })[] = [];
        snap.forEach((d) => {
          const data = d.data();
          const sortMs = data.createdAt?.toMillis ? data.createdAt.toMillis() : Date.now();
          items.push({
            requestId: String(data.requestId || d.id),
            userId: String(data.userId || user.uid),
            topic: String(data.topic || ''),
            language: (data.language as Language) || 'en',
            description: String(data.description || ''),
            volunteerId: String(data.volunteerId || ''),
            volunteerName: String(data.volunteerName || ''),
            status: (data.status as HelpRequestItem['status']) || 'submitted',
            createdAtText: data.createdAt?.toDate
              ? data.createdAt.toDate().toLocaleDateString()
              : 'Just now',
            sortMs,
          });
        });
        items.sort((a, b) => b.sortMs - a.sortMs);
        setHelpRequests(items.map(({ sortMs: _sortMs, ...rest }) => rest));
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, reqPath);
      },
    );

    return () => {
      unsubProfile();
      unsubLessons();
      unsubChats();
      unsubReqs();
    };
  }, [authReady, user]);

  const signIn = useCallback(async () => {
    setSigningIn(true);
    setAuthError(null);
    try {
      await signInWithGoogle();
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unable to sign in right now.';
      if (!msg.includes('popup-closed-by-user')) {
        setAuthError('Sign-in could not be completed. Please allow popups and try again.');
      }
    } finally {
      setSigningIn(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    await signOutUser();
    try {
      const rawLessons = localStorage.getItem(LOCAL_LESSONS_KEY);
      setCompletedLessonIds(rawLessons ? (JSON.parse(rawLessons) as string[]) : []);
      const rawChats = localStorage.getItem(LOCAL_CHATS_KEY);
      setSavedChats(rawChats ? (JSON.parse(rawChats) as SavedChatItem[]) : []);
      const rawReqs = localStorage.getItem(LOCAL_REQUESTS_KEY);
      setHelpRequests(rawReqs ? (JSON.parse(rawReqs) as HelpRequestItem[]) : []);
    } catch {
      setCompletedLessonIds([]);
      setSavedChats([]);
      setHelpRequests([]);
    }
  }, []);

  const setLanguagePreference = useCallback(
    async (lang: Language) => {
      if (user && profile) {
        await updateUserCounts(user.uid, { preferredLanguage: lang });
      }
    },
    [user, profile],
  );

  const recordQuestionAsked = useCallback(async () => {
    setSessionQuestionsCount((prev) => {
      const next = prev + 1;
      try {
        const raw = localStorage.getItem(LOCAL_METRICS_KEY);
        const existing = raw ? (JSON.parse(raw) as { q?: number; s?: number }) : {};
        localStorage.setItem(
          LOCAL_METRICS_KEY,
          JSON.stringify({ q: next, s: existing.s ?? sessionScreenshotsCount }),
        );
      } catch {
        // ignore storage quota
      }
      return next;
    });
    if (user && profile) {
      await updateUserCounts(user.uid, {
        questionsAskedCount: profile.questionsAskedCount + 1,
      });
    }
  }, [user, profile, sessionScreenshotsCount]);

  const recordScreenshotAnalyzed = useCallback(async () => {
    setSessionScreenshotsCount((prev) => {
      const next = prev + 1;
      try {
        const raw = localStorage.getItem(LOCAL_METRICS_KEY);
        const existing = raw ? (JSON.parse(raw) as { q?: number; s?: number }) : {};
        localStorage.setItem(
          LOCAL_METRICS_KEY,
          JSON.stringify({ q: existing.q ?? sessionQuestionsCount, s: next }),
        );
      } catch {
        // ignore storage quota
      }
      return next;
    });
    if (user && profile) {
      await updateUserCounts(user.uid, {
        screenshotsAnalyzedCount: profile.screenshotsAnalyzedCount + 1,
      });
    }
  }, [user, profile, sessionQuestionsCount]);

  const toggleLessonComplete = useCallback(
    async (lessonId: string) => {
      const isCurrentlyCompleted = completedLessonIds.includes(lessonId);
      const nextCompleted = !isCurrentlyCompleted;

      if (user) {
        await saveLessonProgressDoc(user.uid, lessonId, nextCompleted);
        const nextCount = nextCompleted
          ? completedLessonIds.length + 1
          : Math.max(0, completedLessonIds.length - 1);
        await updateUserCounts(user.uid, { completedLessonsCount: nextCount });
      } else {
        setCompletedLessonIds((prev) => {
          const updated = nextCompleted
            ? Array.from(new Set([...prev, lessonId]))
            : prev.filter((id) => id !== lessonId);
          try {
            localStorage.setItem(LOCAL_LESSONS_KEY, JSON.stringify(updated));
          } catch {
            // ignore
          }
          return updated;
        });
      }
    },
    [user, completedLessonIds],
  );

  const saveChatGuide = useCallback(
    async (item: {
      entryId: string;
      language: Language;
      question: string;
      summary: string;
      steps: string[];
    }) => {
      if (user) {
        await saveChatEntryDoc(user.uid, item.entryId, item);
      } else {
        setSavedChats((prev) => {
          const next: SavedChatItem[] = [
            {
              entryId: item.entryId,
              language: item.language,
              question: item.question,
              summary: item.summary,
              steps: item.steps,
              createdAtText: 'This session',
            },
            ...prev.filter((c) => c.entryId !== item.entryId),
          ].slice(0, 20);
          try {
            localStorage.setItem(LOCAL_CHATS_KEY, JSON.stringify(next));
          } catch {
            // ignore
          }
          return next;
        });
      }
    },
    [user],
  );

  const removeSavedGuide = useCallback(
    async (entryId: string) => {
      if (user) {
        await deleteChatEntryDoc(user.uid, entryId);
      } else {
        setSavedChats((prev) => {
          const next = prev.filter((c) => c.entryId !== entryId);
          try {
            localStorage.setItem(LOCAL_CHATS_KEY, JSON.stringify(next));
          } catch {
            // ignore
          }
          return next;
        });
      }
    },
    [user],
  );

  const submitHelpRequest = useCallback(
    async (input: {
      topic: string;
      language: Language;
      description: string;
      volunteerId: string;
      volunteerName: string;
    }) => {
      const requestId = `req-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      if (user) {
        await createHelpRequestDoc(user.uid, requestId, input);
      } else {
        setHelpRequests((prev) => {
          const next: HelpRequestItem[] = [
            {
              requestId,
              userId: 'guest',
              topic: input.topic,
              language: input.language,
              description: input.description,
              volunteerId: input.volunteerId,
              volunteerName: input.volunteerName,
              status: 'submitted',
              createdAtText: 'This session',
            },
            ...prev,
          ];
          try {
            localStorage.setItem(LOCAL_REQUESTS_KEY, JSON.stringify(next));
          } catch {
            // ignore
          }
          return next;
        });
      }
    },
    [user],
  );

  const changeHelpRequestStatus = useCallback(
    async (requestId: string, status: 'resolved' | 'cancelled') => {
      if (user) {
        await updateHelpRequestStatusDoc(user.uid, requestId, status);
      } else {
        setHelpRequests((prev) => {
          const next = prev.map((r) =>
            r.requestId === requestId && r.status === 'submitted' ? { ...r, status } : r,
          );
          try {
            localStorage.setItem(LOCAL_REQUESTS_KEY, JSON.stringify(next));
          } catch {
            // ignore
          }
          return next;
        });
      }
    },
    [user],
  );

  return (
    <FirebaseContext.Provider
      value={{
        user,
        authReady,
        firestoreOnline,
        signingIn,
        authError,
        profile,
        completedLessonIds,
        savedChats,
        helpRequests,
        sessionQuestionsCount,
        sessionScreenshotsCount,
        signIn,
        signOut,
        setLanguagePreference,
        recordQuestionAsked,
        recordScreenshotAnalyzed,
        toggleLessonComplete,
        saveChatGuide,
        removeSavedGuide,
        submitHelpRequest,
        changeHelpRequestStatus,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const ctx = useContext(FirebaseContext);
  if (!ctx) {
    throw new Error('useFirebase must be used inside FirebaseProvider');
  }
  return ctx;
}
