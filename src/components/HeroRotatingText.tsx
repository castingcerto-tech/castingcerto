"use client";

import { useState, useEffect } from "react";

const SERVICES = [
  "Promotores de Eventos",
  "Hostess & Staff",
  "Ativação de Marca",
  "PDV & Trade Marketing",
  "Live Marketing",
];

export default function HeroRotatingText() {
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setIndex((i) => (i + 1) % SERVICES.length);
        setAnimating(false);
      }, 350);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className="text-brand"
      style={{
        opacity: animating ? 0 : 1,
        transform: animating ? "translateY(10px)" : "translateY(0)",
        transition: "opacity 0.3s ease, transform 0.35s ease",
        display: "block",
      }}
    >
      {SERVICES[index]}
    </span>
  );
}
