import { Student, Exam, Submission, Admin } from '@/types/exam';

// LocalStorage-based storage for development/demo
// In production, this would be replaced with Supabase calls

const STORAGE_KEYS = {
  STUDENTS: 'exam_platform_students',
  EXAMS: 'exam_platform_exams',
  SUBMISSIONS: 'exam_platform_submissions',
  ADMINS: 'exam_platform_admins',
  CURRENT_STUDENT: 'exam_platform_current_student',
  CURRENT_ADMIN: 'exam_platform_current_admin',
  EXAM_SESSION: 'exam_platform_exam_session',
};

// Initialize default admin if not exists
const initializeDefaultAdmin = () => {
  const admins = getAdmins();
  if (admins.length === 0) {
    const defaultAdmin: Admin = {
      id: 'admin-1',
      email: 'admin@exam.com',
      password: 'admin123',
    };
    localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify([defaultAdmin]));
  }
};

// Student functions
export const getStudents = (): Student[] => {
  const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
  return data ? JSON.parse(data) : [];
};

export const saveStudent = (student: Student): void => {
  const students = getStudents();
  const existing = students.findIndex(s => s.id === student.id);
  if (existing >= 0) {
    students[existing] = student;
  } else {
    students.push(student);
  }
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
};

export const findStudentByRollNo = (rollNo: string): Student | undefined => {
  return getStudents().find(s => s.rollNo === rollNo);
};

// Exam functions
export const getExams = (): Exam[] => {
  const data = localStorage.getItem(STORAGE_KEYS.EXAMS);
  return data ? JSON.parse(data) : [];
};

export const saveExam = (exam: Exam): void => {
  const exams = getExams();
  const existing = exams.findIndex(e => e.id === exam.id);
  if (existing >= 0) {
    exams[existing] = exam;
  } else {
    exams.push(exam);
  }
  localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(exams));
};

export const deleteExam = (examId: string): void => {
  const exams = getExams().filter(e => e.id !== examId);
  localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(exams));
};

export const getExamById = (id: string): Exam | undefined => {
  return getExams().find(e => e.id === id);
};

export const getActiveExams = (): Exam[] => {
  return getExams().filter(e => e.isActive);
};

// Submission functions
export const getSubmissions = (): Submission[] => {
  const data = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
  return data ? JSON.parse(data) : [];
};

export const saveSubmission = (submission: Submission): void => {
  const submissions = getSubmissions();
  const existing = submissions.findIndex(s => s.id === submission.id);
  if (existing >= 0) {
    submissions[existing] = submission;
  } else {
    submissions.push(submission);
  }
  localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
};

export const getSubmissionsByExam = (examId: string): Submission[] => {
  return getSubmissions().filter(s => s.examId === examId);
};

export const getSubmissionByStudentAndExam = (studentId: string, examId: string): Submission | undefined => {
  return getSubmissions().find(s => s.studentId === studentId && s.examId === examId);
};

// Admin functions
export const getAdmins = (): Admin[] => {
  const data = localStorage.getItem(STORAGE_KEYS.ADMINS);
  return data ? JSON.parse(data) : [];
};

export const validateAdmin = (email: string, password: string): Admin | null => {
  initializeDefaultAdmin();
  const admins = getAdmins();
  const admin = admins.find(a => a.email === email && a.password === password);
  return admin || null;
};

// Session management
export const setCurrentStudent = (student: Student | null): void => {
  if (student) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_STUDENT, JSON.stringify(student));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_STUDENT);
  }
};

export const getCurrentStudent = (): Student | null => {
  const data = localStorage.getItem(STORAGE_KEYS.CURRENT_STUDENT);
  return data ? JSON.parse(data) : null;
};

export const setCurrentAdmin = (admin: Admin | null): void => {
  if (admin) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_ADMIN, JSON.stringify(admin));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_ADMIN);
  }
};

export const getCurrentAdmin = (): Admin | null => {
  const data = localStorage.getItem(STORAGE_KEYS.CURRENT_ADMIN);
  return data ? JSON.parse(data) : null;
};

// Exam session
export const setExamSession = (session: { examId: string; studentId: string; tabSwitchCount: number } | null): void => {
  if (session) {
    localStorage.setItem(STORAGE_KEYS.EXAM_SESSION, JSON.stringify({
      ...session,
      startedAt: new Date().toISOString(),
    }));
  } else {
    localStorage.removeItem(STORAGE_KEYS.EXAM_SESSION);
  }
};

export const getExamSession = () => {
  const data = localStorage.getItem(STORAGE_KEYS.EXAM_SESSION);
  return data ? JSON.parse(data) : null;
};

export const updateExamSessionTabCount = (count: number): void => {
  const session = getExamSession();
  if (session) {
    session.tabSwitchCount = count;
    localStorage.setItem(STORAGE_KEYS.EXAM_SESSION, JSON.stringify(session));
  }
};

// Initialize
initializeDefaultAdmin();
