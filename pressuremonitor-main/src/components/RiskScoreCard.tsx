import { motion } from "framer-motion";
import { Shield, AlertTriangle, AlertOctagon } from "lucide-react";
import { getRiskLevel, getRiskLabel, type RiskLevel } from "@/lib/mock-data";

interface RiskScoreCardProps {
  score: number;
}

const riskConfig: Record<RiskLevel, { icon: typeof Shield; bgClass: string; textClass: string; ringClass: string }> = {
  safe: { icon: Shield, bgClass: "bg-safe-bg", textClass: "text-safe", ringClass: "ring-safe/20" },
  moderate: { icon: AlertTriangle, bgClass: "bg-warning-bg", textClass: "text-warning", ringClass: "ring-warning/20" },
  high: { icon: AlertOctagon, bgClass: "bg-danger-bg", textClass: "text-danger", ringClass: "ring-danger/20" },
};

export default function RiskScoreCard({ score }: RiskScoreCardProps) {
  const level = getRiskLevel(score);
  const config = riskConfig[level];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl p-4 ${config.bgClass} ring-1 ${config.ringClass}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${config.textClass} bg-white/60`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Risk Status</p>
            <p className={`text-lg font-bold font-display ${config.textClass}`}>
              {getRiskLabel(level)}
            </p>
          </div>
        </div>
        <div className={`text-3xl font-bold font-display ${config.textClass}`}>
          {score}
        </div>
      </div>
    </motion.div>
  );
}
