import { motion } from "framer-motion";
import { Footprints, Activity, Scale, BatteryMedium, Bluetooth } from "lucide-react";
import FootHeatmap from "@/components/FootHeatmap";
import RiskScoreCard from "@/components/RiskScoreCard";
import MetricCard from "@/components/MetricCard";
import AlertBanner from "@/components/AlertBanner";
import { mockCurrentReading, mockAlerts, mockDevice, computeRiskScore } from "@/lib/mock-data";

export default function Dashboard() {
  const riskScore = computeRiskScore(mockCurrentReading.heel, mockCurrentReading.forefoot);
  const activeAlert = mockAlerts.find((a) => !a.acknowledged);

  return (
    <div className="px-4 pt-6 safe-area-top space-y-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-xl font-bold font-display text-foreground">SoleSense</h1>
          <p className="text-xs text-muted-foreground">Real-time Monitoring</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-safe-bg">
          <Bluetooth className="w-3.5 h-3.5 text-safe" />
          <span className="text-xs font-medium text-safe">Connected</span>
        </div>
      </motion.div>

      {/* Alert */}
      {activeAlert && <AlertBanner alert={activeAlert} />}

      {/* Risk Score */}
      <RiskScoreCard score={riskScore} />

      {/* Foot Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-2xl p-5 border border-border shadow-sm"
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold font-display text-card-foreground">Pressure Map</h2>
          <span className="text-[10px] font-medium text-muted-foreground px-2 py-0.5 bg-muted rounded-full">
            LIVE
          </span>
        </div>
        <FootHeatmap heelPressure={mockCurrentReading.heel} forefootPressure={mockCurrentReading.forefoot} />
        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-4">
          {[
            { label: "Safe", cls: "bg-safe" },
            { label: "Warning", cls: "bg-warning" },
            { label: "Danger", cls: "bg-danger" },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className={`w-2.5 h-2.5 rounded-full ${l.cls}`} />
              <span className="text-[10px] text-muted-foreground">{l.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 gap-3">
        <MetricCard label="Heel" value={mockCurrentReading.heel} unit="kPa" icon={Footprints} delay={0.15} />
        <MetricCard label="Forefoot" value={mockCurrentReading.forefoot} unit="kPa" icon={Activity} delay={0.2} />
        <MetricCard label="Balance" value={mockCurrentReading.balance} unit="%" icon={Scale} delay={0.25} />
        <MetricCard label="Battery" value={mockDevice.batteryLevel} unit="%" icon={BatteryMedium} delay={0.3} />
      </div>
    </div>
  );
}
