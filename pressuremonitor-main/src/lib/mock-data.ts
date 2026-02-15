export type RiskLevel = "safe" | "moderate" | "high";

export interface PressureReading {
  timestamp: Date;
  heel: number;
  forefoot: number;
  balance: number;
}

export interface DeviceStatus {
  connected: boolean;
  batteryLevel: number;
  lastSync: Date;
  firmwareVersion: string;
  deviceName: string;
  serialNumber: string;
}

export interface Alert {
  id: string;
  type: "overpressure" | "imbalance" | "battery" | "disconnect";
  zone: "heel" | "forefoot" | "both";
  severity: RiskLevel;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
}

export interface DailyStats {
  date: string;
  avgHeel: number;
  avgForefoot: number;
  alertCount: number;
  riskScore: number;
}

export const mockDevice: DeviceStatus = {
  connected: true,
  batteryLevel: 78,
  lastSync: new Date(),
  firmwareVersion: "2.1.4",
  deviceName: "SoleSense Pro",
  serialNumber: "SS-2024-0847",
};

export const mockCurrentReading: PressureReading = {
  timestamp: new Date(),
  heel: 42,
  forefoot: 68,
  balance: 62,
};

export const mockAlerts: Alert[] = [
  {
    id: "1",
    type: "overpressure",
    zone: "forefoot",
    severity: "high",
    message: "Forefoot pressure exceeds safe threshold (68 kPa)",
    timestamp: new Date(Date.now() - 5 * 60000),
    acknowledged: false,
  },
  {
    id: "2",
    type: "imbalance",
    zone: "both",
    severity: "moderate",
    message: "Left-right imbalance detected (15% deviation)",
    timestamp: new Date(Date.now() - 30 * 60000),
    acknowledged: true,
  },
  {
    id: "3",
    type: "battery",
    zone: "both",
    severity: "moderate",
    message: "Battery below 20% — charge soon",
    timestamp: new Date(Date.now() - 120 * 60000),
    acknowledged: true,
  },
];

export const mockWeeklyStats: DailyStats[] = [
  { date: "Mon", avgHeel: 35, avgForefoot: 48, alertCount: 0, riskScore: 22 },
  { date: "Tue", avgHeel: 38, avgForefoot: 52, alertCount: 1, riskScore: 35 },
  { date: "Wed", avgHeel: 40, avgForefoot: 55, alertCount: 2, riskScore: 45 },
  { date: "Thu", avgHeel: 36, avgForefoot: 50, alertCount: 0, riskScore: 28 },
  { date: "Fri", avgHeel: 42, avgForefoot: 62, alertCount: 3, riskScore: 58 },
  { date: "Sat", avgHeel: 30, avgForefoot: 44, alertCount: 0, riskScore: 18 },
  { date: "Sun", avgHeel: 42, avgForefoot: 68, alertCount: 1, riskScore: 52 },
];

export function getRiskLevel(score: number): RiskLevel {
  if (score < 35) return "safe";
  if (score < 60) return "moderate";
  return "high";
}

export function getRiskLabel(level: RiskLevel): string {
  switch (level) {
    case "safe": return "Safe";
    case "moderate": return "Moderate";
    case "high": return "High Risk";
  }
}

export function computeRiskScore(heel: number, forefoot: number): number {
  const maxSafe = 50;
  const heelRisk = Math.max(0, ((heel - maxSafe) / maxSafe) * 100);
  const forefootRisk = Math.max(0, ((forefoot - maxSafe) / maxSafe) * 100);
  return Math.min(100, Math.round((heelRisk + forefootRisk) / 2 + Math.abs(heel - forefoot) * 0.5));
}
