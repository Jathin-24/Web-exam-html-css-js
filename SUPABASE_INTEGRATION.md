# Exam Platform - Supabase Integration Guide

This project is an exam platform built with React and Vite that uses **Supabase** as its database backend. The application allows students to take coding exams and admins to manage exams and review submissions.

## Project Overview

### Features
- **Student Login**: Students can log in with their roll number and name
- **Exam Management**: Admin can create, edit, and manage exams
- **Live Code Editor**: Students can write HTML, CSS, and JavaScript code
- **Anti-Cheat Mechanisms**: 
  - Tab switch detection and limiting
  - Copy/paste control
  - Fullscreen enforcement
  - Auto-submission on violation
- **Submission Tracking**: Admins can review student submissions with code viewing
- **Session Management**: Track exam sessions and student progress

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Query Library**: React Query
- **Code Editor**: Monaco Editor
- **Routing**: React Router

## Setup Instructions

### 1. Create Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click "New project"
3. Enter project name and password
4. Wait for project to initialize
5. Go to Settings > API to get your credentials

### 2. Set Environment Variables

Create `.env.local` in your project root:

```bash
VITE_CUSTOM_SUPABASE_URL=https://your-project.supabase.co
VITE_CUSTOM_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important**: Add `.env.local` to `.gitignore` (already should be there)

### 3. Create Database Tables

Go to Supabase SQL Editor and run these queries in order:

#### Students Table
```sql
CREATE TABLE students (
  id TEXT PRIMARY KEY,
  roll_no TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_students_roll_no ON students(roll_no);
```

#### Exams Table
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

#### Submissions Table
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

#### Admins Table
```sql
CREATE TABLE admins (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_admins_email ON admins(email);

-- Insert default admin (optional - app will do this automatically)
INSERT INTO admins (id, email, password) VALUES
('admin-1', 'admin@exam.com', 'admin123')
ON CONFLICT (email) DO NOTHING;
```

### 4. Run the Application

```bash
npm install
npm run dev
```

Visit `http://localhost:5173`

## Using the Application

### For Students
1. Visit the home page (`/`)
2. Enter your roll number and name
3. Click "Start Exam" to see available exams
4. Click "Start Exam" on any exam to begin
5. Review the exam rules and click "Start Exam" to confirm
6. Write your code in the provided editor
7. Submit when done

### For Admins
1. Visit `/admin/login`
2. Login with:
   - Email: `admin@exam.com`
   - Password: `admin123`
3. Create new exams with desired settings
4. Toggle exams active/inactive
5. View submissions and code reviews

## File Structure

```
src/
├── components/
│   ├── AdminDashboard.tsx      # Admin exam management
│   ├── AdminLogin.tsx          # Admin login form
│   ├── CodeEditor.tsx          # Monaco-based code editor
│   ├── ExamPage.tsx            # Student exam interface
│   ├── StudentExamList.tsx     # Available exams for students
│   ├── StudentLogin.tsx        # Student login form
│   ├── SubmissionView.tsx      # Admin submission review
│   └── ui/                     # shadcn/ui components
├── hooks/
│   ├── useAntiCheat.ts         # Anti-cheat detection logic
│   └── use-*.ts                # Other utilities
├── lib/
│   ├── supabase.ts             # Supabase client initialization
│   ├── supabase-service.ts     # Database service layer
│   └── storage.ts              # Re-exports from supabase-service
├── types/
│   └── exam.ts                 # TypeScript interfaces
└── App.tsx                     # Main app router
```

## Key Components

### StudentLogin
- Allows student login with roll number and name
- Stores current student in localStorage
- Validates student exists or creates new

### ExamPage
- Monaco editor for HTML, CSS, JavaScript
- Real-time preview (if preview enabled)
- Anti-cheat monitoring
- Countdown timer
- Auto-submit on time expiry or violations

### AdminDashboard
- Create/edit/delete exams
- Activate/deactivate exams
- View submissions per exam
- Student management

### useAntiCheat Hook
- Monitors tab switches
- Prevents copy/paste if disabled
- Manages fullscreen mode
- Tracks violations

## API/Database Operations

All database operations are in `src/lib/supabase-service.ts`:

### Student Operations
- `getStudents()` - Get all students
- `saveStudent(student)` - Create/update student
- `findStudentByRollNo(rollNo)` - Find by roll number

### Exam Operations
- `getExams()` - Get all exams
- `saveExam(exam)` - Create/update exam
- `deleteExam(examId)` - Delete exam
- `getExamById(id)` - Get specific exam
- `getActiveExams()` - Get active exams only

### Submission Operations
- `getSubmissions()` - Get all submissions
- `saveSubmission(submission)` - Save student submission
- `getSubmissionsByExam(examId)` - Get exam submissions
- `getSubmissionByStudentAndExam(studentId, examId)` - Get specific submission

### Admin Operations
- `getAdmins()` - Get all admins
- `validateAdmin(email, password)` - Verify admin credentials

## Supabase Configuration

The Supabase client is initialized in `src/lib/supabase.ts`:

```typescript
const SUPABASE_URL = import.meta.env.VITE_CUSTOM_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_CUSTOM_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

## Session Management

- **Current Student**: Stored in localStorage under `exam_platform_current_student`
- **Current Admin**: Stored in localStorage under `exam_platform_current_admin`
- **Exam Session**: Stored in localStorage under `exam_platform_exam_session`

Session data is used for client-side navigation and state management. The actual exam and submission data is persisted in Supabase.

## Troubleshooting

### Supabase Not Connecting
- Check `.env.local` exists with correct values
- Verify URL doesn't have trailing slash
- Ensure anon key is correct (not service role key)
- Check browser console for error messages

### Default Admin Not Created
- The app automatically creates `admin@exam.com` / `admin123`
- If it doesn't appear, manually insert via SQL:
  ```sql
  INSERT INTO admins (id, email, password) VALUES
  ('admin-1', 'admin@exam.com', 'admin123');
  ```

### Students Can't Submit
- Verify `submissions` table exists with correct schema
- Check `student_id` and `exam_id` foreign keys are set up
- Ensure `UNIQUE(student_id, exam_id)` constraint exists

### No Exams Showing
- Check `exams` table has `is_active = true` for exams you want to show
- Verify exams are created in admin dashboard

## Security Notes

**⚠️ Current Implementation is for Demo/Development Only**

For production deployment:
1. **Never store plaintext passwords** - Use bcrypt or argon2
2. **Use Supabase Auth** - Replace manual auth with Supabase Auth service
3. **Enable Row Level Security (RLS)** - Add security policies to tables
4. **Use HTTPS only** - Never transmit credentials over HTTP
5. **Implement rate limiting** - Prevent brute force attacks
6. **Hash sensitive data** - Use proper encryption
7. **Audit logging** - Track admin actions and submissions

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Requires JavaScript enabled

## Default Credentials

- **Admin**: `admin@exam.com` / `admin123`
- **Student**: Create your own with any roll number

## Contributing

1. Create a feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

## License

This project is part of the exam platform system.
