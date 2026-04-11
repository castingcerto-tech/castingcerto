"use client";

import { useEffect, useState } from "react";
import { Users, Briefcase, Building2, FileText, Clock, CheckCircle2, XCircle, TrendingUp, HardDrive, Wifi, Image as ImageIcon, RefreshCw } from "lucide-react";
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

interface CloudinaryUsage {
  storage: { used: number; limit: number };
  bandwidth: { used: number; limit: number };
  transformations: { used: number; limit: number };
  objects: number;
  lastUpdated: string;
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

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function UsageBar({ label, icon: Icon, used, limit, formatFn }: {
  label: string;
  icon: React.ElementType;
  used: number;
  limit: number;
  formatFn: (n: number) => string;
}) {
  const pct = Math.min((used / limit) * 100, 100);
  const color = pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-yellow-500" : "bg-green-500";
  const textColor = pct >= 90 ? "text-red-400" : pct >= 70 ? "text-yellow-400" : "text-green-400";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-cream/50" />
          <span className="text-sm font-medium text-cream/70">{label}</span>
        </div>
        <span className={`text-sm font-bold ${textColor}`}>{pct.toFixed(1)}%</span>
      </div>
      <div className="w-full h-3 bg-dark-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-cream/40">
        <span>{formatFn(used)} usado</span>
        <span>{formatFn(limit)} total</span>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [cloudUsage, setCloudUsage] = useState<CloudinaryUsage | null>(null);
  const [cloudLoading, setCloudLoading] = useState(true);

  const fetchCloudUsage = () => {
    setCloudLoading(true);
    fetch("/api/admin/cloudinary-usage")
      .then((r) => r.json())
      .then((data) => { if (!data.error) setCloudUsage(data); })
      .catch(() => {})
      .finally(() => setCloudLoading(false));
  };

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});

    fetchCloudUsage();
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

      {/* Cloudinary Usage */}
      <div className="mt-8 rounded-2xl border border-dark-700 bg-dark-900 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-cream flex items-center gap-2">
              ☁️ Armazenamento de Fotos
            </h2>
            <p className="text-xs text-cream/40 mt-1">
              Uso do Cloudinary (plano gratuito)
              {cloudUsage && (
                <> · Atualizado em {new Date(cloudUsage.lastUpdated).toLocaleString("pt-BR")}</>
              )}
            </p>
          </div>
          <button
            onClick={fetchCloudUsage}
            disabled={cloudLoading}
            className="p-2 rounded-lg bg-dark-800 hover:bg-dark-700 transition-colors disabled:opacity-50"
            title="Atualizar dados"
          >
            <RefreshCw className={`w-4 h-4 text-cream/60 ${cloudLoading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {cloudLoading && !cloudUsage ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
          </div>
        ) : cloudUsage ? (
          <div className="space-y-5">
            <UsageBar
              label="Armazenamento"
              icon={HardDrive}
              used={cloudUsage.storage.used}
              limit={cloudUsage.storage.limit}
              formatFn={formatBytes}
            />
            <UsageBar
              label="Banda (mensal)"
              icon={Wifi}
              used={cloudUsage.bandwidth.used}
              limit={cloudUsage.bandwidth.limit}
              formatFn={formatBytes}
            />
            <UsageBar
              label="Transformações (mensal)"
              icon={ImageIcon}
              used={cloudUsage.transformations.used}
              limit={cloudUsage.transformations.limit}
              formatFn={(n) => n.toLocaleString("pt-BR")}
            />
            <div className="pt-3 border-t border-dark-700 flex items-center gap-2 text-xs text-cream/40">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Total de arquivos: <strong className="text-cream/60">{cloudUsage.objects.toLocaleString("pt-BR")}</strong></span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-cream/40 text-center py-4">
            Não foi possível carregar os dados de uso.
          </p>
        )}
      </div>
    </div>
  );
}
