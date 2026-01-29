/**
 * Session Management - Supabase-only (Production)
 * No localStorage - all state is Supabase-backed or in-memory
 * Session data is stored in React state via context/hooks
 */

import { Student, Admin } from '@/types/exam';

// In-memory session state (would be managed via React Context in real app)
let currentStudent: Student | null = null;
let currentAdmin: Admin | null = null;
let examSession: { examId: string; studentId: string; tabSwitchCount: number; startedAt: string } | null = null;

// ============ STUDENT SESSION ============
export const setCurrentStudent = (student: Student | null): void => {
  currentStudent = student;
};

export const getCurrentStudent = (): Student | null => {
  return currentStudent;
};

// ============ ADMIN SESSION ============
export const setCurrentAdmin = (admin: Admin | null): void => {
  currentAdmin = admin;
};

export const getCurrentAdmin = (): Admin | null => {
  return currentAdmin;
};

// ============ EXAM SESSION ============
export const setExamSession = (session: { examId: string; studentId: string; tabSwitchCount: number } | null): void => {
  if (session) {
    examSession = { ...session, startedAt: new Date().toISOString() };
  } else {
    examSession = null;
  }
};

export const getExamSession = () => {
  return examSession;
};

export const updateExamSessionTabCount = (count: number): void => {
  if (examSession) {
    examSession.tabSwitchCount = count;
  }
};
