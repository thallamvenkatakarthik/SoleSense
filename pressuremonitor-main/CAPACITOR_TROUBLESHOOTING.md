# Capacitor App Troubleshooting Guide

## Common Issues and Solutions

### 1. **App Shows White Screen**

**Symptoms:** App opens but shows only a white/blank screen.

**Solutions:**
- Check browser console (if using Chrome DevTools remote debugging)
- Look for JavaScript errors in `adb logcat`:
  ```bash
  adb logcat | grep -i "chromium\|console\|error"
  ```
- Ensure you've run `npm run cap:sync` after making code changes
- Rebuild the app: `npm run build && npx cap sync`

### 2. **Bluetooth Not Working / "Bluetooth not available"**

**Symptoms:** App says Bluetooth is unavailable or scanning fails.

**Check:**
1. **Permissions:** Ensure AndroidManifest.xml has Bluetooth permissions (already added)
2. **Runtime Permissions:** On Android 12+, the app must request runtime permissions:
   - The BLE plugin should handle this automatically when you call `BleClient.initialize()`
   - If not, check that your device's Bluetooth is enabled
3. **Location Services:** On Android < 12, location might be required (we use `neverForLocation` flag for Android 12+)

**Debug:**
- Check logs: `adb logcat | grep -i "bluetooth\|ble"`
- Look for permission errors
- Try enabling Bluetooth manually in device settings first

### 3. **"Unable to launch Android Studio"**

**Solution:**
- Install Android Studio from https://developer.android.com/studio
- Or set the path manually:
  ```powershell
  $env:CAPACITOR_ANDROID_STUDIO_PATH = "C:\Program Files\Android\Android Studio\bin\studio64.exe"
  ```
- Or open Android Studio manually and open the `android` folder

### 4. **Build Errors**

**Common fixes:**
- Clean build: In Android Studio, **Build → Clean Project**, then **Build → Rebuild Project**
- Sync Gradle: **File → Sync Project with Gradle Files**
- Check `android/gradle.properties` for any issues
- Ensure Java/JDK is installed (Android Studio includes it)

### 5. **BLE Scanning Shows No Devices**

**Check:**
- Your BLE device is powered on and advertising
- Device name matches the filter (default: "SoleSense")
- Try removing `namePrefix` filter to see all devices:
  ```typescript
  startPairing({ namePrefix: undefined })
  ```
- Check device logs for BLE errors

### 6. **App Crashes on Startup**

**Debug:**
- Check crash logs: `adb logcat | grep -i "fatal\|exception\|crash"`
- Look for JavaScript errors in the error boundary (should show "Something went wrong" screen)
- Check that all Capacitor plugins are synced: `npx cap sync`

## Debugging Commands

```bash
# View all logs
adb logcat

# Filter for your app
adb logcat | grep "com.pressuremonitor.app"

# Filter for JavaScript/React errors
adb logcat | grep -i "chromium\|console"

# Filter for Bluetooth
adb logcat | grep -i "bluetooth\|ble"

# Clear logs and start fresh
adb logcat -c && adb logcat
```

## Testing Checklist

- [ ] App builds without errors (`npm run build`)
- [ ] Capacitor sync completes (`npx cap sync`)
- [ ] Android Studio opens the project
- [ ] App installs on device/emulator
- [ ] App shows UI (not white screen)
- [ ] Bluetooth permissions are granted (check in device Settings → Apps → Pressure Monitor → Permissions)
- [ ] BLE scanning works
- [ ] Device connection works

## Getting Help

If issues persist:
1. Check the browser console (if using remote debugging)
2. Check `adb logcat` for native errors
3. Look for error messages in the app's error boundary
4. Verify all permissions are granted in device settings
