"use client";

import { useEffect, useState } from "react";
import { Users, Clock, CheckCircle2, XCircle, AlertTriangle, Search, ChevronDown } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const STATUS_TABS = [
  { key: "",          label: "Todos",      icon: Users,         color: "text-cream" },
  { key: "PENDENTE",  label: "Pendentes",  icon: Clock,         color: "text-yellow-400" },
  { key: "APROVADO",  label: "Aprovados",  icon: CheckCircle2,  color: "text-green-400" },
  { key: "REPROVADO", label: "Reprovados", icon: XCircle,       color: "text-red-400" },
  { key: "CORRECAO",  label: "Correção",   icon: AlertTriangle, color: "text-blue-400" },
];

interface Promotor {
  id: string;
  email: string;
  status: string;
  criadoEm: string;
  perfil: {
    nomeCompleto: string | null;
    whatsapp: string | null;
    cidade: string | null;
    estado: string | null;
    fotoRosto: string | null;
  } | null;
}

export default function PromotoresPage() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get("status") ?? "";
  const [activeTab, setActiveTab] = useState(initialStatus);
  const [promotores, setPromotores] = useState<Promotor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (activeTab) params.set("status", activeTab);
    if (search.trim()) params.set("q", search.trim());

    fetch(`/api/admin/promotores?${params}`)
      .then((r) => r.json())
      .then((data) => setPromotores(data.promotores ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activeTab, search]);

  const statusBadge = (s: string) => {
    const map: Record<string, string> = {
      PENDENTE: "bg-yellow-500/15 text-yellow-400",
      APROVADO: "bg-green-500/15 text-green-400",
      REPROVADO: "bg-red-500/15 text-red-400",
      CORRECAO: "bg-blue-500/15 text-blue-400",
      BLOQUEADO: "bg-red-600/15 text-red-500",
    };
    const labels: Record<string, string> = {
      PENDENTE: "Pendente",
      APROVADO: "Aprovado",
      REPROVADO: "Reprovado",
      CORRECAO: "Correção",
      BLOQUEADO: "Bloqueado",
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${map[s] ?? "bg-dark-700 text-cream/40"}`}>
        {labels[s] ?? s}
      </span>
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-cream">Promotores</h1>
        <p className="text-cream/40 text-sm mt-1">Gerencie a base de promotores e talentos cadastrados</p>
      </div>

      {/* Tabs de status */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors
              ${activeTab === tab.key
                ? "bg-dark-700 text-cream border border-dark-600"
                : "text-cream/40 hover:text-cream hover:bg-dark-800 border border-transparent"
              }
            `}
          >
            <tab.icon className={`w-4 h-4 ${activeTab === tab.key ? tab.color : ""}`} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Busca */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/30" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome, e-mail ou cidade..."
          className="w-full pl-11 pr-4 py-3 bg-dark-900 border border-dark-700 rounded-xl text-sm text-cream placeholder:text-cream/30 focus:outline-none focus:border-brand/50"
        />
      </div>

      {/* Tabela / Lista */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : promotores.length === 0 ? (
        <div className="text-center py-12 text-cream/30">
          <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>Nenhum promotor encontrado</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-dark-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-dark-800 text-cream/50 text-left">
                  <th className="px-4 py-3 font-medium">Promotor</th>
                  <th className="px-4 py-3 font-medium hidden sm:table-cell">Cidade</th>
                  <th className="px-4 py-3 font-medium hidden md:table-cell">WhatsApp</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium hidden lg:table-cell">Cadastro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700">
                {promotores.map((p) => (
                  <tr key={p.id} className="hover:bg-dark-800/50 transition-colors cursor-pointer" onClick={() => window.location.href = `/admin/promotores/${p.id}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.perfil?.fotoRosto ? (
                          <Image src={p.perfil.fotoRosto} alt="" width={36} height={36} className="w-9 h-9 rounded-full object-cover" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-dark-700 flex items-center justify-center text-cream/30 text-xs shrink-0">
                            {(p.perfil?.nomeCompleto ?? p.email).charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-medium text-cream truncate">{p.perfil?.nomeCompleto ?? "—"}</p>
                          <p className="text-xs text-cream/30 truncate">{p.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-cream/50 hidden sm:table-cell">
                      {p.perfil?.cidade ? `${p.perfil.cidade}${p.perfil.estado ? ` - ${p.perfil.estado}` : ""}` : "—"}
                    </td>
                    <td className="px-4 py-3 text-cream/50 hidden md:table-cell">{p.perfil?.whatsapp ?? "—"}</td>
                    <td className="px-4 py-3">{statusBadge(p.status)}</td>
                    <td className="px-4 py-3 text-cream/30 text-xs hidden lg:table-cell">
                      {new Date(p.criadoEm).toLocaleDateString("pt-BR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
