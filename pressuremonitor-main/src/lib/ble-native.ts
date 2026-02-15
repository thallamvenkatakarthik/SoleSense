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

async function ensureInitialized(): Promise<void> {
  if (initialized) return;
  await BleClient.initialize({ androidNeverForLocation: true });
  initialized = true;
}

export function isBLEAvailable(): boolean {
  return true;
}

export async function getBLEAvailability(): Promise<boolean> {
  try {
    await ensureInitialized();
    return await BleClient.isEnabled();
  } catch {
    return false;
  }
}

export async function requestDevice(options: RequestDeviceOptions = {}): Promise<BLEDeviceInfoNative> {
  await ensureInitialized();
  const { namePrefix = DEFAULT_DEVICE_NAME_PREFIX, optionalServices = [BATTERY_SERVICE, GENERIC_ACCESS] } = options;
  const requestOptions: { namePrefix?: string; optionalServices?: string[]; services?: string[] } = {
    optionalServices,
  };
  if (namePrefix) {
    requestOptions.namePrefix = namePrefix;
  }
  const device = await BleClient.requestDevice(requestOptions);
  return {
    id: device.deviceId,
    name: device.name ?? "Unknown Device",
    nativeDeviceId: device.deviceId,
  };
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
