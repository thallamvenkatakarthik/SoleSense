# Building the Android app (APK)

This project uses **Capacitor** so you can build a real Android app that uses **native Bluetooth** to scan and pair with BLE devices (e.g. SoleSense). The same code runs in the browser (Web Bluetooth) and in the app (native BLE).

## Prerequisites

- **Node.js** and **npm** (already used for the web app)
- **Android Studio** (for building the APK and running an emulator or device)
- **JDK 17** (Android Studio usually installs this)

## Build and run on Android

1. **Build the web app and sync to Android**
   ```bash
   npm run cap:sync
   ```
   This runs `npm run build` and then copies the built app into the `android` folder.

2. **Open the Android project**
   ```bash
   npm run android
   ```
   This opens the `android` project in Android Studio.

3. **In Android Studio**
   - Connect a physical Android device (with USB debugging) or start an emulator.
   - Click **Run** (green play button) to build and install the app.
   - The first build can take a few minutes.

4. **Get an APK to install elsewhere**
   - In Android Studio: **Build → Build Bundle(s) / APK(s) → Build APK(s)**.
   - The APK is generated at:  
     `android/app/build/outputs/apk/debug/app-debug.apk`  
   - You can copy this file to other Android devices and install it (enable “Install from unknown sources” if needed).

## Bluetooth in the app

- **In the browser:** The connect screen uses the **Web Bluetooth API** (Chrome/Edge, HTTPS or localhost).
- **In the Android app:** The connect screen uses the **native BLE plugin** (`@capacitor-community/bluetooth-le`), so scanning and pairing use the phone’s real Bluetooth hardware.

No code changes are needed when switching between web and app; the right implementation is chosen automatically.

## Useful commands

| Command           | Description                                      |
|-------------------|--------------------------------------------------|
| `npm run cap:sync`| Build web app and sync to `android` (run after code changes). |
| `npm run android` | Open the Android project in Android Studio.     |
| `npx cap sync`    | Sync only (no build). Use after `npm run build`. |

## Optional: release APK

For a signed release APK (e.g. for Play Store or sharing):

1. In Android Studio: **Build → Generate Signed Bundle / APK**.
2. Create or use a keystore and follow the wizard.

You can also configure signing in `android/app/build.gradle` and then build from the command line.
