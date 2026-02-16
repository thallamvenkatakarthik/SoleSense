import { useState, useCallback, useEffect } from "react";
import {
  requestDevice,
  connectToDevice,
  disconnectDevice,
  onDeviceDisconnected,
  isBLEAvailable,
  getBLEAvailability,
  type BLEDeviceInfo,
  type RequestDeviceOptions,
} from "@/lib/ble";

export type BLEStatus = "idle" | "scanning" | "connecting" | "connected" | "error" | "unavailable";

export interface UseBLEReturn {
  status: BLEStatus;
  deviceInfo: BLEDeviceInfo | null;
  error: string | null;
  available: boolean | null;
  startPairing: (options?: RequestDeviceOptions) => Promise<void>;
  disconnect: () => void;
  clearError: () => void;
}

/**
 * Hook for real BLE: Web Bluetooth in browser, native BLE in Capacitor app (APK).
 */
export function useBLE(): UseBLEReturn {
  const [status, setStatusLocal] = useState<BLEStatus>("idle");
  const [deviceInfo, setDeviceInfoLocal] = useState<BLEDeviceInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [available, setAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    setAvailable(isBLEAvailable());
    getBLEAvailability().then(setAvailable).catch(() => setAvailable(false));
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const disconnect = useCallback(() => {
    if (deviceInfo) {
      disconnectDevice(deviceInfo);
      setDeviceInfoLocal(null);
      setStatusLocal("idle");
      setError(null);
    }
  }, [deviceInfo]);

  useEffect(() => {
    if (!deviceInfo) return;
    if ("device" in deviceInfo && deviceInfo.device) {
      const unsubscribe = onDeviceDisconnected(deviceInfo, () => {
        setStatusLocal("idle");
        setDeviceInfoLocal(null);
      });
      return unsubscribe;
    }
  }, [deviceInfo]);

  const startPairing = useCallback(async (options?: RequestDeviceOptions) => {
    setError(null);
    if (!isBLEAvailable()) {
      setError("Bluetooth is not supported. Use the app (APK) or Chrome/Edge on HTTPS or localhost.");
      setStatusLocal("unavailable");
      return;
    }

    setStatusLocal("scanning");
    try {
      console.log("[BLE Hook] Starting pairing...");
      const info = await requestDevice(options ?? {});
      console.log("[BLE Hook] Device selected:", info);
      setDeviceInfoLocal(info);
      setStatusLocal("connecting");
      const onDisconnect = () => {
        console.log("[BLE Hook] Device disconnected");
        setStatusLocal("idle");
        setDeviceInfoLocal(null);
      };
      await connectToDevice(info, onDisconnect);
      console.log("[BLE Hook] Connected successfully");
      setStatusLocal("connected");
    } catch (err) {
      console.error("[BLE Hook] Pairing error:", err);
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes("canceled") || message.includes("User cancelled") || message.includes("cancel") || message.includes("user canceled")) {
        setStatusLocal("idle");
        setError(null);
      } else {
        setError(message);
        setStatusLocal("error");
      }
    }
  }, []);

  return {
    status,
    deviceInfo,
    error,
    available,
    startPairing,
    disconnect,
    clearError,
  };
}
