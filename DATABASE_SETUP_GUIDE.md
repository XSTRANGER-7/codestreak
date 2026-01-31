# 🗄️ CodeStreak Database Setup Guide

This guide will help you set up your Supabase database for CodeStreak with proper data persistence and caching.

---

## 📋 Table of Contents

1. [Setup Supabase Database](#setup-supabase-database)
2. [Configure Google OAuth](#configure-google-oauth)
3. [Test the Setup](#test-the-setup)
4. [How Data Persistence Works](#how-data-persistence-works)
5. [Troubleshooting](#troubleshooting)

---

## 🚀 Setup Supabase Database

### Step 1: Create Tables

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: **arzbgxgopkbwnydbvxcf**
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy the entire contents of `supabase-schema.sql` file
6. Paste it into the SQL editor
7. Click **RUN** button (or press Ctrl+Enter)

✅ This will create:
- `user_profiles` - User stats and streak information
- `solved_problems` - Individual problem solutions with timestamps
- `daily_activities` - Daily problem-solving activity
- All necessary indexes for performance
- Row Level Security (RLS) policies
- Automatic user profile creation trigger

### Step 2: Verify Tables Created

1. Go to **Table Editor** in the left sidebar
2. You should see these tables:
   - ✅ `user_profiles`
   - ✅ `solved_problems`
   - ✅ `daily_activities`

3. Click on each table to verify the columns are created correctly

---

## 🔐 Configure Google OAuth (Fix redirect_uri Error)

### Step 1: Get Your Supabase Callback URL

Your Supabase OAuth callback URL is:
```
https://arzbgxgopkbwnydbvxcf.supabase.co/auth/v1/callback
```

### Step 2: Update Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **APIs & Services** → **Credentials**
4. Find your **OAuth 2.0 Client ID** (it might be called "Web client")
5. Click the **Edit** icon (pencil)
6. Under **Authorized redirect URIs**, add these:
   ```
   https://arzbgxgopkbwnydbvxcf.supabase.co/auth/v1/callback
   http://localhost:5173
   http://127.0.0.1:5173
   ```
7. Click **Save**

### Step 3: Configure Google Provider in Supabase

1. Go back to your Supabase Dashboard
2. Click **Authentication** → **Providers** in the left sidebar
3. Find **Google** in the list
4. Toggle it to **Enabled**
5. Enter your Google OAuth credentials:
   - **Client ID**: (from Google Cloud Console)
   - **Client Secret**: (from Google Cloud Console)
6. The **Redirect URL** should already show:
   ```
   https://arzbgxgopkbwnydbvxcf.supabase.co/auth/v1/callback
   ```
7. Click **Save**

---

## ✅ Test the Setup

### 1. Start Your Development Server

```bash
npm run dev
```

### 2. Test Google Login

1. Open http://localhost:5173
2. Click **Sign in with Google**
3. You should be redirected to Google OAuth page (no error!)
4. Sign in with your Google account
5. You'll be redirected back to your app

### 3. Verify Database

After signing in:

1. Go to Supabase Dashboard → **Table Editor**
2. Click on **user_profiles** table
3. You should see your user profile created automatically!
4. Try solving a problem in the app
5. Check **solved_problems** table - your solved problem should appear
6. Check **daily_activities** table - today's activity should be recorded

---

## 🔄 How Data Persistence Works

### Multi-Layer Data Storage

Your app now uses **3 layers** of data storage:

```
┌─────────────────────────────────────┐
│   1. React State (In-Memory)       │  ← Fastest, current session
├─────────────────────────────────────┤
│   2. LocalStorage (Browser Cache)  │  ← Fast, survives refresh
├─────────────────────────────────────┤
│   3. Supabase Database (Cloud)     │  ← Permanent, cross-device
└─────────────────────────────────────┘
```

### Loading Flow (On Page Load/Refresh)

1. **Instant Display**: Load from LocalStorage immediately
2. **Background Sync**: Fetch latest data from Supabase
3. **Update**: Replace cached data with fresh database data
4. **Save**: Update LocalStorage with fresh data

### Saving Flow (When Solving Problems)

1. **Immediate Update**: Update React state instantly
2. **Background Save**: Save to Supabase database (async)
3. **Cache Update**: Update LocalStorage
4. **No Waiting**: User sees instant feedback

### What Gets Stored

#### In `user_profiles` Table:
- Current streak count
- Maximum streak achieved
- Total problems solved
- Coins balance
- Last active date

#### In `solved_problems` Table:
- Each individual problem you solve
- Problem title, difficulty, category
- Time spent on problem
- Coins earned
- Exact timestamp when solved

#### In `daily_activities` Table:
- Date of activity
- Number of problems solved that day
- Categories worked on
- Total time spent that day

---

## 🎯 Key Features

### ✨ Instant Loading
- LocalStorage cache loads immediately
- No blank screens on refresh
- Background sync updates data

### 💾 Automatic Persistence
- Everything auto-saves to database
- No "save" button needed
- Works even if you close the tab

### 🔄 Cross-Device Sync
- Sign in on any device
- Your data follows you
- Always up-to-date

### 📊 Detailed History
- Every solved problem tracked
- Daily activity patterns
- Streak history preserved

---

## 🐛 Troubleshooting

### Problem: "redirect_uri_mismatch" error

**Solution**: 
- Make sure you added the exact callback URL to Google Cloud Console
- URL must be: `https://arzbgxgopkbwnydbvxcf.supabase.co/auth/v1/callback`
- No trailing slash, no extra characters

### Problem: Data not saving

**Check**:
1. Open browser DevTools (F12) → Console
2. Look for error messages
3. Common issues:
   - RLS policies not set up (run SQL schema again)
   - User not authenticated (try signing out and in)

**Fix**:
```sql
-- Re-run this in Supabase SQL Editor
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE solved_problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_activities ENABLE ROW LEVEL SECURITY;
```

### Problem: Data disappears on refresh

**Possible Causes**:
1. Database not connected properly
2. LocalStorage cleared
3. User not signed in

**Debug Steps**:
1. Open DevTools → Application → Local Storage
2. Check for `userStats_<user-id>` key
3. If missing, data isn't being cached

### Problem: User profile not created

**Solution**:
```sql
-- Run this in Supabase SQL Editor to recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Problem: Old schema exists

**Clean Start**:
```sql
-- Run this to drop old tables
DROP TABLE IF EXISTS user_stats CASCADE;
```
Then run the full schema from `supabase-schema.sql`

---

## 📱 Testing Checklist

- [ ] Google login works without errors
- [ ] User profile created in `user_profiles` table
- [ ] Solve a problem → appears in `solved_problems` table
- [ ] Daily activity recorded in `daily_activities` table
- [ ] Refresh page → data persists
- [ ] Check console → no errors
- [ ] LocalStorage has cached data
- [ ] Streak updates correctly
- [ ] Coins are earned and saved

---

## 🎉 You're All Set!

Your CodeStreak app now has:
- ✅ Proper database persistence
- ✅ Fast local caching
- ✅ Cross-device data sync
- ✅ Detailed problem tracking
- ✅ Complete activity history
- ✅ Working Google OAuth

Start solving problems and watch your streak grow! 🚀

---

## 📞 Need Help?

If you encounter issues:
1. Check the browser console for errors
2. Verify Supabase tables exist
3. Check RLS policies are enabled
4. Make sure you're signed in
5. Clear LocalStorage and try again

Happy coding! 💻✨
