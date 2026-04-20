"use client";

import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";

function getBaliTime() {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Makassar",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    weekday: "short",
    day: "2-digit",
    month: "short"
  }).format(new Date());
}

export function BaliTime() {
  const [time, setTime] = useState(getBaliTime());

  useEffect(() => {
    const timer = window.setInterval(() => setTime(getBaliTime()), 1000 * 30);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="bali-time">
      <Clock3 size={16} />
      <strong>{time}</strong>
    </div>
  );
}
