"use client";

import { Building2 } from "lucide-react";

export default function ClientesPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-cream">Clientes</h1>
        <p className="text-cream/40 text-sm mt-1">Empresas cadastradas para eventos e ativações</p>
      </div>

      <div className="rounded-2xl border border-dark-700 bg-dark-900 p-12 text-center">
        <Building2 className="w-12 h-12 text-cream/10 mx-auto mb-4" />
        <p className="font-semibold text-cream mb-1">Clientes</p>
        <p className="text-cream/30 text-sm">Em breve você poderá cadastrar e gerenciar clientes aqui.</p>
      </div>
    </div>
  );
}
