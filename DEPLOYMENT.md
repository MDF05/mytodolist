# Deployment Guide

This guide covers how to build and deploy **MDF Note** using **Expo Application Services (EAS)**.

## Prerequisites

1.  **Expo Account:** Create one at [expo.dev](https://expo.dev).
2.  **EAS CLI:** Install globally.
    ```bash
    npm install -g eas-cli
    ```
3.  **Login:**
    ```bash
    eas login
    ```

## Build Lifecycle

### 1. Configuration (`eas.json`)

The project uses `eas.json` to define build profiles.

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "distribution": "store"
    }
  }
}
```

### 2. Creating a Build

#### Android APK (Preview)
To generate an installable APK for testing:

```bash
eas build --platform android --profile preview
```

#### iOS Simulator Build
To generate a build for the iOS Simulator:

```bash
eas build --platform ios --profile development --simulator
```

#### Production (App Store / Play Store)

```bash
eas build --platform all --profile production
```

## Deployment to Stores

### Google Play Store
1.  Run the production build for Android.
2.  Submit via EAS Submit:
    ```bash
    eas submit -p android
    ```
    *Or manually upload the `.aab` file via Google Play Console.*

### Apple App Store
1.  Run the production build for iOS.
2.  Submit via EAS Submit:
    ```bash
    eas submit -p ios
    ```
    *Or manually upload via Transporter app.*

## Web Deployment

To deploy the web version:

1.  **Build:**
    ```bash
    npx expo export
    ```
2.  **Serve:**
    Allowed hostings: Vercel, Netlify, GitHub Pages.
    
    *Example for Vercel:*
    ```bash
    vercel deploy dist/
    ```
