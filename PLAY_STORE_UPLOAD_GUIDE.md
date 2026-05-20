# Google Play Store Upload Guide for Shreeshyam Mobiles

This guide outlines the steps required to upload your newly generated Android App Bundle (`app-release-bundle.aab`) to the Google Play Store.

---

## 🔑 Crucial App Credentials & Fingerprints
The App Bundle has been signed with the local keystore in your project root. Keep these credentials safe, as they are required for uploading and verifying the app.

| Item | Details |
| :--- | :--- |
| **Keystore File** | `android/android.keystore` |
| **Key Alias** | `android` |
| **Keystore Password** | `123456` |
| **Key Password** | `123456` |
| **SHA256 Fingerprint** | `99:1D:F0:B2:30:C4:8C:70:77:B2:61:8E:1B:71:5D:99:5A:32:74:88:0B:B4:9A:C1:AC:5D:99:B5:C9:7B:FA:CA` |

> [!CAUTION]
> **DO NOT LOSE `android/android.keystore`!**  
> If you lose this keystore file or forget the passwords, you will **never** be able to update your app on the Google Play Store again. Back it up in a secure, private cloud folder (e.g., Google Drive, OneDrive) immediately.

---

## 🌐 How Trusted Web Activity (TWA) Works
Because this is a TWA, your Android app acts as a secure container for your Netlify web app (`https://shreeshyammobilescom.netlify.app`).

1. We have configured the SHA256 signature inside the app manifest and pushed the corresponding `assetlinks.json` file to your Netlify website at:
   `https://shreeshyammobilescom.netlify.app/.well-known/assetlinks.json`
2. When users download the app from Google Play, Android will check your Netlify website's `assetlinks.json` file.
3. Because the SHA256 signatures match, Android will **hide the browser URL address bar** at the top, making your web store look and feel like a native Android app!

---

## 🚀 Step-by-Step Submission Guide

### Step 1: Create a Google Play Console Account
1. Visit the [Google Play Console](https://play.google.com/console/signup).
2. Sign in with a Google account and register as a developer (requires a one-time **$25 registration fee**).
3. Complete your identity verification as prompted by Google.

### Step 2: Create a New App
1. Inside the Play Console, click the **Create app** button in the top right.
2. Fill in the initial details:
   - **App name**: `Shreeshyam Mobiles`
   - **Default language**: `English (United States)` (or your preferred default)
   - **App or game**: `App`
   - **Free or paid**: `Free`
3. Accept the declarations and click **Create app** at the bottom.

### Step 3: Complete App Setup Tasks
On the Dashboard, Google will present a list of tasks under **"Set up your app"**. You must complete all of them before submitting:
- Set privacy policy URL (you can link to a privacy policy page on your website).
- Declare target audience age (e.g., 13 and older, or 18 and older).
- Answer the content rating questionnaire.
- Fill out data safety declarations (select that the app transmits data over HTTPS but doesn't share personal user data with third parties unless required for checkout).

### Step 4: Set Up Play App Signing
When you upload an app for the first time, Google Play will ask about App Signing:
1. Google Play Console uses **Play App Signing** by default.
2. Select **Use Google-managed key** (default).
3. Google will manage the deployment key, and your local `android.keystore` acts as the **upload key**. When you upload your `.aab`, Google will verify it against your local signature and resign it with the store key.

### Step 5: Upload your App Bundle (`.aab`)
1. On the left sidebar, scroll down to **Release** and select **Production** (or **Internal testing** if you want to test with a small group first).
2. Click **Create new release** in the top right.
3. In the **App bundles** section, upload the file:
   `d:\downloadss\shreeshyam mobiles\android\app-release-bundle.aab` (or `d:\downloadss\shreeshyam mobiles\app-release-bundle.aab` if using the existing one)
4. The console will automatically parse the file and fill in the **Version name** (currently `3`) and **Version code** (currently `3`).
5. Write your **Release notes** (e.g., "Initial release of the Shreeshyam Mobiles storefront app").
6. Click **Save** and then **Review release**.

### Step 6: Configure Store Presence (Graphics & Listings)
Go to **Grow** -> **Store presence** -> **Main store listing** on the left menu:
- **Short description**: A brief summary of your shop (up to 80 characters).
- **Full description**: Detailed description highlighting your products, UPI payment options, and mobile store catalog.
- **Graphics**:
  - **App Icon**: Must be exactly `512x512` pixels, PNG.
  - **Feature Graphic**: Must be exactly `1024x500` pixels, JPG or PNG.
  - **Phone Screenshots**: Upload at least 2-4 screenshots of your store homepage, cart page, and checkout page. You can take these using a phone or in a browser emulator.

### Step 7: Publish
1. Once all checkmarks under the setup menu are green, go back to the **Production** release page.
2. Click **Start rollout to Production** to submit your app for review.
3. Google usually reviews new developer accounts and apps within **3 to 7 days**. Once approved, your app will be live on the Google Play Store!
