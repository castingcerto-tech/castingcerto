"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { LogOut, Briefcase, Settings, ArrowRight, Loader2 } from "lucide-react";

export default function MinhaContaPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

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

        {/* Completar cadastro */}
        <Link href="/minha-conta/perfil"
          className="flex items-center justify-between gap-4 w-full p-5 mb-8 rounded-2xl bg-brand hover:bg-brand-light text-ink font-bold transition-all btn-shimmer">
          <span className="text-base">Completar cadastro</span>
          <ArrowRight className="w-5 h-5 shrink-0" />
        </Link>

        {/* Vagas */}
        <div className="rounded-2xl border border-dark-700 bg-dark-900 p-6 text-center">
          <Briefcase className="w-8 h-8 text-cream/15 mx-auto mb-3" />
          <p className="font-semibold text-cream mb-1">Vagas disponíveis</p>
          <p className="text-cream/40 text-sm">Complete seu perfil para visualizar e se candidatar às vagas.</p>
        </div>
      </main>
    </div>
  );
}


