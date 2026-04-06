"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
}

export default function FadeInSection({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = { id: 0 };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timer.id = window.setTimeout(() => setVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      observer.disconnect();
      clearTimeout(timer.id);
    };
  }, [delay]);

  const translateClass =
    direction === "up"
      ? visible
        ? "translate-y-0"
        : "translate-y-8"
      : direction === "left"
      ? visible
        ? "translate-x-0"
        : "-translate-x-8"
      : direction === "right"
      ? visible
        ? "translate-x-0"
        : "translate-x-8"
      : "";

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible ? "opacity-100" : "opacity-0"
      } ${translateClass} ${className}`}
    >
      {children}
    </div>
  );
}
