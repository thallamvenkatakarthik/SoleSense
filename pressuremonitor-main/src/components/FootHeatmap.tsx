import { motion } from "framer-motion";

interface FootHeatmapProps {
  heelPressure: number;
  forefootPressure: number;
}

function pressureColor(value: number): string {
  if (value < 35) return "hsl(var(--safe))";
  if (value < 55) return "hsl(var(--warning))";
  return "hsl(var(--danger))";
}

function pressureOpacity(value: number): number {
  return Math.min(1, 0.4 + (value / 100) * 0.6);
}

export default function FootHeatmap({ heelPressure, forefootPressure }: FootHeatmapProps) {
  return (
    <div className="relative w-40 h-64 mx-auto">
      {/* Foot outline SVG */}
      <svg viewBox="0 0 120 200" className="w-full h-full" fill="none">
        {/* Foot outline */}
        <path
          d="M60 8 C35 8, 20 25, 18 50 C16 75, 20 100, 22 120 C24 140, 20 155, 20 170 C20 185, 30 195, 45 195 C50 195, 55 192, 60 192 C65 192, 70 195, 75 195 C90 195, 100 185, 100 170 C100 155, 96 140, 98 120 C100 100, 104 75, 102 50 C100 25, 85 8, 60 8Z"
          stroke="hsl(var(--border))"
          strokeWidth="2"
          fill="hsl(var(--card))"
        />

        {/* Forefoot zone (toes/ball area) */}
        <motion.ellipse
          cx="55"
          cy="42"
          rx="28"
          ry="22"
          fill={pressureColor(forefootPressure)}
          initial={{ opacity: 0 }}
          animate={{ opacity: pressureOpacity(forefootPressure) }}
          transition={{ duration: 0.8 }}
        />
        
        {/* Midfoot zone */}
        <motion.ellipse
          cx="58"
          cy="100"
          rx="18"
          ry="30"
          fill={pressureColor((heelPressure + forefootPressure) / 2)}
          initial={{ opacity: 0 }}
          animate={{ opacity: pressureOpacity((heelPressure + forefootPressure) / 2) * 0.4 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        />

        {/* Heel zone */}
        <motion.ellipse
          cx="60"
          cy="162"
          rx="24"
          ry="22"
          fill={pressureColor(heelPressure)}
          initial={{ opacity: 0 }}
          animate={{ opacity: pressureOpacity(heelPressure) }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />

        {/* Toe indicators */}
        {[30, 40, 50, 60, 68].map((x, i) => (
          <motion.circle
            key={i}
            cx={x}
            cy={14 + Math.abs(i - 2) * 2}
            r={i === 0 ? 6 : 4.5}
            fill={pressureColor(forefootPressure)}
            initial={{ opacity: 0 }}
            animate={{ opacity: pressureOpacity(forefootPressure) * 0.7 }}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.05 }}
          />
        ))}
      </svg>

      {/* Pressure labels */}
      <div className="absolute top-6 -right-2 text-[10px] font-medium text-muted-foreground">
        {forefootPressure} kPa
      </div>
      <div className="absolute bottom-6 -right-2 text-[10px] font-medium text-muted-foreground">
        {heelPressure} kPa
      </div>
    </div>
  );
}
