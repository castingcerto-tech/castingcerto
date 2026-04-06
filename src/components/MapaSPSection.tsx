"use client";

import { useState } from "react";
import { MapPin, Users, Clock, CheckCircle2 } from "lucide-react";

// Outline simplificado do Estado de SP (viewBox 0 0 520 380)
const SP_PATH =
  "M 95,15 L 155,8 L 230,5 L 295,18 L 350,42 L 405,68 L 440,105 L 468,145 L 482,188 L 472,230 L 440,268 L 390,305 L 335,340 L 268,358 L 192,354 L 124,336 L 58,303 L 20,254 L 10,188 L 22,120 L 55,62 Z";

type Cidade = {
  nome: string;
  nomeShort: string;
  x: number;
  y: number;
  tipo: string;
  destaque?: boolean;
};

const CIDADES: Cidade[] = [
  { nome: "São Paulo",             nomeShort: "São Paulo",       x: 375, y: 208, tipo: "Capital do Estado",       destaque: true },
  { nome: "Campinas",              nomeShort: "Campinas",        x: 308, y: 178, tipo: "Região Metropolitana" },
  { nome: "Santos",                nomeShort: "Santos",          x: 418, y: 250, tipo: "Baixada Santista" },
  { nome: "São José dos Campos",   nomeShort: "SJ dos Campos",   x: 442, y: 158, tipo: "Vale do Paraíba" },
  { nome: "Ribeirão Preto",        nomeShort: "Ribeirão Preto",  x: 255, y: 80,  tipo: "Norte Paulista" },
  { nome: "Bauru",                 nomeShort: "Bauru",           x: 183, y: 140, tipo: "Centro-Oeste Paulista" },
  { nome: "Sorocaba",              nomeShort: "Sorocaba",        x: 284, y: 218, tipo: "Interior Paulista" },
  { nome: "São José do Rio Preto", nomeShort: "SJ Rio Preto",    x: 138, y: 52,  tipo: "Noroeste Paulista" },
  { nome: "Araçatuba",             nomeShort: "Araçatuba",       x: 98,  y: 107, tipo: "Extremo Oeste" },
  { nome: "Presidente Prudente",   nomeShort: "Pres. Prudente",  x: 68,  y: 193, tipo: "Oeste Paulista" },
  { nome: "Marília",               nomeShort: "Marília",         x: 143, y: 180, tipo: "Centro-Sul Paulista" },
  { nome: "Araraquara",            nomeShort: "Araraquara",      x: 238, y: 120, tipo: "Centro-Leste Paulista" },
];

const STATS = [
  { value: "12+",      label: "Cidades cobertas",          icon: MapPin },
  { value: "500+",     label: "Promotores no estado",      icon: Users },
  { value: "Todo SP",  label: "Capital & Interior",        icon: CheckCircle2 },
  { value: "24h",      label: "Tempo de resposta",         icon: Clock },
];

