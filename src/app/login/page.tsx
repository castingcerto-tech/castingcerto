"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, AlertCircle, Loader2, ArrowLeft } from "lucide-react";

function GoogleIcon() {
  return (
    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

const inputCls =
  "w-full bg-dark-800 border border-dark-600 rounded-xl px-4 py-3 text-cream placeholder-cream/20 text-sm focus:outline-none focus:border-brand/60 transition-colors";

export default function LoginPage() {
  const router = useRouter();
  const [email,         setEmail]         = useState("");
  const [password,      setPassword]      = useState("");
  const [show,          setShow]          = useState(false);
  const [loading,       setLoading]       = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error,         setError]         = useState("");

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("Email ou senha incorretos.");
    } else {
      router.push("/minha-conta");
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">

        {/* Voltar */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-cream/40 hover:text-cream/70 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Voltar ao site
        </Link>

        {/* Logo + título */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 justify-center mb-5">
            <Image src="/logo casting certo/logo casting certo.PNG" alt="Casting Certo" width={40} height={40} className="rounded-md" />
            <span className="text-xl font-bold text-cream">Casting Certo</span>
          </Link>
          <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-2">Área do Promotor</p>
          <h1 className="text-2xl font-bold text-cream">Entrar na sua conta</h1>
          <p className="text-cream/40 text-sm mt-1">Acesse seu perfil e acompanhe as vagas disponíveis</p>
        </div>

        {/* Google */}
        <button
          type="button"
          onClick={handleGoogle}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-white hover:bg-gray-50 text-gray-800 font-semibold rounded-xl transition-all mb-5 disabled:opacity-60 shadow-sm"
        >
          {googleLoading ? <Loader2 className="w-5 h-5 animate-spin text-gray-500" /> : <GoogleIcon />}
          {googleLoading ? "Entrando..." : "Continuar com Google"}
        </button>

        {/* Divisor */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-dark-600" />
          <span className="text-xs text-cream/30 font-medium">ou entre com e-mail</span>
          <div className="flex-1 h-px bg-dark-600" />
        </div>

        {/* Email + senha */}
        <form onSubmit={handleCredentials} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-cream/60 uppercase tracking-wider mb-1.5">
              E-mail
            </label>
            <input
              type="email" className={inputCls} placeholder="seuemail@exemplo.com"
              value={email} onChange={e => setEmail(e.target.value)} required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-cream/60 uppercase tracking-wider mb-1.5">
              Senha
            </label>
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                className={inputCls + " pr-12"}
                placeholder="Sua senha"
                value={password} onChange={e => setPassword(e.target.value)} required
              />
              <button type="button" onClick={() => setShow(v => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/30 hover:text-cream/70 transition-colors">
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="flex items-center gap-2 text-sm text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0" />{error}
            </p>
          )}

          <button type="submit" disabled={loading}
            className="w-full py-3.5 bg-brand hover:bg-brand-light text-ink font-bold rounded-xl transition-all btn-shimmer disabled:opacity-60 flex items-center justify-center gap-2 mt-2">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Entrando...</> : "Entrar"}
          </button>
        </form>

        <p className="text-center text-sm text-cream/30 mt-6">
          Não tem conta?{" "}
          <Link href="/cadastro" className="text-cream/60 hover:text-cream underline transition-colors">
            Fazer cadastro gratuito
          </Link>
        </p>
      </div>
    </div>
  );
}
