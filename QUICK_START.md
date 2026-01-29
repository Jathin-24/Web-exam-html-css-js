# Quick Start Guide

## Your app is now ready! Here's what to do next:

### 1. **Check Your Supabase Setup** (Most Important!)
   - Go to: http://localhost:8081/
   - Try logging in with any roll number and name
   - If you get an error → click "Not working? Run diagnostic test →"
   - This will show you exactly what's wrong

### 2. **If You See "Database tables not initialized"**
   - This is the most common issue
   - **Action**: Open [SETUP_DATABASE.md](./SETUP_DATABASE.md) for step-by-step instructions
   - You'll need to:
     1. Go to your Supabase project
     2. Open the SQL Editor
     3. Copy-paste the SQL from SETUP_DATABASE.md
     4. Execute it
     5. Return to your app and try logging in again

### 3. **Testing the App**
   ```bash
   # Start dev server (usually already running on port 8081)
   npm run dev
   
   # Run tests
   npm run test
   
   # Build for production
   npm run build
   ```

### 4. **Key URLs**
   - **Student Login**: http://localhost:8081/ (default page)
   - **Admin Login**: http://localhost:8081/admin/login
   - **Diagnostic Test**: http://localhost:8081/test (see detailed Supabase errors)

### 5. **Environment Variables**
   Your `.env.local` file should have:
   ```env
   VITE_CUSTOM_SUPABASE_URL=<your-supabase-url>
   VITE_CUSTOM_SUPABASE_ANON_KEY=<your-anon-key>
   ```

### 6. **Troubleshooting**
   - **Student login fails**: Go to /test page to see exact error
   - **Table not found**: Run SQL from SETUP_DATABASE.md
   - **Permission denied**: Make sure RLS is disabled (see SETUP_DATABASE.md)
   - **Can't create exam**: Log in as admin first, use admin dashboard

### 7. **Project Structure**
   - **Frontend**: React + TypeScript (Vite)
   - **Backend**: Supabase (PostgreSQL)
   - **Database**: Automatically detects missing tables on startup
   - **Session**: In-memory (secure, production-ready)

### 8. **What's Pre-configured**
   ✅ Student login page
   ✅ Admin login page  
   ✅ Exam creation (admin)
   ✅ Code editor with HTML/CSS/JS
   ✅ Tab-switch detection (anti-cheat)
   ✅ Submission tracking
   ✅ Responsive UI (mobile + desktop)

---

**Next Step**: Try logging in or click "Run diagnostic test" if something doesn't work!
