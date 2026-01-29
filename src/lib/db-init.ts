/**
 * Database Initialization
 * Attempts to create required tables on app startup if they don't exist
 * This is a development helper - in production, use proper migrations
 */

import { supabase, isSupabaseConfigured } from './supabase';

const initializationSQL = `
-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,
  roll_no TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create exams table
CREATE TABLE IF NOT EXISTS exams (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL,
  max_tab_switches INTEGER DEFAULT 0,
  allow_copy_paste BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  starts_at TIMESTAMP WITH TIME ZONE,
  ends_at TIMESTAMP WITH TIME ZONE
);

-- Create submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id TEXT PRIMARY KEY,
  exam_id TEXT NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  student_roll_no TEXT NOT NULL,
  student_name TEXT NOT NULL,
  html_code TEXT DEFAULT '',
  css_code TEXT DEFAULT '',
  js_code TEXT DEFAULT '',
  tab_switch_count INTEGER DEFAULT 0,
  submitted_at TIMESTAMP WITH TIME ZONE,
  is_auto_submitted BOOLEAN DEFAULT FALSE
);

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

-- Disable RLS to allow app access
ALTER TABLE students DISABLE ROW LEVEL SECURITY;
ALTER TABLE exams DISABLE ROW LEVEL SECURITY;
ALTER TABLE submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE admins DISABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_students_roll_no ON students(roll_no);
CREATE INDEX IF NOT EXISTS idx_exams_is_active ON exams(is_active);
CREATE INDEX IF NOT EXISTS idx_submissions_exam_id ON submissions(exam_id);
CREATE INDEX IF NOT EXISTS idx_submissions_student_id ON submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);
`;

export const initializeDatabase = async () => {
  if (!isSupabaseConfigured || !supabase) {
    console.warn('⚠ Supabase not configured, skipping database initialization');
    return false;
  }

  try {
    console.log('Attempting to initialize database tables...');
    
    // Test connection by trying to read from students table
    const { error: checkError } = await supabase
      .from('students')
      .select('id')
      .limit(1);

    if (!checkError) {
      console.log('✓ Database tables already exist');
      return true;
    }

    // If table doesn't exist, we would need to run SQL
    // However, Supabase doesn't expose SQL execution via client library
    // So we'll just return false and show the manual setup instructions
    console.warn('⚠ Database tables not found. Please run SETUP_DATABASE.md');
    return false;
  } catch (error) {
    console.error('Database initialization error:', error);
    return false;
  }
};

// Auto-initialize on module load
initializeDatabase();
