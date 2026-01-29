# Supabase Setup Guide

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
VITE_CUSTOM_SUPABASE_URL=your_supabase_project_url
VITE_CUSTOM_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these values from your Supabase project:
1. Go to https://app.supabase.com
2. Select your project
3. Go to Settings > API
4. Copy the Project URL and anon public key

## Database Setup

Run these SQL queries in your Supabase SQL editor to create the necessary tables:

### 1. Create Students Table
```sql
CREATE TABLE students (
  id TEXT PRIMARY KEY,
  roll_no TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_students_roll_no ON students(roll_no);
```

### 2. Create Exams Table
```sql
CREATE TABLE exams (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL,
  max_tab_switches INTEGER DEFAULT 3,
  allow_copy_paste BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  starts_at TIMESTAMP,
  ends_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_exams_is_active ON exams(is_active);
```

### 3. Create Submissions Table
```sql
CREATE TABLE submissions (
  id TEXT PRIMARY KEY,
  exam_id TEXT NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  student_roll_no TEXT NOT NULL,
  student_name TEXT NOT NULL,
  html_code TEXT,
  css_code TEXT,
  js_code TEXT,
  tab_switch_count INTEGER DEFAULT 0,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_auto_submitted BOOLEAN DEFAULT false,
  UNIQUE(student_id, exam_id)
);

CREATE INDEX idx_submissions_exam_id ON submissions(exam_id);
CREATE INDEX idx_submissions_student_id ON submissions(student_id);
```

### 4. Create Admins Table
```sql
CREATE TABLE admins (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_admins_email ON admins(email);
```

### 5. Insert Default Admin (Optional - the app will do this automatically)
```sql
INSERT INTO admins (id, email, password) VALUES
('admin-1', 'admin@exam.com', 'admin123')
ON CONFLICT (email) DO NOTHING;
```

## Security Considerations

**IMPORTANT**: This setup uses plaintext passwords for demo purposes only. For production:

1. **Never store plaintext passwords** - use password hashing (bcrypt, argon2)
2. **Use Supabase Auth** - Replace manual authentication with Supabase Auth service
3. **Enable RLS (Row Level Security)** - Add security policies to tables
4. **Use environment variables** - Never expose API keys in code

### Example RLS Policy for Students:
```sql
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view their own records"
  ON students FOR SELECT
  USING (auth.uid()::text = id);
```

## Testing

1. Make sure `.env.local` is in your `.gitignore`
2. Start your dev server: `npm run dev`
3. Check browser console for Supabase connection status
4. Try logging in with default admin credentials: `admin@exam.com` / `admin123`

## Troubleshooting

If Supabase is not configured:
- Check that `.env.local` exists and has correct values
- Verify the URL doesn't have trailing slashes
- Ensure the anon key is correct (not the service role key)
- Check browser console for specific error messages
