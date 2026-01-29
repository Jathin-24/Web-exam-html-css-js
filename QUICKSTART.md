# ⚡ Quick Setup Guide

## What You Need to Do

### 1️⃣ Create Supabase Project (2 minutes)
- Go to https://app.supabase.com
- Click "New project"
- Name it anything you want
- Save the project

### 2️⃣ Get Your Credentials (1 minute)
- In Supabase, go to **Settings > API**
- Copy:
  - **Project URL** → `VITE_CUSTOM_SUPABASE_URL`
  - **Anon public key** → `VITE_CUSTOM_SUPABASE_ANON_KEY`

### 3️⃣ Create .env.local File (1 minute)
In your project root, create `.env.local`:
```
VITE_CUSTOM_SUPABASE_URL=paste_url_here
VITE_CUSTOM_SUPABASE_ANON_KEY=paste_key_here
```

### 4️⃣ Create Database Tables (2 minutes)
- In Supabase, go to **SQL Editor**
- Create new query
- Copy-paste the SQL from [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
- Run all 4 table creation queries

### 5️⃣ Start the App (1 minute)
```bash
npm install
npm run dev
```

## Login Credentials

**Admin Dashboard**: `/admin/login`
- Email: `admin@exam.com`
- Password: `admin123`

**Student Portal**: `/`
- Enter any roll number and name

## What Works Now

✅ **Students** - Can take exams with real-time code editor  
✅ **Anti-Cheat** - Tab switching, copy/paste control, fullscreen mode  
✅ **Admins** - Can create/manage exams and review submissions  
✅ **Database** - All data saved to Supabase  

## Troubleshooting

**"Supabase NOT configured"** in console?
- Check `.env.local` file exists
- Verify variables have correct values
- No trailing slashes in URL
- Restart dev server after adding .env.local

**Tables not created?**
- Go to Supabase > SQL Editor
- Paste and run the queries from SUPABASE_SETUP.md
- Check for error messages

**Can't login?**
- Make sure `admins` table exists
- Try creating a new admin in the `admins` table with email/password

## Next Steps

1. Read [SUPABASE_INTEGRATION.md](./SUPABASE_INTEGRATION.md) for full documentation
2. Customize exam settings in admin dashboard
3. Create some test exams and students
4. Test the full flow from student login to submission

## Need Help?

See the detailed docs in:
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Database setup details
- [SUPABASE_INTEGRATION.md](./SUPABASE_INTEGRATION.md) - Full architecture & API docs
- [README.md](./README.md) - Project overview
