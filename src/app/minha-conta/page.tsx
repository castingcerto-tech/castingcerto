"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { LogOut, Briefcase, Settings, ArrowRight, Loader2, Pencil, ChevronDown, User, HelpCircle, Clock, XCircle, AlertTriangle, Shield } from "lucide-react";

function isComplete(p: Record<string, unknown> | null): boolean {
  if (!p) return false;
  return !!(p.nome_completo && p.cpf && p.whatsapp && p.data_nascimento && p.cep && p.cidade);
}

export default function MinhaContaPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [complete, setComplete] = useState<boolean | null>(null);
  const [userStatus, setUserStatus] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    // Cache imediato
    const raw = localStorage.getItem("cc_profile_data");
    if (raw) {
      try { setComplete(isComplete(JSON.parse(raw))); } catch { /* ignore */ }
    }
    // Busca real do banco
    fetch("/api/profile")
      .then(r => r.json())
      .then(data => {
        if (data.userStatus) setUserStatus(data.userStatus);
        const ok = isComplete(data.perfil);
        setComplete(ok);
        if (data.perfil) localStorage.setItem("cc_profile_data", JSON.stringify(data.perfil));
      })
      .catch(() => { /* usa cache */ });
  }, [status]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  const user = session.user;

  return (
    <div className="min-h-screen bg-dark-950 text-cream">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-dark-900/95 backdrop-blur-xl border-b border-dark-700">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/minha-conta" className="flex items-center gap-2.5 shrink-0">
            <Image src="/logo casting certo/logo casting certo.PNG" alt="Casting Certo" width={30} height={30} className="rounded-md" />
            <span className="text-sm font-bold text-cream hidden sm:block">Casting Certo</span>
          </Link>

          {/* Avatar com dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(v => !v)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-dark-800 transition-colors"
            >
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.image} alt="" className="w-8 h-8 rounded-full ring-2 ring-brand/40 shrink-0" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-brand" />
                </div>
              )}
              <span className="text-sm text-cream/70 hidden sm:block truncate max-w-[140px]">
                {user.name?.split(" ")[0]}
              </span>
              <ChevronDown className={`w-4 h-4 text-cream/40 transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown */}
            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-dark-800 border border-dark-600 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden animate-fade-in z-50">
                {/* Info do usuário */}
                <div className="px-4 py-3 border-b border-dark-700">
                  <p className="text-sm font-semibold text-cream truncate">{user.name}</p>
                  <p className="text-xs text-cream/40 truncate">{user.email}</p>
                </div>

                {/* Links */}
                <div className="py-1.5">
                  <Link href="/minha-conta"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-cream/70 hover:text-cream hover:bg-dark-700 transition-colors">
                    <Briefcase className="w-4 h-4 text-brand shrink-0" />
                    Minha Conta
                  </Link>
                  <Link href="/minha-conta/perfil"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-cream/70 hover:text-cream hover:bg-dark-700 transition-colors">
                    <Settings className="w-4 h-4 text-brand shrink-0" />
                    Editar Perfil
                  </Link>
                  <Link href="mailto:contato@castingcerto.com.br"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-cream/70 hover:text-cream hover:bg-dark-700 transition-colors">
                    <HelpCircle className="w-4 h-4 text-brand shrink-0" />
                    Suporte
                  </Link>
                  {session.user?.role === "ADMIN" && (
                    <Link href="/admin"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-cream/70 hover:text-cream hover:bg-dark-700 transition-colors">
                      <Shield className="w-4 h-4 text-brand shrink-0" />
                      Painel Admin
                    </Link>
                  )}
                </div>

                {/* Sair */}
                <div className="border-t border-dark-700 py-1.5">
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-dark-700 transition-colors">
                    <LogOut className="w-4 h-4 shrink-0" />
                    Sair da conta
                  </button>
                </div>
              </div>
            )}
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

        {/* Alerta de cadastro incompleto */}
        {complete === false && userStatus !== "REPROVADO" && (
          <Link href="/minha-conta/perfil"
            className="flex items-center justify-between gap-4 w-full p-5 mb-8 rounded-2xl bg-brand hover:bg-brand-light text-ink font-bold transition-all btn-shimmer">
            <span className="text-base">Completar cadastro</span>
            <ArrowRight className="w-5 h-5 shrink-0" />
          </Link>
        )}

        {/* Banner: Em Análise */}
        {userStatus === "PENDENTE" && complete !== false && (
          <div className="mb-8 rounded-2xl border border-brand/30 bg-brand/5 p-6 text-center">
            <Clock className="w-10 h-10 text-brand mx-auto mb-3" />
            <h2 className="text-lg font-bold text-cream mb-2">Cadastro em Análise</h2>
            <p className="text-cream/60 text-sm leading-relaxed max-w-md mx-auto">
              Recebemos seu cadastro com sucesso! Nossa equipe está analisando seu perfil e suas fotos.
              <br /><br />
              Quando seu cadastro for <strong className="text-brand">aprovado</strong>, você será notificado por e-mail e terá acesso completo ao mural de vagas.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-800 border border-dark-700">
              <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
              <span className="text-sm font-semibold text-brand">Pendente</span>
            </div>
          </div>
        )}

        {/* Banner: Necessita Correção */}
        {userStatus === "CORRECAO" && (
          <div className="mb-8 rounded-2xl border border-blue-500/30 bg-blue-500/5 p-6 text-center">
            <AlertTriangle className="w-10 h-10 text-blue-400 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-cream mb-2">Ajuste Necessário</h2>
            <p className="text-cream/60 text-sm leading-relaxed max-w-md mx-auto">
              Nosso time identificou algo no seu cadastro que precisa ser corrigido. Por favor, atualize seus dados.
            </p>
            <Link href="/minha-conta/perfil"
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-semibold text-sm transition-colors">
              <Pencil className="w-4 h-4" />
              Corrigir Perfil
            </Link>
          </div>
        )}

        {/* Banner: Reprovado */}
        {userStatus === "REPROVADO" && (
          <div className="mb-8 rounded-2xl border border-red-500/30 bg-red-500/5 p-6 text-center">
            <XCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-cream mb-2">Cadastro Não Aprovado</h2>
            <p className="text-cream/60 text-sm leading-relaxed max-w-md mx-auto">
              Infelizmente seu cadastro não foi aprovado neste momento. Em caso de dúvidas, entre em contato com nosso suporte.
            </p>
          </div>
        )}

        {/* Vagas — só mostra se aprovado ou sem status carregado ainda */}
        {(userStatus === "APROVADO" || userStatus === null) && (
          <div className="rounded-2xl border border-dark-700 bg-dark-900 p-6 text-center">
            <Briefcase className="w-8 h-8 text-cream/15 mx-auto mb-3" />
            <p className="font-semibold text-cream mb-1">Vagas disponíveis</p>
            <p className="text-cream/40 text-sm">
              {complete ? "Novos eventos aparecerão aqui assim que disponíveis." : "Complete seu perfil para visualizar e se candidatar às vagas."}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}


