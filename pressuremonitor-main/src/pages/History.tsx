import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, LineChart, Line } from "recharts";
import { mockWeeklyStats, mockAlerts } from "@/lib/mock-data";
import { TrendingUp, AlertCircle, Calendar } from "lucide-react";

export default function History() {
  return (
    <div className="px-4 pt-6 safe-area-top space-y-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-xl font-bold font-display text-foreground">History</h1>
        <p className="text-xs text-muted-foreground">Weekly pressure analytics</p>
      </motion.div>

      {/* Pressure Chart */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-2xl p-4 border border-border shadow-sm"
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold font-display text-card-foreground">Pressure Trends</h2>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={mockWeeklyStats} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(195 20% 90%)" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(200 10% 50%)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "hsl(200 10% 50%)" }} axisLine={false} tickLine={false} width={30} />
            <Tooltip
              contentStyle={{
                background: "hsl(0 0% 100%)",
                border: "1px solid hsl(195 20% 90%)",
                borderRadius: "12px",
                fontSize: "12px",
              }}
            />
            <Bar dataKey="avgHeel" fill="hsl(174 62% 38%)" radius={[4, 4, 0, 0]} name="Heel" />
            <Bar dataKey="avgForefoot" fill="hsl(174 40% 70%)" radius={[4, 4, 0, 0]} name="Forefoot" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Risk Score Trend */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-card rounded-2xl p-4 border border-border shadow-sm"
      >
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold font-display text-card-foreground">Risk Score</h2>
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <LineChart data={mockWeeklyStats}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(195 20% 90%)" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(200 10% 50%)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "hsl(200 10% 50%)" }} axisLine={false} tickLine={false} width={30} domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                background: "hsl(0 0% 100%)",
                border: "1px solid hsl(195 20% 90%)",
                borderRadius: "12px",
                fontSize: "12px",
              }}
            />
            <Line type="monotone" dataKey="riskScore" stroke="hsl(174 62% 38%)" strokeWidth={2} dot={{ r: 3, fill: "hsl(174 62% 38%)" }} name="Risk" />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Recent Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card rounded-2xl p-4 border border-border shadow-sm"
      >
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold font-display text-card-foreground">Recent Alerts</h2>
        </div>
        <div className="space-y-3">
          {mockAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`flex items-start gap-3 p-3 rounded-xl ${
                alert.severity === "high" ? "bg-danger-bg" : "bg-warning-bg"
              }`}
            >
              <div className={`w-2 h-2 rounded-full mt-1.5 ${
                alert.severity === "high" ? "bg-danger" : "bg-warning"
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-card-foreground">{alert.message}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {Math.round((Date.now() - alert.timestamp.getTime()) / 60000)} min ago
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
