"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/minha-conta");
    }
  }, [status, router]);

  // Enquanto verifica sessão, não mostra nada (a landing page renderiza por baixo pelo server)
  // Se autenticado, redireciona antes de qualquer coisa
  return null;
}
