/**
 * Capacitor native BLE implementation (Android/iOS app).
 */

import { BleClient } from "@capacitor-community/bluetooth-le";

const DEFAULT_DEVICE_NAME_PREFIX = "SoleSense";
const BATTERY_SERVICE = "0000180f-0000-1000-8000-00805f9b34fb";
const GENERIC_ACCESS = "00001800-0000-1000-8000-00805f9b34fb";

export interface BLEDeviceInfoNative {
  id: string;
  name: string;
  nativeDeviceId: string;
}

export type RequestDeviceOptions = {
  namePrefix?: string;
  optionalServices?: string[];
};

let initialized = false;
let initializationPromise: Promise<void> | null = null;

async function ensureInitialized(): Promise<void> {
  if (initialized) return;
  if (initializationPromise) return initializationPromise;
  
  initializationPromise = (async () => {
    try {
      await BleClient.initialize({ androidNeverForLocation: true });
      initialized = true;
      console.log("[BLE] Capacitor BLE initialized successfully");
    } catch (error) {
      console.error("[BLE] Failed to initialize Capacitor BLE:", error);
      initialized = false;
      initializationPromise = null;
      throw error;
    }
  })();
  
  return initializationPromise;
}

export function isBLEAvailable(): boolean {
  return true;
}

export async function getBLEAvailability(): Promise<boolean> {
  try {
    await ensureInitialized();
    const enabled = await BleClient.isEnabled();
    console.log("[BLE] Bluetooth enabled:", enabled);
    return enabled;
  } catch (error) {
    console.error("[BLE] Error checking availability:", error);
    return false;
  }
}

export async function requestDevice(options: RequestDeviceOptions = {}): Promise<BLEDeviceInfoNative> {
  try {
    await ensureInitialized();
    const { namePrefix = DEFAULT_DEVICE_NAME_PREFIX, optionalServices = [BATTERY_SERVICE, GENERIC_ACCESS] } = options;
    const requestOptions: { namePrefix?: string; optionalServices?: string[]; services?: string[] } = {
      optionalServices,
    };
    if (namePrefix) {
      requestOptions.namePrefix = namePrefix;
    }
    console.log("[BLE] Requesting device with options:", requestOptions);
    const device = await BleClient.requestDevice(requestOptions);
    console.log("[BLE] Device selected:", device.deviceId, device.name);
    return {
      id: device.deviceId,
      name: device.name ?? "Unknown Device",
      nativeDeviceId: device.deviceId,
    };
  } catch (error) {
    console.error("[BLE] Error requesting device:", error);
    throw error;
  }
}

export async function connectToDevice(
  info: BLEDeviceInfoNative,
  onDisconnect?: () => void
): Promise<void> {
  await ensureInitialized();
  await BleClient.connect(info.nativeDeviceId, onDisconnect ? () => onDisconnect() : undefined);
}

export function disconnectDevice(info: BLEDeviceInfoNative): void {
  BleClient.disconnect(info.nativeDeviceId).catch(() => {});
}

export function onDeviceDisconnected(_info: BLEDeviceInfoNative, _callback: () => void): () => void {
  return () => {};
}
