import { motion } from "framer-motion";
import { Settings, Sliders, Bell, RotateCcw, Info, ChevronRight, Smartphone } from "lucide-react";
import { useState } from "react";
import { mockDevice } from "@/lib/mock-data";

interface SettingItemProps {
  icon: React.ElementType;
  label: string;
  description: string;
  action?: React.ReactNode;
  onClick?: () => void;
}

function SettingItem({ icon: Icon, label, description, action, onClick }: SettingItemProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 w-full p-3.5 rounded-xl hover:bg-muted/50 transition-colors text-left"
    >
      <div className="p-2 rounded-xl bg-accent">
        <Icon className="w-4 h-4 text-accent-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-card-foreground">{label}</p>
        <p className="text-[10px] text-muted-foreground">{description}</p>
      </div>
      {action || <ChevronRight className="w-4 h-4 text-muted-foreground" />}
    </button>
  );
}

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="px-4 pt-6 safe-area-top space-y-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-xl font-bold font-display text-foreground">Settings</h1>
        <p className="text-xs text-muted-foreground">Device & preferences</p>
      </motion.div>

      {/* Device Info */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-2xl p-4 border border-border shadow-sm"
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="p-3 rounded-xl bg-primary/10">
            <Smartphone className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-bold font-display text-card-foreground">{mockDevice.deviceName}</h2>
            <p className="text-[10px] text-muted-foreground">
              {mockDevice.serialNumber} · v{mockDevice.firmwareVersion}
            </p>
          </div>
        </div>
        <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${mockDevice.batteryLevel}%` }}
          />
        </div>
        <p className="text-[10px] text-muted-foreground mt-1">Battery: {mockDevice.batteryLevel}%</p>
      </motion.div>

      {/* Settings List */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-card rounded-2xl border border-border shadow-sm divide-y divide-border"
      >
        <SettingItem
          icon={Sliders}
          label="Pressure Thresholds"
          description="Set safe/warning/danger limits"
        />
        <SettingItem
          icon={Bell}
          label="Notifications"
          description={notifications ? "Alerts enabled" : "Alerts disabled"}
          action={
            <button
              onClick={(e) => {
                e.stopPropagation();
                setNotifications(!notifications);
              }}
              className={`w-10 h-6 rounded-full p-0.5 transition-colors ${
                notifications ? "bg-primary" : "bg-muted"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                  notifications ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          }
        />
        <SettingItem
          icon={RotateCcw}
          label="Recalibrate"
          description="Run guided calibration"
        />
        <SettingItem
          icon={Info}
          label="About"
          description="App version, support"
        />
      </motion.div>
    </div>
  );
}
