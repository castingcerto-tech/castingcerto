"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Building2,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  X,
  Shield,
} from "lucide-react";
import { signOut } from "next-auth/react";

const NAV_ITEMS = [
  { href: "/admin",            icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/promotores",  icon: Users,           label: "Promotores" },
  { href: "/admin/trabalhos",   icon: Briefcase,       label: "Trabalhos" },
  { href: "/admin/clientes",    icon: Building2,       label: "Clientes" },
  { href: "/admin/orcamentos",  icon: FileText,        label: "Orçamentos" },
  { href: "/admin/usuarios",    icon: Shield,          label: "Administradores" },
  { href: "/admin/configuracoes", icon: Settings,      label: "Configurações" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated" && session?.user?.role !== "ADMIN") router.push("/minha-conta");
  }, [status, session, router]);

  if (status === "loading" || !session) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (session.user?.role !== "ADMIN") return null;

  return (
    <div className="min-h-screen bg-dark-950 text-cream flex">
      {/* Overlay mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-50 bg-dark-900 border-r border-dark-700 flex flex-col transition-all duration-300
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static
          ${collapsed ? "w-[72px]" : "w-64"}
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-4 border-b border-dark-700 shrink-0">
          <Image
            src="/logo casting certo/logo casting certo.PNG"
            alt="Casting Certo"
            width={32}
            height={32}
            className="rounded-md shrink-0"
          />
          {!collapsed && <span className="font-bold text-sm text-cream truncate">Painel Admin</span>}
          {/* Fechar mobile */}
          <button className="ml-auto lg:hidden text-cream/40 hover:text-cream" onClick={() => setMobileOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                text-cream/60 hover:text-cream hover:bg-dark-800
                ${collapsed ? "justify-center" : ""}
              `}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Collapse toggle (desktop only) */}
        <div className="hidden lg:flex items-center justify-center py-3 border-t border-dark-700">
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="w-8 h-8 rounded-lg bg-dark-800 hover:bg-dark-700 flex items-center justify-center text-cream/40 hover:text-cream transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* User / Sair */}
        <div className="px-3 py-3 border-t border-dark-700 shrink-0">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className={`
              flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-dark-800 transition-colors
              ${collapsed ? "justify-center" : ""}
            `}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && <span>Sair</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-dark-900/80 backdrop-blur-xl border-b border-dark-700 flex items-center px-6 gap-4 shrink-0 sticky top-0 z-30">
          <button className="lg:hidden text-cream/60 hover:text-cream" onClick={() => setMobileOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-sm text-cream/50 hidden sm:block">{session.user?.email}</span>
            <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center text-brand text-xs font-bold">
              {session.user?.name?.charAt(0)?.toUpperCase() ?? "A"}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
