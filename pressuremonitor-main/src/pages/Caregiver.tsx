import { motion } from "framer-motion";
import { User, Activity, AlertCircle, BatteryMedium, Clock, Wifi } from "lucide-react";
import { mockDevice, mockAlerts, mockCurrentReading, computeRiskScore, getRiskLevel, getRiskLabel } from "@/lib/mock-data";

export default function Caregiver() {
  const riskScore = computeRiskScore(mockCurrentReading.heel, mockCurrentReading.forefoot);
  const level = getRiskLevel(riskScore);
  const lastAlert = mockAlerts[0];

  const statusColor = {
    safe: "bg-safe-bg text-safe",
    moderate: "bg-warning-bg text-warning",
    high: "bg-danger-bg text-danger",
  }[level];

  return (
    <div className="px-4 pt-6 safe-area-top space-y-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-xl font-bold font-display text-foreground">Caregiver</h1>
        <p className="text-xs text-muted-foreground">Patient overview</p>
      </motion.div>

      {/* Patient Card */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-2xl p-5 border border-border shadow-sm"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
            <User className="w-6 h-6 text-accent-foreground" />
          </div>
          <div className="flex-1">
            <h2 className="text-base font-bold font-display text-card-foreground">John Doe</h2>
            <p className="text-xs text-muted-foreground">Patient ID: P-2024-0392</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
            {getRiskLabel(level)}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Current Risk", value: `${riskScore}/100`, icon: Activity },
            { label: "Alerts Today", value: `${mockAlerts.length}`, icon: AlertCircle },
            { label: "Battery", value: `${mockDevice.batteryLevel}%`, icon: BatteryMedium },
            { label: "Last Sync", value: "Just now", icon: Clock },
          ].map((item, i) => (
            <div key={i} className="bg-muted/50 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <item.icon className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] font-medium text-muted-foreground">{item.label}</span>
              </div>
              <span className="text-sm font-bold font-display text-card-foreground">{item.value}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Device Health */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-card rounded-2xl p-4 border border-border shadow-sm"
      >
        <div className="flex items-center gap-2 mb-3">
          <Wifi className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold font-display text-card-foreground">Device Health</h2>
        </div>
        <div className="space-y-3">
          {[
            { label: "Device", value: mockDevice.deviceName },
            { label: "Serial", value: mockDevice.serialNumber },
            { label: "Firmware", value: `v${mockDevice.firmwareVersion}` },
            { label: "Status", value: mockDevice.connected ? "Online" : "Offline" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
              <span className="text-xs text-muted-foreground">{item.label}</span>
              <span className="text-xs font-medium text-card-foreground">{item.value}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Last Alert */}
      {lastAlert && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-danger-bg rounded-2xl p-4 border border-danger/20"
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-danger" />
            <h2 className="text-sm font-semibold font-display text-danger">Last Alert</h2>
          </div>
          <p className="text-xs text-card-foreground">{lastAlert.message}</p>
          <p className="text-[10px] text-muted-foreground mt-1">
            {Math.round((Date.now() - lastAlert.timestamp.getTime()) / 60000)} minutes ago
          </p>
        </motion.div>
      )}
    </div>
  );
}
