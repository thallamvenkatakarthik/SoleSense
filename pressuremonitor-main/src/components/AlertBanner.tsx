import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";
import type { Alert } from "@/lib/mock-data";

interface AlertBannerProps {
  alert: Alert;
}

export default function AlertBanner({ alert }: AlertBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-danger-bg border border-danger/20 rounded-2xl p-4 overflow-hidden"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-danger/10">
              <AlertTriangle className="w-4 h-4 text-danger" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-danger">Overpressure Alert</p>
              <p className="text-xs text-muted-foreground mt-0.5">{alert.message}</p>
            </div>
            <button onClick={() => setDismissed(true)} className="p-1 rounded-lg hover:bg-danger/10 transition-colors">
              <X className="w-4 h-4 text-danger" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
