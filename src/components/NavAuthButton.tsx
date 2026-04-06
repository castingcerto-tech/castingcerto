"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { User } from "lucide-react";

export default function NavAuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <span className="hidden sm:block text-sm text-cream/20">...</span>;
  }

  if (session) {
    return (
      <Link
        href="/minha-conta"
        className="hidden sm:flex items-center gap-2 text-sm text-cream/60 hover:text-cream transition-colors"
      >
        {session.user?.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={session.user.image}
            alt=""
            className="w-6 h-6 rounded-full ring-1 ring-brand/40"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-brand/20 flex items-center justify-center">
            <User className="w-3 h-3 text-brand" />
          </div>
        )}
        Minha Conta
      </Link>
    );
  }

  return (
    <Link
      href="/login"
      className="hidden sm:block text-sm text-cream/40 hover:text-cream transition-colors"
    >
      Entrar
    </Link>
  );
}
