"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  AlertTriangle, CheckCircle2, ChevronRight, LogOut,
  User, Landmark, Briefcase, Settings, ArrowRight, Loader2,
} from "lucide-react";

function checkProfileComplete(data: Record<string, unknown> | null): boolean {
  if (!data) return false;
  return !!(data.nome_completo && data.cpf && data.whatsapp && data.data_nascimento && data.cep && data.cidade);
}

function checkBankingComplete(data: Record<string, unknown> | null): boolean {
  if (!data) return false;
  return !!((data.tipo_chave_pix && data.chave_pix) || (data.banco && data.conta));
}

export default function MinhaContaPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [profileComplete, setProfileComplete] = useState(false);
  const [bankingComplete, setBankingComplete] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    const raw = localStorage.getItem("cc_profile_data");
    const data = raw ? JSON.parse(raw) : null;
    const legacyProfile = localStorage.getItem("cc_profile_complete") === "true";
    const legacyBanking = localStorage.getItem("cc_banking_complete") === "true";
    setProfileComplete(checkProfileComplete(data) || legacyProfile);
    setBankingComplete(checkBankingComplete(data) || legacyBanking);
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  const user = session.user;
  const isGoogle = user.provider === "google";
  const profileSectionOk = isGoogle ? profileComplete : true;
  const fullyComplete = profileSectionOk && bankingComplete;
  const doneCount = [profileSectionOk, bankingComplete].filter(Boolean).length;
  const percent = Math.round((doneCount / 2) * 100);
  const ctaHref = !profileSectionOk && isGoogle ? "/completar-perfil" : "/minha-conta/perfil";

  return (
    <div className="min-h-screen bg-dark-950 text-cream">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-dark-900/95 backdrop-blur-xl border-b border-dark-700">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <Image src="/logo casting certo/logo casting certo.PNG" alt="Casting Certo" width={30} height={30} className="rounded-md" />
            <span className="text-sm font-bold text-cream hidden sm:block">Casting Certo</span>
          </Link>
          <div className="flex items-center gap-2">
            {user.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.image} alt="" className="w-8 h-8 rounded-full ring-2 ring-brand/30" />
            )}
            <span className="text-sm text-cream/50 hidden sm:block truncate max-w-[160px]">{user.name}</span>
            <Link href="/minha-conta/perfil"
              className="flex items-center gap-1.5 text-xs text-cream/50 hover:text-cream transition-colors border border-dark-600 hover:border-dark-500 rounded-lg px-3 py-2">
              <Settings className="w-3.5 h-3.5" /><span className="hidden sm:block">Perfil</span>
            </Link>
            <button onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-1.5 text-xs text-cream/40 hover:text-cream/70 transition-colors border border-dark-600 hover:border-dark-500 rounded-lg px-3 py-2">
              <LogOut className="w-3.5 h-3.5" />Sair
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10 max-w-lg">
        {/* Boas-vindas */}
        <div className="mb-8">
          <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-1">Área do Promotor</p>
          <h1 className="text-2xl font-bold text-cream">Olá, {user.name?.split(" ")[0] ?? "Promotor"}!</h1>
          <p className="text-cream/40 text-sm mt-1">{user.email}</p>
        </div>

        {/* ALERTA INCOMPLETO */}
        {!fullyComplete && (
          <div className="mb-6 rounded-2xl border-2 border-brand/60 bg-brand/5 overflow-hidden">
            <div className="p-5">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-brand/20 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertTriangle className="w-5 h-5 text-brand" />
                </div>
                <div>
                  <p className="font-bold text-brand text-base mb-0.5">Cadastro incompleto</p>
                  <p className="text-sm text-cream/50 leading-relaxed">
                    {isGoogle && !profileSectionOk
                      ? "Adicione suas informações pessoais, fotos e dados de pagamento para aparecer nas vagas."
                      : "Seus dados pessoais estão prontos. Adicione seus dados bancários para receber pelos eventos."}
                  </p>
                </div>
              </div>

              {/* Barra de progresso */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-cream/30 mb-1.5">
                  <span>Perfil {percent}% completo</span>
                  <span>{doneCount} de 2 seções</span>
                </div>
                <div className="h-2.5 bg-dark-700 rounded-full overflow-hidden">
                  <div className="h-full bg-brand rounded-full transition-all duration-700" style={{ width: `${percent}%` }} />
                </div>
              </div>

              {/* Itens pendentes */}
              <div className="space-y-1.5 mb-5">
                {isGoogle && !profileSectionOk && (
                  <div className="flex items-center gap-2 text-sm text-cream/60">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand shrink-0" />
                    Dados pessoais, fotos e características físicas
                  </div>
                )}
                {!bankingComplete && (
                  <div className="flex items-center gap-2 text-sm text-cream/60">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand shrink-0" />
                    Dados bancários (PIX ou conta bancária)
                  </div>
                )}
              </div>

              <Link href={ctaHref}
                className="flex items-center justify-center gap-2 py-3.5 bg-brand hover:bg-brand-light text-ink font-bold rounded-xl transition-all btn-shimmer text-sm">
                Completar cadastro <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* PERFIL COMPLETO */}
        {fullyComplete && (
          <div className="mb-6 rounded-2xl border-2 border-green-500/40 bg-green-500/5 p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="font-bold text-green-400 mb-0.5">Perfil completo!</p>
              <p className="text-cream/50 text-sm">Você está elegível para ser chamado para eventos.</p>
            </div>
          </div>
        )}

        {/* Cards de status */}
        <div className="space-y-2 mb-6">
          <Link href="/minha-conta/perfil"
            className={`flex items-center gap-3 p-4 rounded-xl border transition-all hover:bg-dark-800/50 ${
              profileSectionOk ? "border-green-500/25 bg-green-500/5" : "border-brand/30 bg-brand/5"
            }`}>
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
              profileSectionOk ? "bg-green-500/15 text-green-400" : "bg-brand/15 text-brand"
            }`}>
              <User className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-cream">Dados pessoais e fotos</p>
              <p className="text-xs text-cream/40">{profileSectionOk ? "Informações completas" : "Clique para preencher"}</p>
            </div>
            {profileSectionOk
              ? <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
              : <ChevronRight className="w-4 h-4 text-brand shrink-0" />}
          </Link>

          <Link href="/minha-conta/perfil#bancario"
            className={`flex items-center gap-3 p-4 rounded-xl border transition-all hover:bg-dark-800/50 ${
              bankingComplete ? "border-green-500/25 bg-green-500/5" : "border-brand/30 bg-brand/5"
            }`}>
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
              bankingComplete ? "bg-green-500/15 text-green-400" : "bg-brand/15 text-brand"
            }`}>
              <Landmark className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-cream">Dados bancários</p>
              <p className="text-xs text-cream/40">{bankingComplete ? "PIX ou conta configurados" : "Necessário para receber pagamentos"}</p>
            </div>
            {bankingComplete
              ? <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
              : <ChevronRight className="w-4 h-4 text-brand shrink-0" />}
          </Link>
        </div>

        {/* Link editar perfil */}
        <Link href="/minha-conta/perfil"
          className="flex items-center justify-center gap-2 w-full py-3 border border-dark-600 hover:border-dark-500 text-cream/50 hover:text-cream font-semibold rounded-xl transition-all text-sm mb-8">
          <Settings className="w-4 h-4" />Ver e editar meu perfil completo
        </Link>

        {/* Vagas */}
        <div className="rounded-2xl border border-dark-700 bg-dark-900 p-6 text-center">
          <Briefcase className="w-8 h-8 text-cream/15 mx-auto mb-3" />
          <p className="font-semibold text-cream mb-1">Vagas disponíveis</p>
          <p className="text-cream/40 text-sm">
            {fullyComplete ? "Novos eventos aparecerão aqui assim que disponíveis." : "Complete seu perfil para visualizar e se candidatar às vagas."}
          </p>
        </div>
      </main>
    </div>
  );
}
