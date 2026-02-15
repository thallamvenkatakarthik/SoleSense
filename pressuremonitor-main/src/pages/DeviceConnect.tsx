import { motion } from "framer-motion";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bluetooth, Loader2, CheckCircle2, Smartphone, AlertCircle } from "lucide-react";
import { useBLE } from "@/hooks/use-ble";
import { Button } from "@/components/ui/button";

type ConnectState = "idle" | "scanning" | "connecting" | "connected" | "error" | "unavailable";

export default function DeviceConnect() {
  const { status, deviceInfo, error, available, startPairing, clearError } = useBLE();
  const navigate = useNavigate();

  useEffect(() => {
    if (status === "connected") {
      const t = setTimeout(() => navigate("/dashboard"), 1500);
      return () => clearTimeout(t);
    }
  }, [status, navigate]);

  const state: ConnectState = status;

  return (
    <div className="min-h-screen flex flex-col items-center justify-between px-6 py-12 safe-area-top safe-area-bottom bg-background">
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm">
        <motion.div
          animate={state === "scanning" || state === "connecting" ? { scale: [1, 1.1, 1] } : {}}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className={`w-28 h-28 rounded-full flex items-center justify-center mb-8 transition-colors duration-500 ${
            state === "connected"
              ? "bg-safe-bg"
              : state === "scanning" || state === "connecting"
              ? "bg-primary/10"
              : state === "error" || state === "unavailable"
              ? "bg-destructive/10"
              : "bg-muted"
          }`}
        >
          {state === "connected" ? (
            <CheckCircle2 className="w-14 h-14 text-safe" />
          ) : state === "scanning" || state === "connecting" ? (
            <Loader2 className="w-14 h-14 text-primary animate-spin" />
          ) : state === "error" || state === "unavailable" ? (
            <AlertCircle className="w-14 h-14 text-destructive" />
          ) : (
            <Bluetooth className="w-14 h-14 text-muted-foreground" />
          )}
        </motion.div>

        <h1 className="text-2xl font-bold font-display text-foreground mb-2">
          {state === "idle" && "Pair Your Device"}
          {state === "scanning" && "Scanning..."}
          {state === "connecting" && "Connecting..."}
          {state === "connected" && "Connected!"}
          {(state === "error" || state === "unavailable") && "Connection issue"}
        </h1>
        <p className="text-sm text-muted-foreground text-center max-w-xs">
          {state === "idle" &&
            "Place your SoleSense slipper nearby and ensure Bluetooth is enabled. Then tap Start Pairing."}
          {state === "scanning" && "Choose your device from the list (your system is scanning for BLE devices)."}
          {state === "connecting" && "Establishing secure connection..."}
          {state === "connected" && "Your SoleSense Pro is ready to use."}
          {state === "unavailable" &&
            "Web Bluetooth is not available. Use Chrome or Edge over HTTPS or localhost."}
          {state === "error" && (error ?? "Something went wrong.")}
        </p>

        {error && state === "error" && (
          <p className="mt-2 text-xs text-destructive text-center max-w-xs" role="alert">
            {error}
          </p>
        )}

        {/* Discovered device */}
        {(state === "connecting" || state === "connected") && deviceInfo && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 w-full bg-card rounded-2xl p-4 border border-border flex items-center gap-3"
          >
            <div className="p-2.5 rounded-xl bg-primary/10">
              <Smartphone className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-card-foreground">{deviceInfo.name}</p>
              <p className="text-[10px] text-muted-foreground">{deviceInfo.id || "BLE device"}</p>
            </div>
            {state === "connected" && (
              <div className="px-2.5 py-1 rounded-full bg-safe-bg">
                <span className="text-[10px] font-semibold text-safe">Paired</span>
              </div>
            )}
          </motion.div>
        )}
      </div>

      <div className="w-full max-w-sm space-y-2">
        {state === "idle" && (
          <Button
            onClick={() => startPairing()}
            disabled={available === false}
            className="w-full py-4 rounded-2xl font-semibold font-display text-base flex items-center justify-center gap-2"
          >
            <Bluetooth className="w-4 h-4" />
            Start Pairing
          </Button>
        )}
        {(state === "error" || state === "unavailable") && (
          <Button
            onClick={() => {
              clearError();
              if (state === "error") startPairing();
            }}
            variant="outline"
            className="w-full py-4 rounded-2xl font-semibold"
          >
            {state === "unavailable" ? "OK" : "Try again"}
          </Button>
        )}
        {state === "idle" && available === false && (
          <p className="text-xs text-muted-foreground text-center">
            Bluetooth not available in this browser. Use Chrome or Edge on HTTPS or localhost.
          </p>
        )}
      </div>
    </div>
  );
}
