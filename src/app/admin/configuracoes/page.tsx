"use client";

import { Settings } from "lucide-react";

export default function ConfiguracoesPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-cream">Configurações</h1>
        <p className="text-cream/40 text-sm mt-1">Configurações gerais do site e contatos</p>
      </div>

      <div className="rounded-2xl border border-dark-700 bg-dark-900 p-12 text-center">
        <Settings className="w-12 h-12 text-cream/10 mx-auto mb-4" />
        <p className="font-semibold text-cream mb-1">Configurações</p>
        <p className="text-cream/30 text-sm">Em breve você poderá ajustar as configurações do site aqui.</p>
      </div>
    </div>
  );
}
