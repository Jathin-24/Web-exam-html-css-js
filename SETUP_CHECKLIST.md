# Setup Checklist ✓

## Pre-Setup (What I've Done ✅)
- [x] Installed and configured Supabase client
- [x] Removed all localStorage dependencies
- [x] Created in-memory session management
- [x] Built production bundle (zero errors)
- [x] Created diagnostic test page
- [x] Enhanced error messages
- [x] Dev server running on port 8081

## Your Setup Tasks (What You Need to Do)

### Step 1: Verify Your Environment (2 min)
- [ ] Open http://localhost:8081/
- [ ] You should see Student Login page
- [ ] Click "Run diagnostic test" link
- [ ] Check what error you get (or success message)

### Step 2: Create Supabase Project (If Not Done)
- [ ] Go to https://supabase.com/
- [ ] Create new project (free tier is fine)
- [ ] Wait for project to initialize (~5 min)
- [ ] Save your Project URL
- [ ] Save your Anon Key (API section)

### Step 3: Add Supabase Credentials to App (1 min)
- [ ] Open `.env.local` in VS Code
- [ ] Add your Supabase URL and Key:
  ```env
  VITE_CUSTOM_SUPABASE_URL=<your-project-url>
  VITE_CUSTOM_SUPABASE_ANON_KEY=<your-anon-key>
  ```
- [ ] Save file
- [ ] Restart dev server (if needed)

### Step 4: Create Database Tables (3 min)
**This is the most important step if login is failing!**

- [ ] Go to your Supabase project dashboard
- [ ] Click "SQL Editor" in left sidebar
- [ ] Click "New Query"
- [ ] Copy entire SQL from `SETUP_DATABASE.md`
- [ ] Paste into SQL editor
- [ ] Click "Run" button
- [ ] Wait for "Success" message
- [ ] Return to app

### Step 5: Test Login (1 min)
- [ ] Go to http://localhost:8081/
- [ ] Enter any Roll Number (e.g., "001")
- [ ] Enter any Name (e.g., "Test Student")
- [ ] Click "Start Exam"
- [ ] Should see "Login successful!" toast

### If Login Still Fails
- [ ] Go to http://localhost:8081/test
- [ ] Click "Test Connection" button
- [ ] Read the error message carefully
- [ ] Check `TROUBLESHOOTING.md` for your error
- [ ] Go to browser console (F12) for more details

## Feature Testing (After Login Works)

### Test Student Flow (5 min)
- [ ] Login as student
- [ ] Should see "Your Exams" page
- [ ] (Currently empty until admin creates exams)
- [ ] Check student ID is set in session

### Create Admin Account (2 min)
- [ ] Go to Supabase SQL Editor
- [ ] Run this:
  ```sql
  INSERT INTO admins (id, email, password)
  VALUES ('admin-1', 'admin@example.com', 'password123');
  ```
- [ ] Go to http://localhost:8081/admin/login
- [ ] Login with `admin@example.com` / `password123`

### Create Test Exam (3 min)
- [ ] In Admin Dashboard, click "Create Exam"
- [ ] Fill in exam details
- [ ] Make sure "Active" toggle is ON
- [ ] Click Save
- [ ] Should see exam in list

### Take Test Exam (5 min)
- [ ] Logout (if needed)
- [ ] Student login as before
- [ ] Should see the exam you created
- [ ] Click "Take Exam"
- [ ] Should see code editor
- [ ] Write some code
- [ ] Click "Submit" or wait for timer

### View Submission (2 min)
- [ ] Admin Dashboard
- [ ] Click exam name
- [ ] Should see student submission
- [ ] Should see submitted code

## Production Deployment Checklist

### Before Deploying
- [ ] All tests passing locally
- [ ] No console errors (F12)
- [ ] Environment variables working
- [ ] Database tables exist and populated
- [ ] RLS disabled or policies configured
- [ ] Build succeeds: `npm run build`

### Deploy Files
- [ ] Deploy only the `dist/` folder
- [ ] NOT `src/` or `node_modules/`
- [ ] Set production environment variables
- [ ] Make sure Supabase credentials are correct for prod

### Post-Deployment
- [ ] Test login on live domain
- [ ] Test exam submission
- [ ] Check admin panel works
- [ ] Monitor browser console for errors

## Troubleshooting Quick Links

| Problem | Solution |
|---------|----------|
| Login failing | Run /test page, check console (F12) |
| Tables don't exist | Run SQL from SETUP_DATABASE.md |
| Permission denied | Disable RLS in Supabase (see guide) |
| Env vars not found | Restart dev server after editing .env.local |
| Build fails | Delete dist/ and node_modules/, run npm install |
| Port in use | Restart terminal or change port in vite.config.ts |

## Files You Should Know About

| File | Purpose | Action |
|------|---------|--------|
| `.env.local` | Your Supabase credentials | **EDIT THIS** with your keys |
| `SETUP_DATABASE.md` | Step-by-step database setup | **READ & FOLLOW** if tables missing |
| `QUICK_START.md` | Quick reference guide | Read if lost |
| `TROUBLESHOOTING.md` | Detailed problem solving | Check if something breaks |
| `PROJECT_STATUS.md` | Complete project overview | Reference for architecture |
| `SUPABASE_TABLES.sql` | Raw SQL for tables | Reference for what was created |

## Success Criteria

You'll know everything is working when:

- ✅ Student can login with roll number + name
- ✅ Student sees exams list (empty or with test data)
- ✅ Admin can login and create exams
- ✅ Admin exam appears in student's list
- ✅ Student can take exam and submit
- ✅ Admin can view student submission
- ✅ No errors in browser console
- ✅ No errors in terminal/dev server

## Getting Support

### If You Get Stuck:

1. **Check the error message** - Write it down exactly
2. **Run diagnostic test** - http://localhost:8081/test
3. **Check browser console** - F12 → Console tab → Copy error
4. **Search troubleshooting guide** - TROUBLESHOOTING.md
5. **Check project status** - PROJECT_STATUS.md for architecture

### Information to Provide When Asking for Help:
- What you were doing when it failed
- Exact error message (screenshot is good)
- Output from /test page
- Browser console output (F12)

---

**You're all set! Start with Step 1 above.** 🚀

If you have any Supabase credentials ready, you can jump directly to Step 3.
