"use client";

import { FileText } from "lucide-react";

export default function OrcamentosPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-cream">Orçamentos</h1>
        <p className="text-cream/40 text-sm mt-1">Crie e gerencie orçamentos para clientes</p>
      </div>

      <div className="rounded-2xl border border-dark-700 bg-dark-900 p-12 text-center">
        <FileText className="w-12 h-12 text-cream/10 mx-auto mb-4" />
        <p className="font-semibold text-cream mb-1">Orçamentos</p>
        <p className="text-cream/30 text-sm">Em breve você poderá criar e enviar orçamentos aqui.</p>
      </div>
    </div>
  );
}