export default function MapaSPSection() {
  const [hovered, setHovered] = useState<Cidade | null>(null);

  return (
    <section className="py-24 bg-dark-900 border-t border-dark-700">
      <div className="container mx-auto px-6 max-w-6xl">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-brand text-xs font-bold uppercase tracking-widest block mb-3">
            Cobertura Regional
          </span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic">
            Atuamos em todo o{" "}
            <span className="text-brand">Estado de SP</span>
          </h2>
          <p className="text-cream/45 mt-4 max-w-xl mx-auto">
            Promotores prontos nas principais cidades e polos de negócio paulistas.
            Passe o mouse para explorar a cobertura.
          </p>
        </div>

        {/* Map + Panel */}
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">

          {/* ── SVG MAP ── */}
          <div className="w-full max-w-2xl">
            <svg
              viewBox="0 0 520 380"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full select-none"
              style={{ filter: "drop-shadow(0 0 40px rgba(234, 175, 63, 0.12))" }}
            >
              <defs>
                <radialGradient id="spGrad" cx="72%" cy="55%" r="55%">
                  <stop offset="0%"   stopColor="#FFE501" stopOpacity="0.14" />
                  <stop offset="100%" stopColor="#FFE501" stopOpacity="0.02" />
                </radialGradient>
                <filter id="cityGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <clipPath id="spClip">
                  <path d={SP_PATH} />
                </clipPath>
              </defs>

              {/* Grid lines inside state */}
              <g clipPath="url(#spClip)" opacity="0.07">
                {[60, 120, 180, 240, 300, 360, 420, 480].map((x) => (
                  <line key={`v${x}`} x1={x} y1={0} x2={x} y2={400} stroke="#FFE501" strokeWidth="0.8" />
                ))}
                {[50, 100, 150, 200, 250, 300, 350].map((y) => (
                  <line key={`h${y}`} x1={0} y1={y} x2={600} y2={y} stroke="#FFE501" strokeWidth="0.8" />
                ))}
              </g>

              {/* State body */}
              <path
                d={SP_PATH}
                fill="url(#spGrad)"
                stroke="rgba(234, 175, 63, 0.40)"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />

              {/* City dots */}
              {CIDADES.map((cidade) => {
                const isActive = hovered?.nome === cidade.nome;
                const r = cidade.destaque ? 7 : 4.5;

                return (
                  <g
                    key={cidade.nome}
                    onMouseEnter={() => setHovered(cidade)}
                    onMouseLeave={() => setHovered(null)}
                    style={{ cursor: "pointer" }}
                  >
                    {/* Pulse ring */}
                    <circle cx={cidade.x} cy={cidade.y} r={r} fill="rgba(234,175,63,0.2)">
                      <animate
                        attributeName="r"
                        values={`${r};${r + 11};${r}`}
                        dur={cidade.destaque ? "2s" : "2.8s"}
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.6;0;0.6"
                        dur={cidade.destaque ? "2s" : "2.8s"}
                        repeatCount="indefinite"
                      />
                    </circle>

                    {/* Dot */}
                    <circle
                      cx={cidade.x}
                      cy={cidade.y}
                      r={isActive ? r + 2.5 : r}
                      fill={cidade.destaque ? "#FFE501" : isActive ? "#FEEBB9" : "rgba(255,229,1,0.60)"}
                      stroke={isActive ? "white" : "rgba(255,255,255,0.5)"}
                      strokeWidth={cidade.destaque ? 2 : 1.5}
                      filter={isActive ? "url(#cityGlow)" : undefined}
                      style={{ transition: "r 0.15s, fill 0.15s" }}
                    />

                    {/* Label — always para capital, hover para demais */}
                    {(cidade.destaque || isActive) && (() => {
                      const label = cidade.nomeShort;
                      const charW = 6.2;
                      const w = label.length * charW;
                      const lx = Math.min(Math.max(cidade.x - w / 2, 2), 518 - w);
                      const ly = cidade.y - (cidade.destaque ? 18 : 16);
                      return (
                        <g>
                          <rect
                            x={lx - 3}
                            y={ly - 10}
                            width={w + 6}
                            height={12}
                            rx={3}
                            fill="rgba(8,10,20,0.88)"
                          />
                          <text
                            x={cidade.x}
                            y={ly}
                            textAnchor="middle"
                            fill={cidade.destaque ? "#FFE501" : "#FEEBB9"}
                            fontSize={cidade.destaque ? "10" : "8.5"}
                            fontWeight="700"
                            fontFamily="system-ui, sans-serif"
                          >
                            {label}
                          </text>
                        </g>
                      );
                    })()}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* ── PANEL ── */}
          <div className="w-full lg:w-64 shrink-0">
            {hovered ? (
              /* Hover detail */
              <div className="p-6 rounded-2xl bg-dark-800 border border-brand/40 shadow-lg shadow-brand/5 transition-all">
                <div className="w-10 h-10 rounded-full bg-brand/15 flex items-center justify-center mb-4">
                  <MapPin className="w-5 h-5 text-brand" />
                </div>
                <h3 className="text-xl font-black text-cream leading-tight">{hovered.nome}</h3>
                <p className="text-brand text-sm font-semibold mt-1">{hovered.tipo}</p>
                <div className="mt-5 pt-5 border-t border-dark-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-cream/45 text-sm">Promotores</span>
                    <span className="text-cream font-bold text-sm">Disponíveis</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-cream/45 text-sm">Cobertura</span>
                    <span className="flex items-center gap-1.5 text-brand font-bold text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand inline-block" />
                      Ativa
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-cream/45 text-sm">Resposta</span>
                    <span className="text-cream font-bold text-sm">até 24h</span>
                  </div>
                </div>
              </div>
            ) : (
              /* Lista de cidades */
              <div>
                <p className="text-gold text-xs font-bold uppercase tracking-wider mb-4">
                  Principais polos
                </p>
                <div className="flex flex-col gap-2">
                  {CIDADES.map((c) => (
                    <button
                      key={c.nome}
                      className="flex items-center gap-3 p-3 rounded-xl bg-dark-800 border border-dark-700 hover:border-brand/40 hover:bg-dark-700 text-left transition-all group"
                      onMouseEnter={() => setHovered(c)}
                      onMouseLeave={() => setHovered(null)}
                    >
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 transition-colors ${
                          c.destaque ? "bg-brand" : "bg-dark-600 group-hover:bg-brand/60"
                        }`}
                      />
                      <div className="min-w-0">
                        <p className="text-cream text-sm font-semibold truncate">{c.nome}</p>
                        <p className="text-cream/40 text-xs">{c.tipo}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-14 pt-10 border-t border-dark-700">
          {STATS.map(({ value, label, icon: Icon }) => (
            <div
              key={label}
              className="flex flex-col items-center text-center p-5 rounded-xl bg-dark-800 border border-dark-700 hover:border-brand/20 transition-all"
            >
              <Icon className="w-5 h-5 text-brand mb-2" />
              <p className="text-2xl font-black text-cream">{value}</p>
              <p className="text-cream/40 text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
