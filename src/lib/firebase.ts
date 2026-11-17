import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import type { Language } from '../types';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null,
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
      return false;
    }
    return true;
  }
}

export function sanitizeId(raw: string, maxLen = 64): string {
  const cleaned = raw.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, maxLen);
  return cleaned.length > 0 ? cleaned : `id-${Date.now()}`;
}

export function clampText(raw: string, maxLen: number, fallback = 'N/A'): string {
  const trimmed = raw.trim().slice(0, maxLen);
  return trimmed.length > 0 ? trimmed : fallback;
}

export async function signInWithGoogle() {
  return signInWithPopup(auth, googleProvider);
}

export async function signOutUser() {
  return firebaseSignOut(auth);
}

export async function ensureUserProfile(
  uid: string,
  displayName: string,
  preferredLanguage: Language,
) {
  const path = `users/${uid}`;
  const ref = doc(db, 'users', uid);
  try {
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        uid,
        displayName: clampText(displayName, 80, 'Learner'),
        preferredLanguage,
        completedLessonsCount: 0,
        questionsAskedCount: 0,
        screenshotsAnalyzedCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateUserCounts(
  uid: string,
  fields: Partial<{
    displayName: string;
    preferredLanguage: Language;
    completedLessonsCount: number;
    questionsAskedCount: number;
    screenshotsAnalyzedCount: number;
  }>,
) {
  const path = `users/${uid}`;
  const ref = doc(db, 'users', uid);
  const payload: Record<string, unknown> = {
    updatedAt: serverTimestamp(),
  };
  if (fields.displayName !== undefined) {
    payload.displayName = clampText(fields.displayName, 80, 'Learner');
  }
  if (fields.preferredLanguage !== undefined) {
    payload.preferredLanguage = fields.preferredLanguage;
  }
  if (fields.completedLessonsCount !== undefined) {
    payload.completedLessonsCount = Math.max(0, Math.min(1000, Math.floor(fields.completedLessonsCount)));
  }
  if (fields.questionsAskedCount !== undefined) {
    payload.questionsAskedCount = Math.max(0, Math.min(100000, Math.floor(fields.questionsAskedCount)));
  }
  if (fields.screenshotsAnalyzedCount !== undefined) {
    payload.screenshotsAnalyzedCount = Math.max(
      0,
      Math.min(100000, Math.floor(fields.screenshotsAnalyzedCount)),
    );
  }
  try {
    await updateDoc(ref, payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function saveLessonProgressDoc(uid: string, lessonId: string, completed: boolean) {
  const safeLessonId = sanitizeId(lessonId, 64);
  const path = `users/${uid}/lessonProgress/${safeLessonId}`;
  const ref = doc(db, 'users', uid, 'lessonProgress', safeLessonId);
  try {
    const existing = await getDoc(ref);
    if (existing.exists()) {
      await updateDoc(ref, {
        completed,
        completedAt: serverTimestamp(),
      });
    } else {
      await setDoc(ref, {
        lessonId: safeLessonId,
        userId: uid,
        completed,
        completedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveChatEntryDoc(
  uid: string,
  entryId: string,
  data: {
    language: Language;
    question: string;
    summary: string;
    steps: string[];
  },
) {
  const safeId = sanitizeId(entryId, 64);
  const path = `users/${uid}/chatHistory/${safeId}`;
  const ref = doc(db, 'users', uid, 'chatHistory', safeId);
  const safeSteps = (data.steps.length > 0 ? data.steps : [data.summary])
    .slice(0, 12)
    .map((s) => clampText(s, 400, 'Step'));
  try {
    await setDoc(ref, {
      entryId: safeId,
      userId: uid,
      language: data.language,
      question: clampText(data.question, 500, 'Question'),
      summary: clampText(data.summary, 600, 'Answer'),
      steps: safeSteps,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function deleteChatEntryDoc(uid: string, entryId: string) {
  const safeId = sanitizeId(entryId, 64);
  const path = `users/${uid}/chatHistory/${safeId}`;
  try {
    await deleteDoc(doc(db, 'users', uid, 'chatHistory', safeId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function createHelpRequestDoc(
  uid: string,
  requestId: string,
  data: {
    topic: string;
    language: Language;
    description: string;
    volunteerId: string;
    volunteerName: string;
  },
) {
  const safeReqId = sanitizeId(requestId, 64);
  const safeVolId = sanitizeId(data.volunteerId, 64);
  const path = `users/${uid}/helpRequests/${safeReqId}`;
  const ref = doc(db, 'users', uid, 'helpRequests', safeReqId);
  try {
    await setDoc(ref, {
      requestId: safeReqId,
      userId: uid,
      topic: clampText(data.topic, 120, 'General Tech Help'),
      language: data.language,
      description: clampText(data.description, 600, 'Need assistance'),
      volunteerId: safeVolId,
      volunteerName: clampText(data.volunteerName, 80, 'Community Mentor'),
      status: 'submitted',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateHelpRequestStatusDoc(
  uid: string,
  requestId: string,
  status: 'resolved' | 'cancelled',
) {
  const safeReqId = sanitizeId(requestId, 64);
  const path = `users/${uid}/helpRequests/${safeReqId}`;
  try {
    await updateDoc(doc(db, 'users', uid, 'helpRequests', safeReqId), {
      status,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}
