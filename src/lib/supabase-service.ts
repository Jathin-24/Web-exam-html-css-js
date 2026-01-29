import { supabase, isSupabaseConfigured } from './supabase';
import { Student, Exam, Submission, Admin } from '@/types/exam';

const ensureSupabase = () => {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured. Set VITE_CUSTOM_SUPABASE_URL and VITE_CUSTOM_SUPABASE_ANON_KEY in .env.local');
  }
};

const toStudent = (d: unknown): Student => {
  const row = d as Record<string, unknown>;
  return { id: String(row['id']), rollNo: String(row['roll_no']), name: String(row['name']), createdAt: String(row['created_at']) };
};

const toExam = (e: unknown): Exam => {
  const row = e as Record<string, unknown>;
  return {
    id: String(row['id']),
    title: String(row['title'] ?? ''),
    description: String(row['description'] ?? ''),
    duration: Number(row['duration'] ?? 0),
    maxTabSwitches: Number(row['max_tab_switches'] ?? 0),
    allowCopyPaste: Boolean(row['allow_copy_paste'] ?? false),
    isActive: Boolean(row['is_active'] ?? false),
    createdAt: String(row['created_at'] ?? ''),
    startsAt: row['starts_at'] ? String(row['starts_at']) : undefined,
    endsAt: row['ends_at'] ? String(row['ends_at']) : undefined,
  };
};

const toSubmission = (s: unknown): Submission => {
  const row = s as Record<string, unknown>;
  return {
    id: String(row['id']),
    examId: String(row['exam_id']),
    studentId: String(row['student_id']),
    studentRollNo: String(row['student_roll_no']),
    studentName: String(row['student_name']),
    htmlCode: String(row['html_code'] ?? ''),
    cssCode: String(row['css_code'] ?? ''),
    jsCode: String(row['js_code'] ?? ''),
    tabSwitchCount: Number(row['tab_switch_count'] ?? 0),
    submittedAt: String(row['submitted_at'] ?? ''),
    isAutoSubmitted: Boolean(row['is_auto_submitted'] ?? false),
  };
};

// ============ STUDENT FUNCTIONS ============
export const getStudents = async (): Promise<Student[]> => {
  ensureSupabase();
  const { data, error } = await supabase!.from('students').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(toStudent);
};

export const saveStudent = async (student: Student): Promise<void> => {
  ensureSupabase();
  console.log('Saving student to Supabase:', student);
  const { error } = await supabase!.from('students').upsert({ id: student.id, roll_no: student.rollNo, name: student.name, created_at: student.createdAt }, { onConflict: 'id' });
  if (error) {
    console.error('Supabase saveStudent error:', error);
    throw new Error(`Failed to save student: ${error.message}`);
  }
  console.log('Student saved successfully');
};

export const findStudentByRollNo = async (rollNo: string): Promise<Student | undefined> => {
  ensureSupabase();
  console.log('Finding student by roll number:', rollNo);
  const { data, error } = await supabase!.from('students').select('*').eq('roll_no', rollNo).maybeSingle();
  if (error) {
    console.error('Supabase findStudentByRollNo error:', error);
    throw new Error(`Failed to find student: ${error.message}`);
  }
  console.log('Student query result:', data);
  return data ? toStudent(data) : undefined;
};

// ============ EXAM FUNCTIONS ============
export const getExams = async (): Promise<Exam[]> => {
  ensureSupabase();
  const { data, error } = await supabase!.from('exams').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(toExam);
};

export const saveExam = async (exam: Exam): Promise<void> => {
  ensureSupabase();
  const { error } = await supabase!.from('exams').upsert({
    id: exam.id,
    title: exam.title,
    description: exam.description,
    duration: exam.duration,
    max_tab_switches: exam.maxTabSwitches,
    allow_copy_paste: exam.allowCopyPaste,
    is_active: exam.isActive,
    created_at: exam.createdAt,
    starts_at: exam.startsAt,
    ends_at: exam.endsAt,
  }, { onConflict: 'id' });
  if (error) throw error;
};

export const deleteExam = async (examId: string): Promise<void> => {
  ensureSupabase();
  const { error } = await supabase!.from('exams').delete().eq('id', examId);
  if (error) throw error;
};

export const getExamById = async (id: string): Promise<Exam | undefined> => {
  ensureSupabase();
  const { data, error } = await supabase!.from('exams').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data ? toExam(data) : undefined;
};

export const getActiveExams = async (): Promise<Exam[]> => {
  ensureSupabase();
  const { data, error } = await supabase!.from('exams').select('*').eq('is_active', true).order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(toExam);
};

// ============ SUBMISSION FUNCTIONS ============
export const getSubmissions = async (): Promise<Submission[]> => {
  ensureSupabase();
  const { data, error } = await supabase!.from('submissions').select('*').order('submitted_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(toSubmission);
};

export const saveSubmission = async (submission: Submission): Promise<void> => {
  ensureSupabase();
  const { error } = await supabase!.from('submissions').insert({
    id: submission.id,
    exam_id: submission.examId,
    student_id: submission.studentId,
    student_roll_no: submission.studentRollNo,
    student_name: submission.studentName,
    html_code: submission.htmlCode,
    css_code: submission.cssCode,
    js_code: submission.jsCode,
    tab_switch_count: submission.tabSwitchCount,
    submitted_at: submission.submittedAt,
    is_auto_submitted: submission.isAutoSubmitted,
  });
  if (error) throw error;
};

export const getSubmissionsByExam = async (examId: string): Promise<Submission[]> => {
  ensureSupabase();
  const { data, error } = await supabase!.from('submissions').select('*').eq('exam_id', examId).order('submitted_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(toSubmission);
};

export const getSubmissionByStudentAndExam = async (studentId: string, examId: string): Promise<Submission | undefined> => {
  ensureSupabase();
  const { data, error } = await supabase!.from('submissions').select('*').eq('student_id', studentId).eq('exam_id', examId).maybeSingle();
  if (error) throw error;
  return data ? toSubmission(data) : undefined;
};

// ============ ADMIN FUNCTIONS ============
export const getAdmins = async (): Promise<Admin[]> => {
  ensureSupabase();
  const { data, error } = await supabase!.from('admins').select('*');
  if (error) throw error;
  return (data || []).map((a: unknown) => {
    const row = a as Record<string, unknown>;
    return { id: String(row['id']), email: String(row['email']), password: String(row['password']) } as Admin;
  });
};

export const validateAdmin = async (email: string, password: string): Promise<Admin | null> => {
  ensureSupabase();
  const { data, error } = await supabase!.from('admins').select('*').eq('email', email).eq('password', password).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const row = data as Record<string, unknown>;
  return { id: String(row['id']), email: String(row['email']), password: String(row['password']) };
};

export const initializeDefaultAdmin = async (): Promise<void> => {
  ensureSupabase();
  const admins = await getAdmins();
  if (admins.length === 0) {
    const defaultAdmin: Admin = { id: 'admin-1', email: 'admin@exam.com', password: 'admin123' };
    const { error } = await supabase!.from('admins').insert({ id: defaultAdmin.id, email: defaultAdmin.email, password: defaultAdmin.password });
    if (error) throw error;
    console.log('✓ Default admin created in Supabase');
  }
};

// ============ SESSION MANAGEMENT (in-memory, production-safe) ============
// Re-export from session module - no localStorage used
export { setCurrentStudent, getCurrentStudent, setCurrentAdmin, getCurrentAdmin, setExamSession, getExamSession, updateExamSessionTabCount } from './session';
