/**
 * Unified BLE layer: Web Bluetooth in browser, Capacitor native BLE in the app (APK).
 */

import { Capacitor } from "@capacitor/core";
import * as WebBLE from "./ble-web";
import * as NativeBLE from "./ble-native";

export type BLEDeviceInfo = (WebBLE.BLEDeviceInfoWeb & { nativeDeviceId?: string }) | (NativeBLE.BLEDeviceInfoNative & { device?: BluetoothDevice });

export interface BLEConnectionState {
  device: BLEDeviceInfo | null;
  connected: boolean;
}

export type RequestDeviceOptions = {
  namePrefix?: string;
  optionalServices?: BluetoothServiceUUID[] | string[];
};

function isNative(): boolean {
  return Capacitor.isNativePlatform();
}

export function isBLEAvailable(): boolean {
  if (isNative()) return NativeBLE.isBLEAvailable();
  return WebBLE.isBLEAvailable();
}

export async function getBLEAvailability(): Promise<boolean> {
  if (isNative()) return NativeBLE.getBLEAvailability();
  return WebBLE.getBLEAvailability();
}

export async function requestDevice(options: RequestDeviceOptions = {}): Promise<BLEDeviceInfo> {
  const opts = {
    namePrefix: options.namePrefix,
    optionalServices: options.optionalServices as string[] | undefined,
  };
  if (isNative()) return NativeBLE.requestDevice(opts);
  return WebBLE.requestDevice(options as WebBLE.RequestDeviceOptions);
}

export async function connectToDevice(info: BLEDeviceInfo, onDisconnect?: () => void): Promise<void> {
  if (isNative() && "nativeDeviceId" in info) {
    return NativeBLE.connectToDevice(info, onDisconnect);
  }
  if ("device" in info && info.device) {
    return WebBLE.connectToDevice(info, onDisconnect);
  }
  throw new Error("Invalid device info");
}

export function disconnectDevice(info: BLEDeviceInfo): void {
  if (isNative() && "nativeDeviceId" in info) {
    NativeBLE.disconnectDevice(info);
    return;
  }
  if ("device" in info && info.device) {
    WebBLE.disconnectDevice(info);
  }
}

export function onDeviceDisconnected(info: BLEDeviceInfo, callback: () => void): () => void {
  if (isNative() && "nativeDeviceId" in info) {
    return NativeBLE.onDeviceDisconnected(info, callback);
  }
  if ("device" in info && info.device) {
    return WebBLE.onDeviceDisconnected(info, callback);
  }
  return () => {};
}
