// Re-export all storage functions from supabase-service
// This module now uses Supabase as the backend
export {
  // Students
  getStudents,
  saveStudent,
  findStudentByRollNo,
  // Exams
  getExams,
  saveExam,
  deleteExam,
  getExamById,
  getActiveExams,
  // Submissions
  getSubmissions,
  saveSubmission,
  getSubmissionsByExam,
  getSubmissionByStudentAndExam,
  // Admins
  getAdmins,
  validateAdmin,
  // Session management
  setCurrentStudent,
  getCurrentStudent,
  setCurrentAdmin,
  getCurrentAdmin,
  setExamSession,
  getExamSession,
  updateExamSessionTabCount,
} from './supabase-service';
