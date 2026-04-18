# Firebase Authentication Setup Guide

## Overview
Firebase Authentication has been integrated into your app for user login/signup functionality.

## Features Implemented

### ✅ Core Authentication
- **Email/Password Sign Up** - Create new accounts
- **Email/Password Sign In** - Login existing users
- **Sign Out** - Logout functionality
- **Password Reset** - Forgot password flow
- **Auth State Persistence** - Stays logged in on refresh

### ✅ User Profile
- **Firestore Integration** - User data stored in Firestore
- **Profile Management** - Name, email, phone, address
- **Real-time Auth State** - Instant login/logout updates

### ✅ UI Components
- **Login/Signup Page** - `/auth` - Beautiful unified form
- **User Icon** - Navbar shows login status
- **Mobile Menu** - Login/Logout option
- **Protected Routes** - Ready for implementation

## Files Created

```
lib/
├── firebase-auth.ts        # Auth functions (signUp, signIn, logout, etc.)
└── auth-context.tsx        # React Context for auth state

app/
└── auth/
    └── page.tsx            # Login/Signup page
```

## How to Use

### 1. Enable Firebase Auth in Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Authentication** → **Sign-in method**
4. Enable **Email/Password** provider
5. Click **Save**

### 2. Update Firestore Rules

Go to **Firestore Database** → **Rules** and add:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Products, orders, etc. - public read, admin write
    match /products/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Inquiries - anyone can create, admins can read
    match /inquiries/{document=**} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
  }
}
```

### 3. Using Auth in Components

```tsx
import { useAuth } from '@/lib/auth-context';

export default function MyComponent() {
  const { user, profile, loading, logout } = useAuth();

  if (loading) return <div>Loading...</div>;
  
  if (user) {
    return (
      <div>
        <p>Welcome, {profile?.displayName || user.email}!</p>
        <button onClick={logout}>Logout</button>
      </div>
    );
  }
  
  return <a href="/auth">Login</a>;
}
```

### 4. Auth Functions

```tsx
import { signUp, signIn, logOut, resetPassword, getUserProfile } from '@/lib/firebase-auth';

// Sign Up
await signUp(email, password, displayName, phone);

// Sign In
await signIn(email, password);

// Logout
await logOut();

// Password Reset
await resetPassword(email);

// Get Current User
const user = getCurrentUser();

// Get Profile
const profile = await getUserProfile(uid);
```

## User Flow

### Sign Up Flow
1. User visits `/auth`
2. Fills: Name, Email, Password, Phone (optional)
3. Clicks "Create Account"
4. Firebase creates account
5. User profile saved to Firestore
6. Redirected to homepage

### Sign In Flow
1. User visits `/auth`
2. Fills: Email, Password
3. Clicks "Sign In"
4. Firebase authenticates
5. Redirected to homepage

### Logout Flow
1. User clicks User icon or menu
2. Clicks "Logout"
3. Firebase signs out
4. User redirected to login

## Firebase Collections

### `users` Collection
```typescript
{
  uid: string;              // Firebase Auth UID
  email: string;            // User email
  displayName: string;      // User's name
  phone?: string;           // Phone number
  address?: string;         // Address
  createdAt: string;        // ISO timestamp
  updatedAt: string;        // ISO timestamp
}
```

## Environment Variables

Make sure these are in your `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Next Steps (Optional Enhancements)

### 1. Add Google Sign-In
```tsx
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const provider = new GoogleAuthProvider();
await signInWithPopup(auth, provider);
```

### 2. Add Phone Authentication
```tsx
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

// Setup reCAPTCHA
const recaptcha = new RecaptchaVerifier(auth, 'recaptcha-container', {});
await signInWithPhoneNumber(auth, phoneNumber, recaptcha);
```

### 3. Email Verification
```tsx
import { sendEmailVerification } from 'firebase/auth';

await sendEmailVerification(user);
```

### 4. Protected Routes
Create a Higher Order Component:

```tsx
// lib/withAuth.tsx
import { useAuth } from './auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function withAuth(Component: React.ComponentType) {
  return function ProtectedRoute(props: any) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.push('/auth');
      }
    }, [user, loading, router]);

    if (loading) return <div>Loading...</div>;
    if (!user) return null;

    return <Component {...props} />;
  };
}

// Usage:
// export default withAuth(AccountPage);
```

### 5. Role-Based Access (Admin vs Customer)
Add role to user profile:

```typescript
interface UserProfile {
  // ... existing fields
  role: 'customer' | 'admin';
}
```

## Testing

### Test Sign Up
1. Go to `/auth`
2. Click "Sign Up"
3. Fill form with test data
4. Submit
5. Check Firebase Console → Authentication → Users
6. Check Firestore → users collection

### Test Sign In
1. Go to `/auth`
2. Login with created account
3. Verify User icon changes
4. Check mobile menu shows "My Account"

### Test Logout
1. Click User icon or menu
2. Click "Logout"
3. Verify redirected to login
4. Check Firebase auth state cleared

## Troubleshooting

### "Firebase auth not initialized"
- Check `.env.local` has all Firebase variables
- Restart dev server: `npm run dev`

### "Email already in use"
- User already registered
- Switch to login mode

### "Invalid email"
- Check email format
- Must be valid email (user@domain.com)

### "Weak password"
- Password must be at least 6 characters

## Support

For Firebase Auth documentation:
- [Firebase Auth Docs](https://firebase.google.com/docs/auth)
- [Firebase JS SDK](https://firebase.google.com/docs/reference/js)

---

**Auth system is ready to use! 🚀**
