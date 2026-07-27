import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SplashScreenProps {
  onDone: () => void;
}

export function SplashScreen({ onDone }: SplashScreenProps) {
  const [percent, setPercent] = useState(0);
  const [phase, setPhase] = useState<"loading" | "done">("loading");

  useEffect(() => {
    // Animate percentage: fast start, slow in middle, fast finish
    const steps = [
      { target: 30, duration: 400 },
      { target: 60, duration: 600 },
      { target: 80, duration: 500 },
      { target: 95, duration: 700 },
      { target: 100, duration: 300 },
    ];

    let current = 0;
    let stepIndex = 0;
    let rafId: number;

    const animate = () => {
      if (stepIndex >= steps.length) return;
      const { target, duration } = steps[stepIndex];
      const start = current;
      const startTime = performance.now();

      const tick = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 2); // ease-out quad
        current = Math.round(start + (target - start) * eased);
        setPercent(current);

        if (progress < 1) {
          rafId = requestAnimationFrame(tick);
        } else {
          stepIndex++;
          if (stepIndex < steps.length) {
            rafId = requestAnimationFrame(animate);
          } else {
            // 100% reached — short pause then exit
            setTimeout(() => setPhase("done"), 500);
          }
        }
      };

      rafId = requestAnimationFrame(tick);
    };

    animate();
    return () => cancelAnimationFrame(rafId);
  }, []);

  useEffect(() => {
    if (phase === "done") {
      const t = setTimeout(onDone, 700);
      return () => clearTimeout(t);
    }
  }, [phase, onDone]);

  return (
    <AnimatePresence>
      {phase === "loading" && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: "#050A14" }}
        >
          {/* ── Grid background ── */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(230,0,0,0.04) 1px, transparent 1px)," +
                "linear-gradient(90deg, rgba(230,0,0,0.04) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* ── Corner scan lines ── */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, #e60000 50%, transparent)" }}
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, #e60000 50%, transparent)" }}
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          />

          {/* ── Glow blob behind logo ── */}
          <div
            className="absolute w-96 h-96 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(230,0,0,0.12) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />

          {/* ── Logo ── */}
          <motion.div
            className="relative flex flex-col items-center gap-5 mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Icon */}
            <motion.div
              className="relative"
              animate={{ boxShadow: ["0 0 24px rgba(230,0,0,0.4)", "0 0 48px rgba(230,0,0,0.7)", "0 0 24px rgba(230,0,0,0.4)"] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ borderRadius: "20px" }}
            >
              <div
                className="w-20 h-20 flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #e60000 0%, #a00000 100%)",
                  borderRadius: "20px",
                }}
              >
                {/* TV icon SVG */}
                <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                  <rect x="2" y="7" width="20" height="13" rx="2" strokeWidth="0" />
                  <path d="M8 7L12 3L16 7" strokeWidth="0" fill="white" opacity="0.6" />
                  <rect x="9" y="20" width="6" height="2" rx="1" fill="white" opacity="0.5" />
                </svg>
              </div>
              {/* Live dot */}
              <motion.div
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2"
                style={{ background: "#22c55e", borderColor: "#050A14" }}
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
            </motion.div>

            {/* Title */}
            <div className="text-center">
              <div
                className="text-5xl tracking-wider"
                style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 900 }}
              >
                <span className="text-white">Live</span>
                <span style={{ color: "#e60000" }}>TV</span>
                <span className="text-white/90">71</span>
              </div>
              <motion.p
                className="text-xs tracking-[0.4em] uppercase mt-2 font-medium"
                style={{ color: "rgba(255,255,255,0.35)" }}
                animate={{ opacity: [0.35, 0.65, 0.35] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Live TV Streaming
              </motion.p>
            </div>
          </motion.div>

          {/* ── Loading section ── */}
          <motion.div
            className="w-full max-w-xs px-6 flex flex-col gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {/* Percentage + label row */}
            <div className="flex items-center justify-between">
              <span
                className="text-[10px] tracking-[0.3em] uppercase font-semibold"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                {percent < 100 ? "Initializing..." : "Ready"}
              </span>
              <span
                className="text-sm font-bold tabular-nums"
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  color: percent === 100 ? "#22c55e" : "#e60000",
                }}
              >
                {percent}%
              </span>
            </div>

            {/* Bar track */}
            <div
              className="relative h-1.5 rounded-full overflow-hidden"
              style={{ background: "rgba(255,255,255,0.06)" }}
            >
              {/* Fill */}
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  width: `${percent}%`,
                  background: percent === 100
                    ? "linear-gradient(90deg, #16a34a, #22c55e)"
                    : "linear-gradient(90deg, #a00000, #e60000, #ff4444)",
                  transition: "width 0.1s linear",
                }}
              />
              {/* Shimmer */}
              <motion.div
                className="absolute inset-y-0 w-16"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
                  left: `${percent - 8}%`,
                }}
                animate={{ opacity: percent < 100 ? [0, 1, 0] : 0 }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            </div>

            {/* Segment dots */}
            <div className="flex justify-between px-0.5">
              {[25, 50, 75, 100].map(mark => (
                <div
                  key={mark}
                  className="w-1 h-1 rounded-full transition-colors duration-300"
                  style={{
                    background: percent >= mark
                      ? (mark === 100 && percent === 100 ? "#22c55e" : "#e60000")
                      : "rgba(255,255,255,0.12)",
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* ── Bottom tech label ── */}
          <motion.p
            className="absolute bottom-8 text-[9px] tracking-[0.5em] uppercase"
            style={{ color: "rgba(255,255,255,0.15)", fontFamily: "'Orbitron', sans-serif" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Bangladesh · Free Live TV
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
