# 🚀 Quick Setup: Netlify Environment Variables

## Your Firebase Configuration

Copy these **EXACT** values to Netlify:

### Step 1: Go to Netlify Dashboard
1. Open: https://app.netlify.com
2. Select your site: **shreeshyammobilesscom**
3. Go to: **Site settings** → **Environment variables**

### Step 2: Add These Variables

Click "Add a variable" for each of these:

| Variable Name | Value |
|--------------|-------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIzaSyDcDWq9HncVfpy1yJyV3lNHZWxWWdlCJDI` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `mobile-171f0.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `mobile-171f0` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `mobile-171f0.firebasestorage.app` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `1047128087392` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:1047128087392:web:4be8e09c1a2ac507d55c05` |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | `G-5EMYPJN8G1` |

### Step 3: Redeploy

After adding all variables:
1. Go to: **Deploys** tab
2. Click: **Trigger deploy** → **Deploy site**
3. Wait for deployment to complete (2-3 minutes)

### Step 4: Test

Visit your admin dashboard:
```
https://shreeshyammobilesscom.netlify.app/admin/dashboard
```

You should now see:
- ✅ Stat cards with numbers
- ✅ Quick Actions section
- ✅ Products by Brand
- ✅ Recent Products

## 🔍 Still Having Issues?

### Check if variables are set:
1. In Netlify: **Site settings** → **Environment variables**
2. You should see 7 variables starting with `NEXT_PUBLIC_FIREBASE_`

### Clear cache and redeploy:
1. Go to: **Site settings** → **Build & deploy** → **Build settings**
2. Click: **Clear cache and deploy site**

### Check browser console:
1. Open your deployed site
2. Press **F12** (Developer Tools)
3. Go to **Console** tab
4. Look for any red errors

## 📝 Notes

- These are **public** Firebase config values (safe to expose)
- They're already in your `.env.example` file
- Netlify needs them to build your site with Firebase support
- After adding them, the dashboard will load data from Firebase

## ⚠️ Security Note

The Firebase config shown here is from your `.env.example` file. These are **client-side** configuration values and are meant to be public. However, make sure your Firebase security rules are properly configured to protect your data.
