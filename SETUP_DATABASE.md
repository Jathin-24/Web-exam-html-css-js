# URGENT: Setup Your Supabase Database

The student login is failing because the database tables don't exist in your Supabase project.

## CRITICAL STEPS TO FIX (5 minutes):

### 1. Go to Your Supabase Project
- Open: https://supabase.com/dashboard/projects
- Select your project (with the URL and key in `.env.local`)

### 2. Open SQL Editor
- In the left sidebar, click "SQL Editor"
- Click "+ New Query"

### 3. Copy-Paste This SQL and Run It:

```sql
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_students_roll_no ON students(roll_no);
CREATE INDEX IF NOT EXISTS idx_exams_is_active ON exams(is_active);
CREATE INDEX IF NOT EXISTS idx_submissions_exam_id ON submissions(exam_id);
CREATE INDEX IF NOT EXISTS idx_submissions_student_id ON submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);

-- IMPORTANT: Disable RLS so the app can access without auth
ALTER TABLE students DISABLE ROW LEVEL SECURITY;
ALTER TABLE exams DISABLE ROW LEVEL SECURITY;
ALTER TABLE submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE admins DISABLE ROW LEVEL SECURITY;
```

Press the blue "Run" button (or Ctrl+Enter).

### 4. Wait for Success
You should see:
```
✓ Table "students" created successfully
✓ Table "exams" created successfully
...
```

### 5. Test Your Setup
1. Go to: http://localhost:8081/test
2. Click "Test Connection" button
3. You should see: "✓ Connection successful!"

If still failing:
- Click "Test Insert" button
- Check browser console (F12 → Console tab) for error message
- If RLS error: Go back to Supabase and re-run the "DISABLE ROW LEVEL SECURITY" lines

### 6. Now Try Student Login
Go to: http://localhost:8081/
- Roll Number: `001`
- Name: `Test Student`
- Click "Start Exam"

Should now work! ✓

## Troubleshooting:

**Error: "relation students does not exist"**
→ Run the SQL above in Supabase SQL Editor

**Error: "new row violates row level security policy"**
→ Disable RLS:
```sql
ALTER TABLE students DISABLE ROW LEVEL SECURITY;
ALTER TABLE exams DISABLE ROW LEVEL SECURITY;
ALTER TABLE submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE admins DISABLE ROW LEVEL SECURITY;
```

**Error: "permission denied"**
→ Same as above - RLS policies are blocking access

**Still not working?**
1. Check .env.local has correct VITE_CUSTOM_SUPABASE_URL and VITE_CUSTOM_SUPABASE_ANON_KEY
2. Go to http://localhost:8081/test
3. Open browser console (F12)
4. Click test buttons and read the error
5. Screenshot the error and refer to troubleshooting above
