"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  AlertTriangle, CheckCircle2, ChevronRight, LogOut, User,
  MapPin, Ruler, Briefcase, Camera, Landmark, ArrowRight,
  Loader2, X, Save,
} from "lucide-react";

// ─── Banking form (mesmos campos do antigo Step6) ────────────────────────────

function onlyDigits(v: string) { return v.replace(/\D/g, ""); }

type BankData = {
  tipo_chave_pix: string; chave_pix: string;
  banco: string; tipo_conta: string; agencia: string; conta: string;
};

const BANK_INITIAL: BankData = {
  tipo_chave_pix: "", chave_pix: "", banco: "", tipo_conta: "", agencia: "", conta: "",
};

const inputCls =
  "w-full bg-dark-800 border border-dark-600 rounded-lg px-4 py-3 text-cream placeholder-cream/20 text-sm focus:outline-none focus:border-brand/60 focus:bg-dark-700 transition-colors";
const selectCls = inputCls + " appearance-none cursor-pointer";

function BankingForm({ onSave }: { onSave: () => void }) {
  const [bd, setBd] = useState<BankData>(BANK_INITIAL);
  const [saving, setSaving] = useState(false);
  const set = (k: keyof BankData, v: string) => setBd(prev => ({ ...prev, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    // Salva no localStorage (em produção: enviar para API)
    localStorage.setItem("cc_banking", JSON.stringify(bd));
    localStorage.setItem("cc_banking_complete", "true");
    await new Promise(r => setTimeout(r, 800)); // simula request
    setSaving(false);
    onSave();
  };

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <div className="sm:col-span-2">
        <p className="text-cream/40 text-sm mb-4">
          Necessário para receber o pagamento dos eventos. Seus dados ficam protegidos e só são usados para depósito.
        </p>
      </div>

      {/* PIX */}
      <div>
        <label className="block text-xs font-semibold text-cream/60 uppercase tracking-wider mb-1.5">PIX — Tipo de Chave</label>
        <select className={selectCls} value={bd.tipo_chave_pix} onChange={e => set("tipo_chave_pix", e.target.value)}>
          <option value="">Selecione...</option>
          <option value="cpf">CPF</option>
          <option value="email">E-mail</option>
          <option value="telefone">Telefone</option>
          <option value="aleatoria">Chave Aleatória</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold text-cream/60 uppercase tracking-wider mb-1.5">PIX — Chave</label>
        <input className={inputCls} placeholder="Sua chave PIX" value={bd.chave_pix}
          onChange={e => set("chave_pix", e.target.value)} />
      </div>

      <div className="sm:col-span-2 border-t border-dark-600 pt-4">
        <p className="text-xs font-semibold text-cream/30 uppercase tracking-wider mb-3">Ou Transferência Bancária</p>
      </div>

      <div>
        <label className="block text-xs font-semibold text-cream/60 uppercase tracking-wider mb-1.5">Banco</label>
        <input className={inputCls} placeholder="Ex: Nubank, Itaú" value={bd.banco}
          onChange={e => set("banco", e.target.value)} />
      </div>
      <div>
        <label className="block text-xs font-semibold text-cream/60 uppercase tracking-wider mb-1.5">Tipo de Conta</label>
        <select className={selectCls} value={bd.tipo_conta} onChange={e => set("tipo_conta", e.target.value)}>
          <option value="">Selecione...</option>
          <option value="corrente">Conta Corrente</option>
          <option value="poupanca">Conta Poupança</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold text-cream/60 uppercase tracking-wider mb-1.5">Agência</label>
        <input className={inputCls} placeholder="Ex: 0001" value={bd.agencia}
          onChange={e => set("agencia", onlyDigits(e.target.value).slice(0, 6))} inputMode="numeric" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-cream/60 uppercase tracking-wider mb-1.5">Conta com Dígito</label>
        <input className={inputCls} placeholder="Ex: 12345-6" value={bd.conta}
          onChange={e => set("conta", e.target.value.replace(/[^0-9-]/g, "").slice(0, 12))} inputMode="numeric" />
      </div>

      <div className="sm:col-span-2 flex justify-end pt-2">
        <button type="button" onClick={handleSave} disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand hover:bg-brand-light text-ink font-bold rounded-lg transition-all btn-shimmer disabled:opacity-60">
          {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Salvando...</> : <><Save className="w-4 h-4" />Salvar dados bancários</>}
        </button>
      </div>
    </div>
  );
}

// ─── Section card ─────────────────────────────────────────────────────────────

type SectionStatus = "complete" | "incomplete" | "optional";

function SectionCard({
  icon: Icon, title, description, status, actionLabel, actionHref, onExpand,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  status: SectionStatus;
  actionLabel?: string;
  actionHref?: string;
  onExpand?: () => void;
}) {
  const colors = {
    complete:   "border-green-500/30 bg-green-500/5",
    incomplete: "border-brand/40 bg-brand/5",
    optional:   "border-dark-600 bg-dark-800/50",
  };
  const badges = {
    complete:   <span className="flex items-center gap-1 text-xs font-semibold text-green-400"><CheckCircle2 className="w-3.5 h-3.5" />Completo</span>,
    incomplete: <span className="flex items-center gap-1 text-xs font-semibold text-brand"><AlertTriangle className="w-3.5 h-3.5" />Pendente</span>,
    optional:   <span className="text-xs font-semibold text-cream/30">Opcional</span>,
  };

  return (
    <div className={`rounded-xl border p-4 flex items-center gap-4 ${colors[status]}`}>
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
        status === "complete" ? "bg-green-500/15 text-green-400" :
        status === "incomplete" ? "bg-brand/15 text-brand" :
        "bg-dark-700 text-cream/30"
      }`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="font-semibold text-cream text-sm">{title}</p>
          {badges[status]}
        </div>
        <p className="text-xs text-cream/40 leading-relaxed">{description}</p>
      </div>
      {status !== "complete" && (actionHref ? (
        <Link href={actionHref}
          className="flex items-center gap-1.5 px-4 py-2 bg-brand/15 hover:bg-brand/25 border border-brand/30 text-brand text-xs font-semibold rounded-lg transition-all shrink-0">
          {actionLabel ?? "Completar"}<ChevronRight className="w-3.5 h-3.5" />
        </Link>
      ) : onExpand ? (
        <button type="button" onClick={onExpand}
          className="flex items-center gap-1.5 px-4 py-2 bg-brand/15 hover:bg-brand/25 border border-brand/30 text-brand text-xs font-semibold rounded-lg transition-all shrink-0">
          {actionLabel ?? "Completar"}<ChevronRight className="w-3.5 h-3.5" />
        </button>
      ) : null)}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function MinhaContaPage() {
  const { data: session, status } = useSession();
  const router                   = useRouter();

  const [bankingComplete, setBankingComplete] = useState(false);
  const [profileComplete, setProfileComplete] = useState(false);
  const [showBankingForm, setShowBankingForm] = useState(false);

  // Redireciona se não autenticado
  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  // Lê estado do localStorage
  useEffect(() => {
    setBankingComplete(localStorage.getItem("cc_banking_complete") === "true");
    setProfileComplete(localStorage.getItem("cc_profile_complete") === "true");
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  const isGoogle        = session.user.provider === "google";
  const user            = session.user;
  const totalSections   = isGoogle ? 5 : 1; // Google: tudo; email: só banking
  const doneSections    = isGoogle
    ? (profileComplete ? 4 : 0) + (bankingComplete ? 1 : 0)
    : (bankingComplete ? 1 : 0);
  const isProfileFull   = doneSections === totalSections;
  const percent         = totalSections > 0 ? Math.round((doneSections / totalSections) * 100) : 100;

  return (
    <div className="min-h-screen bg-dark-950 text-cream">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-dark-900/95 backdrop-blur-xl border-b border-dark-700">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <Image src="/logo casting certo/logo casting certo.PNG" alt="Casting Certo" width={30} height={30} className="rounded-md" />
            <span className="text-sm font-bold text-cream hidden sm:block">Casting Certo</span>
          </Link>
          <div className="flex items-center gap-3">
            {user.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.image} alt={user.name ?? ""} className="w-8 h-8 rounded-full ring-2 ring-brand/30" />
            )}
            <span className="text-sm text-cream/60 hidden sm:block truncate max-w-[180px]">{user.name}</span>
            <button onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-1.5 text-xs text-cream/40 hover:text-cream/70 transition-colors border border-dark-600 hover:border-dark-500 rounded-lg px-3 py-2">
              <LogOut className="w-3.5 h-3.5" />Sair
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10 max-w-2xl">

        {/* Boas vindas */}
        <div className="mb-8">
          <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-1">Área do Promotor</p>
          <h1 className="text-2xl font-bold text-cream">
            Olá, {user.name?.split(" ")[0] ?? "Promotor"}!
          </h1>
          <p className="text-cream/40 text-sm mt-1">
            {user.email}
            {isGoogle && (
              <span className="ml-2 inline-flex items-center gap-1 text-xs bg-dark-800 border border-dark-600 px-2 py-0.5 rounded-full">
                <svg className="w-3 h-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </span>
            )}
          </p>
        </div>

        {/* ── ALERTA PERSISTENTE ──────────────────────────────── */}
        {!isProfileFull && (
          <div className="mb-8 rounded-2xl border-2 border-brand/50 bg-brand/5 overflow-hidden">
            {/* Cabeçalho do alerta */}
            <div className="flex items-start gap-3 p-5">
              <div className="w-10 h-10 rounded-full bg-brand/20 flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5 text-brand" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-brand text-base mb-0.5">
                  Seu perfil está incompleto
                </p>
                <p className="text-cream/60 text-sm leading-relaxed">
                  {isGoogle
                    ? "Você entrou pelo Google — precisamos das suas informações pessoais, fotos profissionais e dados bancários antes de você poder ser chamado para eventos."
                    : "Faltam apenas seus dados bancários. Adicione agora para poder receber o pagamento dos eventos em que trabalhar."}
                </p>
              </div>
            </div>

            {/* Barra de progresso */}
            <div className="px-5 pb-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-cream/40">Perfil {percent}% completo</span>
                <span className="text-xs text-cream/40">{doneSections}/{totalSections} seções</span>
              </div>
              <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand rounded-full transition-all duration-700"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>

            {/* CTA */}
            <div className="px-5 pb-5 pt-2 flex flex-col sm:flex-row gap-3">
              {isGoogle && !profileComplete && (
                <Link href="/completar-perfil"
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-brand hover:bg-brand-light text-ink font-bold rounded-xl transition-all btn-shimmer text-sm">
                  Completar perfil agora <ArrowRight className="w-4 h-4" />
                </Link>
              )}
              {!bankingComplete && (
                <button type="button" onClick={() => setShowBankingForm(v => !v)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 font-bold rounded-xl transition-all text-sm border ${
                    showBankingForm
                      ? "border-brand/50 bg-brand/10 text-brand"
                      : "border-brand/40 hover:border-brand/70 text-brand hover:bg-brand/10"
                  }`}>
                  <Landmark className="w-4 h-4" />
                  {showBankingForm ? "Fechar formulário" : "Adicionar dados bancários"}
                  {showBankingForm && <X className="w-3.5 h-3.5 ml-1" />}
                </button>
              )}
            </div>

            {/* Formulário bancário inline */}
            {showBankingForm && (
              <div className="border-t border-brand/20 px-5 py-6 bg-dark-900/50">
                <BankingForm onSave={() => {
                  setBankingComplete(true);
                  setShowBankingForm(false);
                }} />
              </div>
            )}
          </div>
        )}

        {/* ── PERFIL COMPLETO ─────────────────────────────────── */}
        {isProfileFull && (
          <div className="mb-8 rounded-2xl border-2 border-green-500/40 bg-green-500/5 p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="font-bold text-green-400 mb-0.5">Perfil 100% completo!</p>
              <p className="text-cream/50 text-sm">Você está elegível para receber convites para eventos.</p>
            </div>
          </div>
        )}

        {/* ── STATUS DAS SEÇÕES ──────────────────────────────── */}
        <div className="mb-8">
          <h2 className="text-sm font-bold text-cream/50 uppercase tracking-wider mb-4">Status do perfil</h2>
          <div className="space-y-3">

            {isGoogle && (
              <>
                <SectionCard
                  icon={User} title="Dados Pessoais"
                  description="CPF, RG, WhatsApp, data de nascimento, gênero, etnia, endereço"
                  status={profileComplete ? "complete" : "incomplete"}
                  actionLabel="Completar"
                  actionHref="/completar-perfil"
                />
                <SectionCard
                  icon={Ruler} title="Características Físicas"
                  description="Altura, peso, manequim, olhos, cabelo, calçado"
                  status={profileComplete ? "complete" : "incomplete"}
                  actionLabel="Completar"
                  actionHref="/completar-perfil"
                />
                <SectionCard
                  icon={Briefcase} title="Experiência e Disponibilidade"
                  description="Áreas de interesse, idiomas, disponibilidade"
                  status={profileComplete ? "complete" : "incomplete"}
                  actionLabel="Completar"
                  actionHref="/completar-perfil"
                />
                <SectionCard
                  icon={Camera} title="Fotos Profissionais"
                  description="Foto de rosto e foto de corpo inteiro em evento"
                  status={profileComplete ? "complete" : "incomplete"}
                  actionLabel="Completar"
                  actionHref="/completar-perfil"
                />
              </>
            )}

            {!isGoogle && (
              <>
                <SectionCard
                  icon={User} title="Dados Pessoais"
                  description="CPF, RG, WhatsApp, data de nascimento, endereço e mais"
                  status="complete"
                />
                <SectionCard
                  icon={Ruler} title="Características Físicas"
                  description="Altura, peso, manequim, olhos, cabelo, calçado"
                  status="complete"
                />
                <SectionCard
                  icon={Briefcase} title="Experiência e Disponibilidade"
                  description="Áreas de interesse, idiomas, disponibilidade"
                  status="complete"
                />
                <SectionCard
                  icon={Camera} title="Fotos Profissionais"
                  description="Foto de rosto e foto de corpo inteiro em evento"
                  status="complete"
                />
              </>
            )}

            <SectionCard
              icon={Landmark} title="Dados Bancários"
              description="PIX ou conta bancária para receber os pagamentos dos eventos"
              status={bankingComplete ? "complete" : "incomplete"}
              actionLabel="Adicionar"
              onExpand={() => setShowBankingForm(v => !v)}
            />
          </div>
        </div>

        {/* Vagas */}
        <div className="rounded-2xl border border-dark-700 bg-dark-900 p-6 text-center">
          <div className="w-12 h-12 rounded-xl bg-dark-800 flex items-center justify-center mx-auto mb-3">
            <Briefcase className="w-6 h-6 text-cream/20" />
          </div>
          <p className="font-semibold text-cream mb-1">Vagas disponíveis</p>
          <p className="text-cream/40 text-sm mb-4">
            {isProfileFull
              ? "Novos eventos serão exibidos aqui assim que disponíveis."
              : "Complete seu perfil para visualizar e se candidatar às vagas."}
          </p>
          {!isProfileFull && (
            <p className="text-xs text-cream/25">
              Perfil incompleto — não elegível para vagas ainda.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
