# Supabase Configuration Guide

## How to Get the Correct Credentials

### Step 1: Access Your Supabase Project
1. Go to: https://supabase.com/dashboard
2. Select your project (or create a new one if needed)

### Step 2: Get Your API Credentials
1. In your project dashboard, click on the **Settings** icon (⚙️) in the left sidebar
2. Click on **API** from the settings menu
3. You'll see two important values:

#### Project URL
- Look for "Project URL"
- Example: `https://arzbgxgopkbwnydbvxcf.supabase.co`

#### API Keys
- Look for "Project API keys"
- **anon public** key - This is what you need (it's a long JWT token)
- It starts with: `eyJ...` and is very long (around 200+ characters)

### Step 3: Update Your .env File
Replace the values in your `.env` file with the correct ones:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...YOUR_FULL_ANON_KEY
```

### Step 4: Enable Google OAuth Provider
1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Find **Google** in the list and click to expand it
3. Toggle the **Enable Google provider** switch to ON
4. You'll need to add:
   - **Client ID** (from Google Cloud Console)
   - **Client Secret** (from Google Cloud Console)

### Step 5: Set Up Google Cloud Console
1. Go to: https://console.cloud.google.com/
2. Create a new project (or select existing one)
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Choose **Web application**
6. Add Authorized redirect URI:
   ```
   https://arzbgxgopkbwnydbvxcf.supabase.co/auth/v1/callback
   ```
7. Copy the **Client ID** and **Client Secret**
8. Paste them into Supabase Google provider settings

### Step 6: Configure Redirect URLs in Supabase
1. Go to **Authentication** → **URL Configuration**
2. Add these URLs to the **Redirect URLs** list:
   ```
   http://localhost:5173/
   http://localhost:5174/
   ```
3. For production, add your production domain

### Step 7: Restart Your Dev Server
After updating the `.env` file:
```bash
npm run dev
```

## Current Issue
Your current anon key format is incorrect:
- Current: `sb_publishable_xwlgi_D06q-EiEEvI6R3kg_bS0mW2cx`
- Expected: A JWT token starting with `eyJ` (much longer)

Please update your `.env` file with the correct anon key from your Supabase dashboard.
