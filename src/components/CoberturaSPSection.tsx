"use client";

import { useState } from "react";
import { MapPin, Users, Zap, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

const REGIOES = [
  { nome: "Grande São Paulo",      desc: "Capital e municípios da Grande SP" },
  { nome: "Interior Norte",        desc: "Ribeirão Preto, Rio Preto e região" },
  { nome: "Vale do Paraíba",       desc: "São José dos Campos e Vale" },
  { nome: "Baixada Santista",      desc: "Santos, Guarujá e litoral sul" },
  { nome: "Centro-Oeste Paulista", desc: "Bauru, Marília e região central" },
  { nome: "Oeste Paulista",        desc: "Presidente Prudente e extremo oeste" },
];

export default function CoberturaSPSection() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="py-24 bg-dark-900 border-t border-dark-700">
      <div className="container mx-auto px-6 max-w-6xl">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <span className="text-gold text-xs font-bold uppercase tracking-widest block mb-3">
              Cobertura Regional
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-cream">
              Atuamos em todo o{" "}
              <span className="text-brand">Estado de São Paulo</span>
            </h2>
          </div>
          <p className="text-cream/45 max-w-xs text-sm leading-relaxed md:text-right">
            Da capital ao interior — promotores disponíveis em todas as regiões paulistas.
          </p>
        </div>

        {/* Regiões interativas */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-10">
          {REGIOES.map((r, i) => (
            <div
              key={r.nome}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              className={`p-5 rounded-xl border cursor-default transition-all duration-200 ${
                active === i
                  ? "bg-brand border-brand shadow-sm"
                  : "bg-dark-800 border-dark-700 hover:border-brand/40"
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <MapPin
                  className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                    active === i ? "text-ink/50" : "text-brand"
                  }`}
                />
                <h3 className="font-semibold text-sm text-cream">{r.nome}</h3>
              </div>
              <p
                className={`text-xs leading-snug ml-5 transition-colors ${
                  active === i ? "text-ink/55" : "text-cream/35"
                }`}
              >
                {r.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Stats + CTA */}
        <div className="p-6 rounded-2xl bg-dark-800 border border-dark-700 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap justify-center sm:justify-start gap-8">
            {[
              { icon: MapPin,       value: "37+",  label: "cidades cobertas" },
              { icon: Users,        value: "500+", label: "promotores no estado" },
              { icon: Zap,          value: "24h",  label: "tempo de resposta" },
              { icon: CheckCircle2, value: "100%", label: "cobertura capital" },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-2.5">
                <Icon className="w-4 h-4 text-brand shrink-0" />
                <div>
                  <span className="text-cream font-black text-lg leading-none">{value}</span>
                  <span className="text-cream/40 text-xs block">{label}</span>
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/contato"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-brand hover:bg-brand-light text-ink font-bold text-sm rounded-full transition-all hover:scale-105 active:scale-95"
          >
            Solicitar para minha região
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}