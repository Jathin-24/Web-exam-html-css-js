export interface Student {
  id: string;
  rollNo: string;
  name: string;
  createdAt: string;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  maxTabSwitches: number;
  allowCopyPaste: boolean;
  isActive: boolean;
  createdAt: string;
  startsAt?: string;
  endsAt?: string;
}

export interface Submission {
  id: string;
  examId: string;
  studentId: string;
  studentRollNo: string;
  studentName: string;
  htmlCode: string;
  cssCode: string;
  jsCode: string;
  tabSwitchCount: number;
  submittedAt: string;
  isAutoSubmitted: boolean;
}

export interface ExamSession {
  examId: string;
  studentId: string;
  startedAt: string;
  tabSwitchCount: number;
  isFullscreen: boolean;
}

export interface Admin {
  id: string;
  email: string;
  password: string; // In production, this should be hashed
}
