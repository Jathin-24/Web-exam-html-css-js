# Troubleshooting Guide

## Problem: "Student Login Failed"

### Step 1: Run Diagnostic Test
1. Open http://localhost:8081/
2. Click "Not working? Run diagnostic test →" OR
3. Go directly to http://localhost:8081/test

### Step 2: Interpret Test Results

#### Test Result: ✗ Connection failed - relation "students" does not exist
**Cause**: Supabase tables haven't been created yet  
**Solution**: 
1. Open `SETUP_DATABASE.md`
2. Copy the SQL script
3. Go to your Supabase project dashboard
4. Select your project
5. Go to SQL Editor
6. Paste the SQL and execute
7. Wait for completion
8. Return to app and try login again

#### Test Result: ✓ Connection successful
**Good news**: Tables exist!  
**Next**: Try logging in at http://localhost:8081/

---

## Problem: "Database Tables Not Initialized" Toast Message

### What This Means
The app detected that Supabase tables don't exist in your project.

### Fix Options

**Option A: Auto Setup (Recommended)**
1. Follow `SETUP_DATABASE.md` instructions
2. Just 5 minutes to set up
3. Uses provided SQL script

**Option B: Manual Setup**
See `SUPABASE_TABLES.sql` for individual table definitions

**Option C: Verify Existing Setup**
If you already created tables:
1. Go to http://localhost:8081/test
2. Click "Test Connection"
3. Check if it shows "Connection successful"

---

## Problem: Environment Variables Not Found

### Check Your Setup
1. Verify `.env.local` file exists in project root
2. Should contain:
   ```env
   VITE_CUSTOM_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_CUSTOM_SUPABASE_ANON_KEY=eyJhbGc...
   ```
3. Make sure there are NO extra spaces or quotes

### Get Your Credentials
1. Go to https://supabase.com
2. Login to your project
3. Go to Settings → API
4. Copy "Project URL" → `VITE_CUSTOM_SUPABASE_URL`
5. Copy "anon public" → `VITE_CUSTOM_SUPABASE_ANON_KEY`
6. Paste into `.env.local`
7. Restart dev server: Kill terminal and run `npm run dev`

---

## Problem: Permission Denied (insert)

### What This Means
Supabase RLS (Row Level Security) is enabled and blocking your app.

### Solution (Temporary for Development)
1. Go to Supabase dashboard
2. For each table (students, exams, submissions, admins):
   - Click on table name
   - Click "RLS" badge at top
   - Click "Disable RLS"
   - Confirm

### For Production
1. See `SETUP_DATABASE.md` section "Row Level Security"
2. Create policies that allow specific operations
3. Examples provided in guide

---

## Problem: App Works Locally But Fails in Production

### Common Causes
1. **Missing env variables**: Make sure to set them in production
2. **Stale build**: Run `npm run build` before deploying
3. **RLS policies**: May be too restrictive for your app

### Verification Checklist
- [ ] Environment variables set in production
- [ ] VITE_CUSTOM_SUPABASE_URL is correct
- [ ] VITE_CUSTOM_SUPABASE_ANON_KEY is correct
- [ ] Database tables exist (can verify via Supabase)
- [ ] RLS is disabled OR policies are correct
- [ ] Built dist/ folder deployed (not src/)

---

## Problem: "Cannot Find Module"

### TypeScript/Build Errors
1. Delete `node_modules` and `dist/`
2. Run `npm install`
3. Run `npm run build` or `npm run dev`

### Import Errors
Make sure paths start with `@/`:
```typescript
// ❌ Wrong
import { Button } from '../components/ui/button';

// ✅ Correct
import { Button } from '@/components/ui/button';
```

---

## Problem: Port 8081 Already In Use

### Solution
```bash
# Kill the existing process
# On Windows, find the process:
netstat -ano | findstr :8081
# Then kill it by PID

# Or just restart your terminal/VS Code
```

