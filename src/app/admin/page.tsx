"use client";

import { useEffect, useState } from "react";
import { Users, Briefcase, Building2, FileText, Clock, CheckCircle2, XCircle, TrendingUp } from "lucide-react";
import Link from "next/link";

interface DashboardStats {
  totalPromotores: number;
  pendentes: number;
  aprovados: number;
  reprovados: number;
  totalTrabalhos: number;
  totalClientes: number;
  totalOrcamentos: number;
}

function StatCard({ icon: Icon, label, value, color, href }: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  color: string;
  href?: string;
}) {
  const inner = (
    <div className={`rounded-2xl border border-dark-700 bg-dark-900 p-5 hover:border-dark-600 transition-colors ${href ? "cursor-pointer" : ""}`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        {href && <TrendingUp className="w-4 h-4 text-cream/20" />}
      </div>
      <p className="text-2xl font-bold text-cream">{value}</p>
      <p className="text-sm text-cream/40 mt-0.5">{label}</p>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-cream">Dashboard</h1>
        <p className="text-cream/40 text-sm mt-1">Visão geral do sistema</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={Users}
          label="Total de Promotores"
          value={stats?.totalPromotores ?? "—"}
          color="bg-brand/15 text-brand"
          href="/admin/promotores"
        />
        <StatCard
          icon={Clock}
          label="Pendentes de Aprovação"
          value={stats?.pendentes ?? "—"}
          color="bg-yellow-500/15 text-yellow-400"
          href="/admin/promotores?status=PENDENTE"
        />
        <StatCard
          icon={CheckCircle2}
          label="Aprovados"
          value={stats?.aprovados ?? "—"}
          color="bg-green-500/15 text-green-400"
          href="/admin/promotores?status=APROVADO"
        />
        <StatCard
          icon={XCircle}
          label="Reprovados"
          value={stats?.reprovados ?? "—"}
          color="bg-red-500/15 text-red-400"
          href="/admin/promotores?status=REPROVADO"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={Briefcase}
          label="Trabalhos"
          value={stats?.totalTrabalhos ?? "—"}
          color="bg-purple-500/15 text-purple-400"
          href="/admin/trabalhos"
        />
        <StatCard
          icon={Building2}
          label="Clientes"
          value={stats?.totalClientes ?? "—"}
          color="bg-blue-500/15 text-blue-400"
          href="/admin/clientes"
        />
        <StatCard
          icon={FileText}
          label="Orçamentos"
          value={stats?.totalOrcamentos ?? "—"}
          color="bg-emerald-500/15 text-emerald-400"
          href="/admin/orcamentos"
        />
      </div>
    </div>
  );
}
