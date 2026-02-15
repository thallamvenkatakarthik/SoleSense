/**
 * Unified BLE layer: Web Bluetooth in browser, Capacitor native BLE in the app (APK).
 * Native module is loaded only when running inside the app to avoid browser errors.
 */

import { Capacitor } from "@capacitor/core";
import * as WebBLE from "./ble-web";

export type BLEDeviceInfo = (WebBLE.BLEDeviceInfoWeb & { nativeDeviceId?: string }) | {
  id: string;
  name: string;
  nativeDeviceId: string;
  device?: BluetoothDevice;
};

export interface BLEConnectionState {
  device: BLEDeviceInfo | null;
  connected: boolean;
}

export type RequestDeviceOptions = {
  namePrefix?: string;
  optionalServices?: BluetoothServiceUUID[] | string[];
};

function isNative(): boolean {
  try {
    return Capacitor.isNativePlatform();
  } catch {
    return false;
  }
}

export function isBLEAvailable(): boolean {
  if (isNative()) return true;
  return WebBLE.isBLEAvailable();
}

export async function getBLEAvailability(): Promise<boolean> {
  if (isNative()) {
    try {
      const NativeBLE = await import("./ble-native");
      return NativeBLE.getBLEAvailability();
    } catch {
      return false;
    }
  }
  return WebBLE.getBLEAvailability();
}

export async function requestDevice(options: RequestDeviceOptions = {}): Promise<BLEDeviceInfo> {
  if (isNative()) {
    const NativeBLE = await import("./ble-native");
    const opts = { namePrefix: options.namePrefix, optionalServices: options.optionalServices as string[] | undefined };
    return NativeBLE.requestDevice(opts);
  }
  return WebBLE.requestDevice(options as WebBLE.RequestDeviceOptions);
}

export async function connectToDevice(info: BLEDeviceInfo, onDisconnect?: () => void): Promise<void> {
  if (isNative() && "nativeDeviceId" in info) {
    const NativeBLE = await import("./ble-native");
    return NativeBLE.connectToDevice(info, onDisconnect);
  }
  if ("device" in info && info.device) {
    return WebBLE.connectToDevice(info, onDisconnect);
  }
  throw new Error("Invalid device info");
}

export function disconnectDevice(info: BLEDeviceInfo): void {
  if (isNative() && "nativeDeviceId" in info) {
    import("./ble-native").then((NativeBLE) => NativeBLE.disconnectDevice(info));
    return;
  }
  if ("device" in info && info.device) {
    WebBLE.disconnectDevice(info);
  }
}

export function onDeviceDisconnected(info: BLEDeviceInfo, callback: () => void): () => void {
  if (isNative() && "nativeDeviceId" in info) {
    return () => {};
  }
  if ("device" in info && info.device) {
    return WebBLE.onDeviceDisconnected(info, callback);
  }
  return () => {};
}
