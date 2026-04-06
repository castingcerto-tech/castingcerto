"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { AlertTriangle, X } from "lucide-react";

export default function CompletarCadastroBanner() {
  const { data: session, status } = useSession();
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (status !== "authenticated" || !session) return;

    // Verifica cache local primeiro para resposta imediata
    const cached = localStorage.getItem("cc_profile_data");
    if (cached) {
      try {
        const p = JSON.parse(cached);
        const complete = !!(p.nome_completo && p.cpf && p.whatsapp && p.data_nascimento);
        setShow(!complete);
        if (complete) return;
      } catch { /* ignore */ }
    }

    // Busca do banco
    fetch("/api/profile")
      .then(r => r.json())
      .then(data => {
        if (!data.perfil) {
          setShow(true);
          return;
        }
        const p = data.perfil;
        const complete = !!(p.nome_completo && p.cpf && p.whatsapp && p.data_nascimento);
        setShow(!complete);
        localStorage.setItem("cc_profile_data", JSON.stringify(p));
      })
      .catch(() => {
        if (!cached) setShow(true);
      });
  }, [status, session]);

  if (!show || dismissed) return null;

  return (
    <div className="w-full bg-brand text-ink px-4 py-2.5 flex items-center justify-between gap-3 text-sm font-semibold shadow-md">
      <div className="flex items-center gap-2 min-w-0">
        <AlertTriangle className="w-4 h-4 shrink-0" />
        <span className="truncate">Cadastro incompleto — complete seu perfil para aparecer nas vagas</span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Link
          href="/minha-conta/perfil"
          className="whitespace-nowrap underline underline-offset-2 hover:no-underline font-bold"
        >
          Completar agora
        </Link>
        <button
          onClick={() => setDismissed(true)}
          aria-label="Fechar"
          className="hover:opacity-60 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