### Alternative
Edit `vite.config.ts`:
```typescript
export default defineConfig({
  server: {
    port: 3000,  // Use different port
  },
  // ...
})
```

---

## Problem: Changes Not Reflecting in Browser

### Solution
1. Hard refresh: `Ctrl+Shift+R` or `Cmd+Shift+R`
2. Clear browser cache
3. Check browser console for errors (F12)
4. Restart dev server if needed

---

## Problem: Admin Login Not Working

### Steps to Fix
1. First make sure student login works
2. Go to http://localhost:8081/admin/login
3. You need to create an admin account first:
   - Go to Supabase dashboard
   - Open SQL Editor
   - Run:
   ```sql
   INSERT INTO admins (id, email, password)
   VALUES ('admin-1', 'admin@example.com', 'admin123')
   ON CONFLICT DO NOTHING;
   ```
4. Login with `admin@example.com` / `admin123`
5. Go to Admin Dashboard to create exams

---

## Problem: No Exams Show Up for Students

### Check Prerequisites
1. Admin must create exams (Admin Dashboard)
2. Exams must be marked as "Active" 
3. Student must be able to login first
4. Database must have exams table

### Debug Steps
1. Login as admin
2. Go to Admin Dashboard
3. Try to create new exam
4. If that fails, go to /test and run diagnostic
5. Check console for errors

---

## Problem: Tab-Switch Detection Not Working

### Expected Behavior
- When student switches tabs during exam: counter increases
- If you set `max_tab_switches: 0`, exam auto-submits on first switch
- Shows warning toast when tab-switch detected

### Debug
1. Open browser console (F12)
2. Start exam
3. Switch tabs - should see console log
4. Check in admin dashboard - submission should show tab count

---

## Problem: Code Editor Not Working

### Check
1. Make sure Monaco Editor CSS loads (check Network tab)
2. Try simple HTML: `<h1>Test</h1>`
3. Check browser console for JS errors

### Fix
```bash
npm install @monaco-editor/react
npm run dev
```

---

## Getting Help

### Information to Gather Before Asking for Help
1. **Screenshot of error message**
2. **Browser console output** (F12 → Console tab)
3. **Test page results** (http://localhost:8081/test)
4. **What you were trying to do**
5. **Expected vs actual behavior**

### Diagnostic Test Checklist
- [ ] Environment variables exist and correct
- [ ] Supabase project created
- [ ] Tables exist in database
- [ ] RLS is disabled
- [ ] Connection test passes
- [ ] Insert test passes

### If Stuck
1. Read `SETUP_DATABASE.md` completely
2. Verify all tables exist in Supabase
3. Run /test page and check exact errors
4. Check browser console (F12)
5. Restart dev server

---

## Common SQL Commands

### Check if Table Exists
```sql
SELECT * FROM students LIMIT 1;
-- If error: "does not exist" then table needs to be created
```

### Delete All Test Data (Start Fresh)
```sql
DELETE FROM submissions;
DELETE FROM exams;
DELETE FROM students;
DELETE FROM admins;
```

### Disable RLS on All Tables
```sql
ALTER TABLE students DISABLE ROW LEVEL SECURITY;
ALTER TABLE exams DISABLE ROW LEVEL SECURITY;
ALTER TABLE submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE admins DISABLE ROW LEVEL SECURITY;
```

### Reset a Table to Empty
```sql
TRUNCATE TABLE students CASCADE;
```

---

## Performance Tips

### If App Is Slow
1. Check Network tab (F12) - look for slow requests
2. Verify indexes exist (see SETUP_DATABASE.md)
3. Check Supabase project capacity

### Optimize Queries
```typescript
// ❌ Slow: Load all records
const students = await supabase.from('students').select('*');

// ✅ Fast: Load only what you need
const students = await supabase
  .from('students')
  .select('id, name, roll_no')
  .eq('is_active', true)
  .limit(100);
```

---

**Last Resort**: Check PROJECT_STATUS.md for complete project overview and contact your administrator.
