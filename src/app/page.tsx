import Link from "next/link";
import Image from "next/image";
import LogoCarousel from "@/components/LogoCarousel";
import GaleriaGrid from "@/components/GaleriaGrid";
import MapaSPSection from "@/components/CoberturaSPSection";
import HeroRotatingText from "@/components/HeroRotatingText";
import AnimatedCounter from "@/components/AnimatedCounter";
import FadeInSection from "@/components/FadeInSection";
import WhatsAppButton from "@/components/WhatsAppButton";
import {
  ArrowRight,
  Users,
  Building2,
  Star,
  CheckCircle2,
  Shield,
  BadgeCheck,
  Zap,
  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  ChevronRight,
  Award,
  Clock,
  TrendingUp,
  HeartHandshake,
  Sparkles,
  CalendarCheck,
} from "lucide-react";

// Fotos para o mosaico de fundo do hero
const HERO_PHOTOS = Array.from({ length: 39 }, (_, i) => `/promotores/p${i + 1}.jpg`);

// Galeria: fotos + labels de eventos reais (começa em p20 para diferir do hero que exibe p1-p10 primeiro)
const GALLERY_ITEMS = [
  { src: "/promotores/p20.jpg", empresa: "Rebouças CFMUSP",    servico: "Recepção" },
  { src: "/promotores/p21.jpg", empresa: "Mix FM",             servico: "Promoção" },
  { src: "/promotores/p22.jpg", empresa: "Unilever",           servico: "Equipe" },
  { src: "/promotores/p23.jpg", empresa: "Casa de Fitness",    servico: "PDV" },
  { src: "/promotores/p24.jpg", empresa: "Ambev",              servico: "Ativação" },
  { src: "/promotores/p25.jpg", empresa: "Heineken",           servico: "Equipe" },
  { src: "/promotores/p26.jpg", empresa: "Nestlé",             servico: "Degustação" },
  { src: "/promotores/p27.jpg", empresa: "Boticário",          servico: "PDV" },
  { src: "/promotores/p28.jpg", empresa: "Claro",              servico: "Ativação" },
  { src: "/promotores/p29.jpg", empresa: "Magazine Luiza",     servico: "Recepção" },
  { src: "/promotores/p30.jpg", empresa: "Coca-Cola",          servico: "Promoção" },
  { src: "/promotores/p31.jpg", empresa: "PepsiCo",            servico: "Degustação" },
  { src: "/promotores/p32.jpg", empresa: "Adidas",             servico: "Equipe" },
  { src: "/promotores/p33.jpg", empresa: "Nike",               servico: "Ativação" },
  { src: "/promotores/p34.jpg", empresa: "FIESP",              servico: "Recepção" },
  { src: "/promotores/p35.jpg", empresa: "Expo Center Norte",  servico: "Hostess" },
  { src: "/promotores/p36.jpg", empresa: "Autopeças Show",     servico: "Equipe" },
  { src: "/promotores/p37.jpg", empresa: "Automec",            servico: "Recepção" },
  { src: "/promotores/p38.jpg", empresa: "Beauty Fair",        servico: "PDV" },
  { src: "/promotores/p1.jpg",  empresa: "Mercado Livre",       servico: "Equipe" },
  { src: "/promotores/p2.jpg",  empresa: "Assaí Atacadista",    servico: "Promoção" },
  { src: "/promotores/p3.jpg",  empresa: "Ênus",               servico: "Ativação" },
  { src: "/promotores/p4.jpg",  empresa: "Netshoes",           servico: "PDV" },
  { src: "/promotores/p5.jpg",  empresa: "Método ICIS",        servico: "Equipe" },
  { src: "/promotores/p6.jpg",  empresa: "FTW",                servico: "Promoção" },
  { src: "/promotores/p7.jpg",  empresa: "São Paulo Game",     servico: "Recepção" },
  { src: "/promotores/p8.jpg",  empresa: "Vivo",               servico: "Ativação" },
  { src: "/promotores/p9.jpg",  empresa: "Petz",               servico: "PDV" },
  { src: "/promotores/p10.jpg", empresa: "Asics",              servico: "Equipe" },
  { src: "/promotores/p11.jpg", empresa: "Oxxo",               servico: "Promoção" },
  { src: "/promotores/p12.jpg", empresa: "Nubank",             servico: "Ativação" },
  { src: "/promotores/p13.jpg", empresa: "Logitech",           servico: "Recepção" },
  { src: "/promotores/p14.jpg", empresa: "Mercado Livre",      servico: "Captação de Leads" },
  { src: "/promotores/p15.jpg", empresa: "Samsung",            servico: "PDV" },
  { src: "/promotores/p16.jpg", empresa: "L'Oréal",            servico: "Recepção" },
  { src: "/promotores/p17.jpg", empresa: "Google",             servico: "Captação de Leads" },
  { src: "/promotores/p18.jpg", empresa: "Disney+",            servico: "Ativação de Marca" },
  { src: "/promotores/p19.jpg", empresa: "Uber",               servico: "Equipe" },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTES LOCAIS
// ─────────────────────────────────────────────────────────────────────────────

function NavBar() {
  return (
    <header className="fixed top-0 w-full z-50 bg-dark-900/95 backdrop-blur-xl border-b border-dark-700">
      <div className="container mx-auto px-4 sm:px-6 h-[72px] flex items-center justify-between gap-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <Image
            src="/logo casting certo/logo casting certo.PNG"
            alt="Casting Certo"
            width={38}
            height={38}
            className="rounded-md"
          />
          <div className="leading-tight">
            <p className="text-sm font-black uppercase tracking-tight text-cream leading-tight">Casting Certo</p>
            <p className="text-[9px] font-medium text-gold uppercase tracking-widest leading-none mt-0.5">Agência de Promotores</p>
          </div>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-7">
          {[
            { label: "Como Funciona", href: "#como-funciona" },
            { label: "Serviços",       href: "#servicos" },
            { label: "Portfólio",       href: "#galeria" },
            { label: "Contato",         href: "#contato" },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="text-sm text-cream/50 hover:text-cream transition-colors relative group py-1"
            >
              {label}
              <span className="absolute bottom-0 left-0 w-0 h-px bg-brand group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-4 shrink-0">
          <a
            href="tel:+5511999999999"
            className="hidden lg:flex items-center gap-1.5 text-sm text-cream/35 hover:text-cream transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            (11) 99999-9999
          </a>
          <Link
            href="/login"
            className="hidden sm:block text-sm text-cream/40 hover:text-cream transition-colors"
          >
            Entrar
          </Link>
          <Link
            href="/contato"
            className="text-xs sm:text-sm font-bold px-3 sm:px-5 py-2 sm:py-2.5 bg-brand hover:bg-brand-light text-ink rounded transition-all whitespace-nowrap"
          >
            Solicitar Orçamento
          </Link>
        </div>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function HeroSection() {
  const bgPhotos = HERO_PHOTOS.slice(0, 12);

  return (
    <section className="relative min-h-screen flex items-center pt-[72px] overflow-hidden">

      {/* Mosaico de fotos */}
      <div className="absolute inset-0 z-0">
        {/* Mobile: 4 fotos em 2×2, rostos sem corte */}
        <div className="md:hidden grid grid-cols-2 grid-rows-2 h-full w-full gap-0.5 opacity-50">
          {bgPhotos.slice(0, 4).map((src, i) => (
            <div key={i} className="relative overflow-hidden">
              <Image
                src={src}
                alt=""
                fill
                className="object-cover object-top"
                sizes="50vw"
                priority={i < 4}
              />
            </div>
          ))}
        </div>
        {/* Desktop: 12 fotos em 6×2 */}
        <div className="hidden md:grid grid-cols-6 grid-rows-2 h-full w-full gap-0.5 opacity-50">
          {bgPhotos.map((src, i) => (
            <div key={i} className="relative overflow-hidden">
              <Image
                src={src}
                alt=""
                fill
                className="object-cover object-center"
                sizes="17vw"
                priority={i < 6}
              />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-dark-950/65 via-dark-950/55 to-dark-950/85" />
      </div>

      {/* Conteúdo */}
      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <div className="py-28 lg:py-36">

          <p className="text-xs font-semibold uppercase tracking-widest mb-6 text-gold">
            Agência de Promotores · São Paulo
          </p>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-cream leading-tight mb-3">
            Especialistas em
          </h1>
          <div className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8" style={{ minHeight: "1.3em" }}>
            <HeroRotatingText />
          </div>

          <p className="text-lg leading-relaxed mb-10 max-w-md text-cream/50">
            Promotores verificados para eventos, PDV e ativações em São Paulo.
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-3 mb-16">
            <Link
              href="/contato"
              className="group inline-flex items-center gap-2 px-8 py-3.5 bg-brand hover:bg-brand-light text-ink font-bold rounded transition-all active:scale-95 btn-shimmer"
            >
              Contratar Equipe
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/cadastro"
              className="group inline-flex items-center gap-2 px-8 py-3.5 bg-transparent border border-cream/30 hover:border-cream text-cream/70 hover:text-cream font-semibold rounded transition-all"
            >
              Quero ser Promotor
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-10 pt-8 border-t border-dark-700">
            {[
              { to: 500, suffix: "+", label: "Promotores" },
              { to: 200, suffix: "+", label: "Eventos" },
              { to: 98,  suffix: "%", label: "Satisfação" },
            ].map(({ to, suffix, label }) => (
              <div key={label}>
                <p className="text-2xl font-bold text-cream">
                  <AnimatedCounter to={to} suffix={suffix} />
                </p>
                <p className="text-xs text-gold uppercase tracking-wider mt-0.5">{label}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function ClientLogoBar() {
  return (
    <section className="py-10 bg-dark-900 border-y border-dark-700 overflow-hidden">
      <div className="container mx-auto px-6 mb-6">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-gold">
          Empresas que já confiaram na nossa equipe
        </p>
      </div>
      <LogoCarousel />
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function IntroSection() {
  return (
    <section className="py-20 bg-brand">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-ink leading-tight mb-5">
              A equipe certa,<br />no momento certo.
            </h2>
            <p className="text-ink/60 text-lg leading-relaxed mb-8 max-w-sm">
              Promotores verificados para eventos, PDV e ativações em São Paulo.
            </p>
            <a
              href="#como-funciona"
              className="inline-flex items-center gap-2 text-ink font-bold text-sm group"
            >
              Como funciona
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { to: 500, suffix: "+", label: "Promotores" },
              { to: 200, suffix: "+", label: "Eventos" },
              { to: 12,  suffix: "+", label: "Regiões em SP" },
              { to: 98,  suffix: "%", label: "Satisfação" },
            ].map(({ to, suffix, label }) => (
              <div key={label} className="p-6 rounded-xl bg-dark-900/12 hover:bg-dark-900/20 transition-colors duration-300 cursor-default">
                <p className="text-4xl font-bold text-ink mb-1">
                  <AnimatedCounter to={to} suffix={suffix} />
                </p>
                <p className="text-ink/55 text-sm font-medium uppercase tracking-wide">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function GaleriaSection() {
  return (
    <section id="galeria" className="py-24 bg-dark-800 border-t border-dark-700">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="mb-12">
          <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-3">Portfólio</p>
          <h2 className="text-3xl md:text-4xl font-bold text-cream">
            Nossa equipe em ação
          </h2>
          <p className="text-cream/40 mt-3 max-w-xl">
            Fotos reais de eventos, ativações e ações de PDV com nossos clientes.
          </p>
        </div>

        <GaleriaGrid items={GALLERY_ITEMS} />
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function ComoFuncionaSection() {
  const steps = [
    {
      number: "01",
      icon: Phone,
      title: "Briefing",
      desc: "Nos conte o que precisa.",
    },
    {
      number: "02",
      icon: Users,
      title: "Seleção",
      desc: "Escolhemos os melhores perfis.",
    },
    {
      number: "03",
      icon: CalendarCheck,
      title: "Execução",
      desc: "Equipe no local, na hora certa.",
    },
  ];

  return (
    <section id="como-funciona" className="py-24 bg-dark-900 border-t border-dark-700">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="mb-14">
          <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-3">Processo</p>
          <h2 className="text-3xl md:text-4xl font-bold text-cream">
            Como funciona
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map(({ number, icon: Icon, title, desc }) => (
            <div
              key={number}
              className="relative p-8 rounded-xl bg-dark-800 border border-dark-700 group hover:border-brand/40 hover:-translate-y-1.5 hover:shadow-[0_8px_30px_rgba(255,229,1,0.08)] transition-all duration-300"
            >
              <span className="absolute top-4 right-5 text-7xl font-black text-dark-700 select-none pointer-events-none leading-none">
                {number}
              </span>
              <div className="w-11 h-11 bg-brand/15 rounded-lg flex items-center justify-center text-brand mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-cream mb-3">{title}</h3>
              <p className="text-cream/45 leading-relaxed text-sm">{desc}</p>
              {number !== "03" && (
                <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                  <ChevronRight className="w-6 h-6 text-dark-600" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10">
          <Link
            href="/contato"
            className="inline-flex items-center gap-2 px-7 py-3 bg-brand hover:bg-brand-light text-ink font-bold rounded transition-all active:scale-95 btn-shimmer"
          >
            Solicitar Orçamento
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function ServicosSection() {
  const servicos = [
    {
      number: "01",
      icon: Users,
      title: "Promotores de Vendas",
      desc: "PDV, supermercados e farmácias.",
      tags: ["PDV", "Demonstração"],
    },
    {
      number: "02",
      icon: Star,
      title: "Hostess & Recepção",
      desc: "Feiras, congressos e eventos corporativos.",
      tags: ["Feiras", "Congressos"],
    },
    {
      number: "03",
      icon: Sparkles,
      title: "Ativação de Marca",
      desc: "Sampling, blitz e eventos de rua.",
      tags: ["Sampling", "Blitz"],
    },
    {
      number: "04",
      icon: Award,
      title: "Embaixadores de Marca",
      desc: "Representação contínua e consistente.",
      tags: ["Long-Term", "Premium"],
    },
    {
      number: "05",
      icon: TrendingUp,
      title: "Trade Marketing",
      desc: "Merchandising e gestão de estoque.",
      tags: ["Merchandising", "Relatório"],
    },
    {
      number: "06",
      icon: HeartHandshake,
      title: "Eventos Corporativos",
      desc: "Staff para premiações e convenções.",
      tags: ["Staff", "VIP"],
    },
  ];

  return (
    <section id="servicos" className="py-24 bg-dark-950 border-t border-dark-700">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="mb-14">
          <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-3">Serviços</p>
          <h2 className="text-3xl md:text-4xl font-bold text-cream">O que oferecemos</h2>
        </div>

        <div className="divide-y divide-dark-700">
          {servicos.map(({ number, icon: Icon, title, desc, tags }) => (
            <div key={number} className="flex flex-col sm:flex-row items-start gap-6 py-7 group hover:bg-dark-900/50 px-4 -mx-4 rounded-xl transition-colors duration-200">
              <div className="flex items-center gap-5 sm:w-56 shrink-0">
                <span className="text-xs font-semibold text-gold w-6 shrink-0">{number}</span>
                <div className="w-10 h-10 bg-dark-800 border border-dark-700 rounded-lg flex items-center justify-center text-brand shrink-0 group-hover:bg-brand/15 group-hover:border-brand/40 transition-all duration-300">
                  <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                </div>
                <h3 className="font-semibold text-cream text-base leading-snug">{title}</h3>
              </div>
              <p className="text-cream/40 text-sm leading-relaxed flex-1">{desc}</p>
              <div className="flex flex-wrap gap-1.5 sm:w-36 shrink-0">
                {tags.map((tag) => (
                  <span key={tag} className="px-2.5 py-0.5 rounded text-xs font-medium bg-dark-800 text-gold border border-dark-700">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function ParaQuemSection() {
  return (
    <section className="py-24 bg-dark-900 border-t border-dark-700">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="mb-14">
          <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-3">Para quem é</p>
          <h2 className="text-3xl md:text-4xl font-bold text-cream">Para quem somos</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Empresas */}
          <div className="p-8 md:p-10 rounded-xl bg-dark-800 border border-dark-700 hover:-translate-y-1 hover:border-dark-600 hover:shadow-lg hover:shadow-brand/10 transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-brand/15 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-brand" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-cream">Para Empresas</h3>
                <p className="text-cream/45 text-sm">Contrate com segurança e agilidade</p>
              </div>
            </div>
            <ul className="space-y-2.5 mb-8">
              {[
                "+500 promotores aprovados",
                "Seleção por evento e localização",
                "Gestão completa do início ao fim",
                "Orçamento em menos de 24h",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <CheckCircle2 className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                  <span className="text-cream/70 text-sm">{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/contato"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand hover:bg-brand-light text-dark-900 font-bold rounded transition-all active:scale-95 btn-shimmer"
            >
              Solicitar Orçamento
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Promotores */}
          <div className="p-8 md:p-10 rounded-xl bg-dark-800 border border-dark-700 hover:-translate-y-1 hover:border-dark-600 hover:shadow-lg hover:shadow-brand/10 transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-brand/15 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-brand" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-cream">Para Promotores</h3>
                <p className="text-cream/45 text-sm">Trabalhe nos melhores eventos</p>
              </div>
            </div>
            <ul className="space-y-2.5 mb-8">
              {[
                "Cadastro 100% gratuito",
                "Vagas em eventos, feiras e PDV",
                "Pagamento pontual via plataforma",
                "Suporte em todos os eventos",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <CheckCircle2 className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                  <span className="text-cream/70 text-sm">{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/cadastro"
              className="inline-flex items-center gap-2 px-6 py-3 border border-cream/25 text-cream hover:bg-dark-900/20 font-semibold rounded transition-all"
            >
              Quero me Cadastrar
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function DiferenciaisSection() {
  const diferenciais = [
    {
      icon: Shield,
      title: "Seleção Rigorosa",
      desc: "Entrevista e aprovação manual antes do cadastro.",
    },
    {
      icon: BadgeCheck,
      title: "Perfis Verificados",
      desc: "Dados, fotos e histórico conferidos.",
    },
    {
      icon: Zap,
      title: "Resposta em 24h",
      desc: "Proposta com perfis selecionados em até 24h.",
    },
    {
      icon: Clock,
      title: "Pontualidade",
      desc: "Substituição imediata em caso de imprevisto.",
    },
    {
      icon: TrendingUp,
      title: "Gestão Completa",
      desc: "Da seleção ao relatório pós-evento.",
    },
    {
      icon: HeartHandshake,
      title: "Parceria Duradoura",
      desc: "Equipes cada vez mais alinhadas à sua marca.",
    },
  ];

  return (
    <section className="relative overflow-hidden py-24 bg-dark-900 border-t border-dark-700">
      {/* Watermark da logo no fundo */}
      <div className="absolute -right-16 top-1/2 -translate-y-1/2 w-[520px] h-[520px] pointer-events-none select-none opacity-[0.10]">
        <Image
          src="/logo casting certo/somente logo sem nome.png"
          alt=""
          fill
          className="object-contain"
          sizes="520px"
        />
      </div>

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="mb-14">
          <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-3">Diferenciais</p>
          <h2 className="text-3xl md:text-4xl font-bold text-cream">Por que a Casting Certo?</h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-x-12 gap-y-8">
          {diferenciais.map(({ icon: Icon, title, desc }, index) => (
            <FadeInSection key={title} delay={index * 100} direction="up">
              <div className="flex gap-4 group">
                <div className="w-9 h-9 bg-brand/15 rounded-lg flex items-center justify-center text-brand shrink-0 mt-0.5 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-cream text-sm mb-1">{title}</h4>
                  <p className="text-cream/40 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function TestimonialsSection() {
  const depoimentos = [
    {
      quote:
        "A Casting Certo montou nossa equipe de 30 promotores para a Automec em 48 horas. Profissionalismo de outro nível.",
      author: "Ricardo M.",
      company: "Gerente de Marketing · Bosch Brasil",
      rating: 5,
      initials: "RM",
    },
    {
      quote:
        "Já usamos outras agências antes, mas a diferença é absurda. Os promotores chegaram treinados, uniformizados e com briefing na ponta da língua.",
      author: "Fernanda L.",
      company: "Diretora de Trade · PepsiCo",
      rating: 5,
      initials: "FL",
    },
    {
      quote:
        "Excelente parceria para nosso PDV em toda a região Sudeste. Relatórios detalhados e equipe engajada. Recomendo sem dúvidas.",
      author: "Carlos V.",
      company: "Gerente Comercial · Heineken",
      rating: 5,
      initials: "CV",
    },
  ];

  return (
    <section className="py-24 bg-cream">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="mb-14">
          <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-3">Depoimentos</p>
          <h2 className="text-3xl md:text-4xl font-bold text-ink">
            O que dizem sobre a gente
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {depoimentos.map(({ quote, author, company, rating, initials }, index) => (
            <FadeInSection key={author} delay={index * 150} direction="up">
              <div
                className="p-7 rounded-xl bg-dark-900/6 border border-dark-900/10 flex flex-col hover:-translate-y-1.5 hover:border-dark-900/25 hover:shadow-xl cursor-default transition-all duration-300"
              >
              <div className="flex gap-0.5 mb-4">
                {[...Array(rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-brand text-brand" />
                ))}
              </div>
              <blockquote className="text-ink/60 text-sm leading-relaxed mb-6 flex-1">
                &ldquo;{quote}&rdquo;
              </blockquote>
              <div className="pt-4 border-t border-dark-900/10 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gold flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-white">{initials}</span>
                </div>
                <div>
                  <p className="font-semibold text-ink text-sm">{author}</p>
                  <p className="text-gold text-xs mt-0.5">{company}</p>
                </div>
              </div>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function CtaSection() {
  return (
    <section className="py-20 bg-brand">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-5xl font-bold text-ink mb-3">
              Pronto para montar sua equipe?
            </h2>
            <p className="text-ink/55 text-lg">Proposta em até 24 horas.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/contato"
              className="group inline-flex items-center gap-2 px-7 py-3.5 bg-dark-900 hover:bg-dark-800 text-cream font-bold rounded transition-all active:scale-95 btn-shimmer"
            >
              Solicitar Orçamento
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="https://wa.me/5511999999999?text=Ol%C3%A1!%20Tenho%20interesse%20em%20contratar%20promotores."
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 px-7 py-3.5 border border-ink/20 text-ink hover:bg-ink/10 font-semibold rounded transition-all"
            >
              WhatsApp
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer id="contato" className="bg-dark-950 border-t border-dark-700 pt-16 pb-8">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Coluna 1: Marca */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="text-xl font-bold text-cream">
                Casting <span className="text-brand">Certo</span>
              </span>
            </Link>
            <p className="text-cream/35 text-sm leading-relaxed max-w-sm">
              Agência de promotores, hostess e ativadores de marca para eventos, feiras, PDV e ativações em
              todo o Brasil.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-dark-700 hover:bg-brand transition-colors flex items-center justify-center group"
              >
                <Instagram className="w-4 h-4 text-cream/50 group-hover:text-dark-900" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-dark-700 hover:bg-brand transition-colors flex items-center justify-center group"
              >
                <Facebook className="w-4 h-4 text-cream/50 group-hover:text-dark-900" />
              </a>
            </div>
          </div>

          {/* Coluna 2: Links */}
          <div>
            <h4 className="font-bold text-gold text-xs uppercase tracking-wider mb-4">
              Navegação
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Como Funciona", href: "#como-funciona" },
                { label: "Serviços", href: "#servicos" },
                { label: "Para Empresas", href: "/contato" },
                { label: "Para Promotores", href: "/cadastro" },
                { label: "Entrar", href: "/login" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-cream/35 hover:text-cream text-sm transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 3: Contato */}
          <div>
            <h4 className="font-bold text-gold text-xs uppercase tracking-wider mb-4">
              Contato
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2.5 text-cream/35 text-sm">
                <Phone className="w-4 h-4 text-brand shrink-0" />
                <span>(11) 99999-9999</span>
              </li>
              <li className="flex items-center gap-2.5 text-cream/35 text-sm">
                <Mail className="w-4 h-4 text-brand shrink-0" />
                <span>contato@castingcerto.com.br</span>
              </li>
              <li className="flex items-start gap-2.5 text-cream/35 text-sm">
                <MapPin className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                <span>São Paulo - SP</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-dark-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-cream/20 text-xs text-center sm:text-left">
            © {new Date().getFullYear()} Casting Certo. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacidade" className="text-cream/20 hover:text-cream/50 text-xs transition-colors">
              Política de Privacidade
            </Link>
            <Link href="/termos" className="text-cream/20 hover:text-cream/50 text-xs transition-colors">
              Termos de Uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PÁGINA PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <main className="min-h-screen bg-dark-950 text-cream overflow-x-hidden">
      <NavBar />
      <HeroSection />
      <ClientLogoBar />
      <IntroSection />
      <ComoFuncionaSection />
      <ServicosSection />
      <GaleriaSection />
      <MapaSPSection />
      <ParaQuemSection />
      <DiferenciaisSection />
      <TestimonialsSection />
      <CtaSection />
      <Footer />
      <WhatsAppButton />
    </main>
  );
}
