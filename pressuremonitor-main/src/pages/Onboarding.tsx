import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Footprints, Shield, BarChart3, ArrowRight } from "lucide-react";

const slides = [
  {
    icon: Footprints,
    title: "Smart Pressure Monitoring",
    description: "Real-time plantar pressure tracking with medical-grade accuracy for early risk detection.",
  },
  {
    icon: Shield,
    title: "Instant Alerts",
    description: "Get notified immediately when pressure exceeds safe thresholds to prevent injuries.",
  },
  {
    icon: BarChart3,
    title: "Track Your Progress",
    description: "Detailed analytics and insights help you and your caregiver make informed decisions.",
  },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      navigate("/connect");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between px-6 py-12 safe-area-top safe-area-bottom bg-background">
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center"
          >
            <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-8">
              {(() => {
                const Icon = slides[step].icon;
                return <Icon className="w-10 h-10 text-primary" />;
              })()}
            </div>
            <h1 className="text-2xl font-bold font-display text-foreground mb-3">
              {slides[step].title}
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              {slides[step].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Indicators & Button */}
      <div className="w-full max-w-sm space-y-6">
        <div className="flex items-center justify-center gap-2">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>
        <button
          onClick={handleNext}
          className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-semibold font-display text-base flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          {step < slides.length - 1 ? "Continue" : "Get Started"}
          <ArrowRight className="w-4 h-4" />
        </button>
        {step < slides.length - 1 && (
          <button
            onClick={() => navigate("/connect")}
            className="w-full text-center text-sm text-muted-foreground"
          >
            Skip
          </button>
        )}
      </div>
    </div>
  );
}
