"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { bentoItem } from "./BentoGrid";

export function BentoClockCell() {
  const [time, setTime] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [tz, setTz] = useState<string>("CT");

  useEffect(() => {
    function update() {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          timeZone: "America/Chicago",
        })
      );
      setDate(
        now.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          timeZone: "America/Chicago",
        })
      );
      // Dynamic timezone abbreviation (CST vs CDT)
      const tzName = now.toLocaleTimeString("en-US", {
        timeZone: "America/Chicago",
        timeZoneName: "short",
      });
      const match = tzName.match(/[A-Z]{2,4}$/);
      if (match) setTz(match[0]);
    }
    update();
    const id = setInterval(update, 60000); // Update every minute, not every second
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      variants={bentoItem}
      className="bento-card bento-card-shine flex flex-col justify-between"
    >
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="font-mono text-xs text-white/40 uppercase tracking-wider">Location</span>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        {/* Live clock — no key prop, avoids DOM remount */}
        <p className="font-display font-bold text-2xl text-white mb-1 tabular-nums">
          {time || "--:--"}
        </p>
        <p className="font-body text-sm text-white/40 mb-4">{date || "---"}</p>

        {/* Location */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-400/60" />
          <span className="font-body text-xs text-white/40">Dallas, TX</span>
          <span className="font-mono text-[10px] text-white/20">{tz}</span>
        </div>
      </div>
    </motion.div>
  );
}
