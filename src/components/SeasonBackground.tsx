"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

export default function SeasonBackground() {
  const [screenWidth, setScreenWidth] = useState(1200);

  // ✅ handle SSR safely
  useEffect(() => {
    if (typeof window !== "undefined") {
      setScreenWidth(window.innerWidth);
    }
  }, []);

  const month = new Date().getMonth();

  const season = useMemo(() => {
    if ([2, 3, 4].includes(month)) return "spring"; // Mar-May
    if ([5, 6, 7].includes(month)) return "summer"; // Jun-Aug
    if ([8, 9, 10].includes(month)) return "autumn"; // Sep-Nov
    return "winter"; // Dec-Feb
  }, [month]);

  const backgrounds: Record<string, { emoji: string; count: number }> = {
    spring: { emoji: "🌸", count: 10 },
    summer: { emoji: "☀️", count: 10 },
    autumn: { emoji: "🍂", count: 10 },
    winter: { emoji: "❄️", count: 10 },
  };

  const { emoji, count } = backgrounds[season];

  return (
    <div className="fixed inset-0 z-10 overflow-hidden pointer-events-none">
      {[...Array(count)].map((_, i) => {
        const randomX = Math.random() * screenWidth;
        const randomSize = Math.random() * 1.5 + 1; // 1x - 2.5x
        const duration = 8 + Math.random() * 12;

        return (
          <motion.div
            key={i}
            className="absolute text-2xl"
            style={{ left: randomX, fontSize: `${randomSize}rem` }}
            initial={{ y: -50 }}
            animate={{
              y: "100vh",
              x: randomX + (Math.random() * 100 - 50), // slight horizontal drift
              rotate: 360,
            }}
            transition={{
              duration,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear",
            }}
          >
            {emoji}
          </motion.div>
        );
      })}
    </div>
  );
}
