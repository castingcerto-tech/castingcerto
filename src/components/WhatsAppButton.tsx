"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {/* Tooltip */}
      <div
        className={`bg-dark-900 border border-dark-700 text-cream text-sm font-semibold px-4 py-2.5 rounded-xl shadow-xl transition-all duration-300 ${
          hovered
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-1 pointer-events-none"
        }`}
      >
        <p className="whitespace-nowrap">Fale conosco no WhatsApp</p>
        <p className="text-cream/40 text-xs mt-0.5">Resposta rápida</p>
      </div>

      {/* Button */}
      <a
        href="https://wa.me/5511999999999?text=Ol%C3%A1!%20Tenho%20interesse%20em%20contratar%20promotores."
        target="_blank"
        rel="noopener noreferrer"
        className="relative group"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label="Contato via WhatsApp"
      >
        {/* Pulse rings */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25" />
        <span
          className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-15"
          style={{ animationDelay: "0.6s" }}
        />
        {/* Core */}
        <div className="relative w-14 h-14 bg-[#25D366] hover:bg-[#20BA5A] rounded-full flex items-center justify-center shadow-[0_4px_24px_rgba(37,211,102,0.4)] transition-all duration-300 group-hover:scale-110 active:scale-90 group-hover:shadow-[0_4px_32px_rgba(37,211,102,0.6)]">
          <MessageCircle className="w-7 h-7 text-white fill-white" />
        </div>
      </a>
    </div>
  );
}
