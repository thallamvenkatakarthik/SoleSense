/**
 * Web Bluetooth API implementation (browser only).
 */

const DEFAULT_DEVICE_NAME_PREFIX = "SoleSense";
const BATTERY_SERVICE = "battery_service";
const GENERIC_ACCESS = "generic_access";

export interface BLEDeviceInfoWeb {
  id: string;
  name: string;
  device: BluetoothDevice;
}

export type RequestDeviceOptions = {
  namePrefix?: string;
  optionalServices?: BluetoothServiceUUID[];
};

export function isBLEAvailable(): boolean {
  return typeof navigator !== "undefined" && "bluetooth" in navigator;
}

export async function getBLEAvailability(): Promise<boolean> {
  if (!isBLEAvailable()) return false;
  try {
    return await (navigator as Navigator & { bluetooth: Bluetooth }).bluetooth.getAvailability();
  } catch {
    return false;
  }
}

export async function requestDevice(options: RequestDeviceOptions = {}): Promise<BLEDeviceInfoWeb> {
  if (!isBLEAvailable()) {
    throw new Error("Bluetooth is not supported in this browser. Use Chrome, Edge, or another supported browser.");
  }
  const { namePrefix = DEFAULT_DEVICE_NAME_PREFIX, optionalServices = [BATTERY_SERVICE, GENERIC_ACCESS] } = options;
  const bluetooth = (navigator as Navigator & { bluetooth: Bluetooth }).bluetooth;
  const requestOptions: BluetoothRequestDeviceOptions = {
    optionalServices,
    ...(namePrefix ? { filters: [{ namePrefix }] } : { acceptAllDevices: true }),
  };
  const device = await bluetooth.requestDevice(requestOptions);
  return { id: device.id, name: device.name ?? "Unknown Device", device };
}

export async function connectToDevice(
  info: BLEDeviceInfoWeb,
  _onDisconnect?: () => void
): Promise<void> {
  if (!info.device.gatt) throw new Error("Device has no GATT server.");
  await info.device.gatt.connect();
}

export function disconnectDevice(info: BLEDeviceInfoWeb): void {
  if (info.device.gatt?.connected) info.device.gatt.disconnect();
}

export function onDeviceDisconnected(info: BLEDeviceInfoWeb, callback: () => void): () => void {
  const handler = () => callback();
  info.device.addEventListener("gattserverdisconnected", handler);
  return () => info.device.removeEventListener("gattserverdisconnected", handler);
}
