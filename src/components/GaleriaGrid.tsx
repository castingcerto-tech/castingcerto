"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";

type GaleriaItem = {
  src: string;
  empresa: string;
  servico: string;
};

// Quantas fotos mostrar por padrão (3 linhas × 5 colunas desktop = 15)
const INITIAL_COUNT = 10;

export default function GaleriaGrid({ items }: { items: GaleriaItem[] }) {
  const [expanded, setExpanded] = useState(false);

  const visibleItems = expanded ? items : items.slice(0, INITIAL_COUNT);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {visibleItems.map(({ src, empresa, servico }, i) => (
          <div
            key={i}
            className="group relative aspect-square rounded-xl overflow-hidden cursor-default"
          >
            <Image
              src={src}
              alt={`${empresa} — ${servico}`}
              fill
              className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />
            {/* Overlay escuro no hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {/* Label no hover */}
            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              <p className="font-bold text-cream text-sm leading-tight">{empresa}</p>
              <p className="text-cream/60 text-xs mt-0.5">{servico}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Botão expandir/recolher */}
      <div className="flex justify-center mt-10">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="group inline-flex items-center gap-2 px-7 py-3 rounded-full border border-dark-700 text-cream/60 hover:border-brand hover:text-brand text-sm font-bold transition-all"
        >
          {expanded ? (
            <>
              Ver menos fotos
              <ChevronUp className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </>
          ) : (
            <>
              Ver mais fotos
              <ChevronDown className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </>
          )}
        </button>
      </div>
    </>
  );
}
