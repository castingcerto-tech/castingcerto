"use client";

import { useEffect, useRef, useState } from "react";
import { useSession }                   from "next-auth/react";
import { useRouter }                    from "next/navigation";
import Link                             from "next/link";
import Image                            from "next/image";
import {
  User, MapPin, Ruler, Briefcase, Camera,
  ArrowLeft, ArrowRight, CheckCircle2, Loader2, AlertCircle,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type FormData = {
  // Pessoal
  nome_completo: string; cpf: string; rg: string; data_nascimento: string;
  genero: string; etnia: string; whatsapp: string; instagram: string;
  // Endereço
  cep: string; endereco: string; numero: string; bairro: string;
  cidade: string; estado: string;
  // Físico
  altura: string; peso: string; manequim: string; tamanho_camiseta: string;
  calcado: string; olhos: string; cabelo_tipo: string; cabelo_comprimento: string;
  // Profissional
  areas_interesse: string[]; experiencia: string; disponibilidade: string;
  nivel_ingles: string; nivel_espanhol: string;
  // Fotos
  foto_rosto: File | null; foto_corpo: File | null;
};

const INITIAL: FormData = {
  nome_completo: "", cpf: "", rg: "", data_nascimento: "", genero: "",
  etnia: "", whatsapp: "", instagram: "",
  cep: "", endereco: "", numero: "", bairro: "", cidade: "", estado: "",
  altura: "", peso: "", manequim: "", tamanho_camiseta: "", calcado: "",
  olhos: "", cabelo_tipo: "", cabelo_comprimento: "",
  areas_interesse: [], experiencia: "", disponibilidade: "",
  nivel_ingles: "", nivel_espanhol: "",
  foto_rosto: null, foto_corpo: null,
};

const STEPS = [
  { id: 1, label: "Pessoal",      icon: User },
  { id: 2, label: "Endereço",     icon: MapPin },
  { id: 3, label: "Físico",       icon: Ruler },
  { id: 4, label: "Profissional", icon: Briefcase },
  { id: 5, label: "Fotos",        icon: Camera },
];

const AREAS = [
  "Eventos","Feiras e Exposições","PDV e Supermercados",
  "Ativação de Marca","Promotora de Vendas","Recepcionista",
  "Modelo Fotográfico","Hostess","Outros",
];

// ─── CSS helpers ─────────────────────────────────────────────────────────────

const inputCls =
  "w-full bg-dark-800 border border-dark-600 rounded-lg px-4 py-3 text-cream placeholder-cream/20 text-sm focus:outline-none focus:border-brand/60 focus:bg-dark-700 transition-colors";
const selectCls = inputCls + " appearance-none cursor-pointer";

function Field({ label, req = false, error, children }: {
  label: string; req?: boolean; error?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-cream/60 uppercase tracking-wider mb-1.5">
        {label}{req && <span className="text-brand ml-1">*</span>}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5 shrink-0" />{error}</p>}
    </div>
  );
}

// ─── Masks ───────────────────────────────────────────────────────────────────

function maskCpf(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  return d.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4")
          .replace(/(\d{3})(\d{3})(\d{1,3})$/,        "$1.$2.$3")
          .replace(/(\d{3})(\d{1,3})$/,                "$1.$2")
          .replace(/^(\d{1,3})/,                        "$1");
}
function maskPhone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 7) return `(${d.slice(0,2)}) ${d.slice(2)}`;
  return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
}
function maskCep(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 8);
  return d.length > 5 ? `${d.slice(0,5)}-${d.slice(5)}` : d;
}
function maskAltura(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 3);
  if (d.length === 3) return `${d[0]},${d.slice(1)} m`;
  return d;
}

// ─── Steps ────────────────────────────────────────────────────────────────────

function Step1({ fd, set }: { fd: FormData; set: (k: keyof FormData, v: unknown) => void }) {
  return (
    <div className="grid sm:grid-cols-2 gap-5">
      <div className="sm:col-span-2">
        <Field label="Nome Completo" req>
          <input className={inputCls} value={fd.nome_completo}
            onChange={e => set("nome_completo", e.target.value)} placeholder="Como aparece no RG" />
        </Field>
      </div>
      <Field label="CPF" req>
        <input className={inputCls} value={fd.cpf} inputMode="numeric"
          onChange={e => set("cpf", maskCpf(e.target.value))} placeholder="000.000.000-00" />
      </Field>
      <Field label="RG">
        <input className={inputCls} value={fd.rg}
          onChange={e => set("rg", e.target.value.replace(/[^0-9Xx\-]/g,"").slice(0,12))} placeholder="0000000-0" />
      </Field>
      <Field label="Data de Nascimento" req>
        <input type="date" className={inputCls} value={fd.data_nascimento}
          onChange={e => set("data_nascimento", e.target.value)} />
      </Field>
      <Field label="Gênero" req>
        <select className={selectCls} value={fd.genero} onChange={e => set("genero", e.target.value)}>
          <option value="">Selecione...</option>
          <option>Feminino</option><option>Masculino</option><option>Não-binário</option><option>Prefiro não informar</option>
        </select>
      </Field>
      <Field label="Etnia">
        <select className={selectCls} value={fd.etnia} onChange={e => set("etnia", e.target.value)}>
          <option value="">Selecione...</option>
          <option>Branco(a)</option><option>Pardo(a)</option><option>Preto(a)</option>
          <option>Amarelo(a)</option><option>Indígena</option><option>Prefiro não informar</option>
        </select>
      </Field>
      <Field label="WhatsApp" req>
        <input className={inputCls} value={fd.whatsapp} inputMode="tel"
          onChange={e => set("whatsapp", maskPhone(e.target.value))} placeholder="(11) 99999-9999" />
      </Field>
      <Field label="Instagram">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/30 text-sm pointer-events-none select-none">@</span>
          <input className={inputCls + " pl-8"} value={fd.instagram}
            onChange={e => set("instagram", e.target.value.replace(/^@/, ""))} placeholder="seuperfil" />
        </div>
      </Field>
    </div>
  );
}

function Step2({ fd, set }: { fd: FormData; set: (k: keyof FormData, v: unknown) => void }) {
  const [loading, setLoading] = useState(false);

  const buscarCep = async () => {
    const raw = fd.cep.replace(/\D/g, "");
    if (raw.length !== 8) return;
    setLoading(true);
    try {
      const r = await fetch(`https://viacep.com.br/ws/${raw}/json/`);
      const d = await r.json();
      if (!d.erro) {
        set("endereco", d.logradouro ?? "");
        set("bairro",   d.bairro    ?? "");
        set("cidade",   d.localidade ?? "");
        set("estado",   d.uf        ?? "");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid sm:grid-cols-2 gap-5">
      <div className="sm:col-span-2">
        <Field label="CEP" req>
          <div className="flex gap-2">
            <input className={inputCls} value={fd.cep} inputMode="numeric"
              onChange={e => set("cep", maskCep(e.target.value))}
              onBlur={buscarCep} placeholder="00000-000" />
            <button type="button" onClick={buscarCep} disabled={loading}
              className="px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-xs font-semibold text-cream/60 hover:text-cream hover:border-dark-500 transition-all shrink-0 disabled:opacity-50">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Buscar"}
            </button>
          </div>
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field label="Endereço / Logradouro" req>
          <input className={inputCls} value={fd.endereco}
            onChange={e => set("endereco", e.target.value)} placeholder="Rua, Avenida..." />
        </Field>
      </div>
      <Field label="Número" req>
        <input className={inputCls} value={fd.numero} inputMode="numeric"
          onChange={e => set("numero", e.target.value.replace(/\D/g,""))} placeholder="123" />
      </Field>
      <Field label="Bairro">
        <input className={inputCls} value={fd.bairro}
          onChange={e => set("bairro", e.target.value)} placeholder="Seu bairro" />
      </Field>
      <Field label="Cidade" req>
        <input className={inputCls} value={fd.cidade}
          onChange={e => set("cidade", e.target.value)} placeholder="São Paulo" />
      </Field>
      <Field label="Estado" req>
        <select className={selectCls} value={fd.estado} onChange={e => set("estado", e.target.value)}>
          <option value="">UF</option>
          {["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG",
            "PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"].map(uf =>
            <option key={uf}>{uf}</option>
          )}
        </select>
      </Field>
    </div>
  );
}

function Step3({ fd, set }: { fd: FormData; set: (k: keyof FormData, v: unknown) => void }) {
  return (
    <div className="grid sm:grid-cols-2 gap-5">
      <Field label="Altura" req>
        <input className={inputCls} value={fd.altura} inputMode="numeric"
          onChange={e => set("altura", maskAltura(e.target.value))} placeholder="1,70 m" />
      </Field>
      <Field label="Peso (kg)">
        <input className={inputCls} value={fd.peso} inputMode="numeric"
          onChange={e => set("peso", e.target.value.replace(/\D/g,"").slice(0,3))} placeholder="65" />
      </Field>
      <Field label="Manequim / Tamanho">
        <select className={selectCls} value={fd.manequim} onChange={e => set("manequim", e.target.value)}>
          <option value="">Selecione...</option>
          {["PP","P","M","G","GG","XGG"].map(t => <option key={t}>{t}</option>)}
        </select>
      </Field>
      <Field label="Tamanho de Camiseta">
        <select className={selectCls} value={fd.tamanho_camiseta} onChange={e => set("tamanho_camiseta", e.target.value)}>
          <option value="">Selecione...</option>
          {["PP","P","M","G","GG","XGG"].map(t => <option key={t}>{t}</option>)}
        </select>
      </Field>
      <Field label="Número do Calçado">
        <input className={inputCls} value={fd.calcado} inputMode="numeric"
          onChange={e => set("calcado", e.target.value.replace(/\D/g,"").slice(0,2))} placeholder="37" />
      </Field>
      <Field label="Cor dos Olhos">
        <select className={selectCls} value={fd.olhos} onChange={e => set("olhos", e.target.value)}>
          <option value="">Selecione...</option>
          {["Pretos","Castanhos","Verdes","Azuis","Mel","Cinzas"].map(o => <option key={o}>{o}</option>)}
        </select>
      </Field>
      <Field label="Tipo de Cabelo">
        <select className={selectCls} value={fd.cabelo_tipo} onChange={e => set("cabelo_tipo", e.target.value)}>
          <option value="">Selecione...</option>
          {["Liso","Ondulado","Cacheado","Crespo"].map(t => <option key={t}>{t}</option>)}
        </select>
      </Field>
      <Field label="Comprimento do Cabelo">
        <select className={selectCls} value={fd.cabelo_comprimento} onChange={e => set("cabelo_comprimento", e.target.value)}>
          <option value="">Selecione...</option>
          {["Careca","Muito Curto","Curto","Médio","Longo","Muito Longo"].map(c => <option key={c}>{c}</option>)}
        </select>
      </Field>
    </div>
  );
}

function Step4({ fd, set }: { fd: FormData; set: (k: keyof FormData, v: unknown) => void }) {
  const toggleArea = (area: string) => {
    const cur = fd.areas_interesse;
    set("areas_interesse", cur.includes(area) ? cur.filter(a => a !== area) : [...cur, area]);
  };
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold text-cream/60 uppercase tracking-wider mb-3">
          Áreas de Interesse <span className="text-brand">*</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {AREAS.map(area => (
            <button type="button" key={area} onClick={() => toggleArea(area)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                fd.areas_interesse.includes(area)
                  ? "bg-brand/20 border-brand/50 text-brand"
                  : "bg-dark-800 border-dark-600 text-cream/50 hover:border-dark-500"
              }`}>{area}</button>
          ))}
        </div>
      </div>
      <Field label="Experiência Profissional">
        <textarea className={inputCls + " resize-none min-h-[100px]"}
          value={fd.experiencia} onChange={e => set("experiencia", e.target.value)}
          placeholder="Descreva brevemente sua experiência com eventos, promoções ou trabalhos similares..." />
      </Field>
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Disponibilidade">
          <select className={selectCls} value={fd.disponibilidade} onChange={e => set("disponibilidade", e.target.value)}>
            <option value="">Selecione...</option>
            <option>Fins de semana</option>
            <option>Dias úteis</option>
            <option>Qualquer dia</option>
            <option>Apenas finais de semana e feriados</option>
          </select>
        </Field>
        <Field label="Inglês">
          <select className={selectCls} value={fd.nivel_ingles} onChange={e => set("nivel_ingles", e.target.value)}>
            <option value="">Nível...</option>
            {["Nenhum","Básico","Intermediário","Avançado","Fluente"].map(n => <option key={n}>{n}</option>)}
          </select>
        </Field>
      </div>
    </div>
  );
}

function PhotoStep({
  fd, set, submitError,
}: {
  fd: FormData;
  set: (k: keyof FormData, v: unknown) => void;
  submitError: string;
}) {
  const rRef = useRef<HTMLInputElement>(null);
  const cRef = useRef<HTMLInputElement>(null);

  interface PhotoCardProps {
    field: "foto_rosto" | "foto_corpo";
    label: string;
    hint: string;
    inputRef: React.RefObject<HTMLInputElement>;
  }

  function PhotoCard({ field, label, hint, inputRef }: PhotoCardProps) {
    const file = fd[field] as File | null;
    return (
      <div className="rounded-xl border-2 border-dashed border-dark-600 p-5">
        <p className="font-semibold text-cream mb-1 text-sm">{label} <span className="text-brand">*</span></p>
        <p className="text-xs text-cream/40 mb-4">{hint}</p>
        {file ? (
          <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={URL.createObjectURL(file)} alt={label} className="w-full h-full object-cover" />
            <button type="button" onClick={() => set(field, null)}
              className="absolute top-2 right-2 px-3 py-1.5 bg-red-500/80 hover:bg-red-500 text-white text-xs font-semibold rounded-lg">
              Remover
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => inputRef.current?.click()}
            className="w-full py-8 flex flex-col items-center gap-2 text-cream/30 hover:text-cream/60 hover:border-brand/40 hover:bg-brand/5 rounded-lg border-2 border-dashed border-dark-700 transition-all">
            <Camera className="w-8 h-8" />
            <span className="text-sm font-semibold">Selecionar foto</span>
            <span className="text-xs">JPG ou PNG até 10MB</span>
          </button>
        )}
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp"
          className="hidden" onChange={e => {
            const f = e.target.files?.[0];
            if (f) set(field, f);
            e.target.value = "";
          }} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-cream/40 text-sm">
        Fotos profissionais são obrigatórias para ser considerado nas vagas.
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        <PhotoCard field="foto_rosto" label="Foto de Rosto"
          hint="Rosto visível, sem selfie, boa iluminação, sem filtros"
          inputRef={rRef} />
        <PhotoCard field="foto_corpo" label="Foto de Corpo Inteiro"
          hint="Corpo inteiro de frente. Preferencialmente em evento ou stand."
          inputRef={cRef} />
      </div>
      {submitError && (
        <p className="flex items-center gap-2 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
          <AlertCircle className="w-4 h-4 shrink-0" />{submitError}
        </p>
      )}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function CompletarPerfilPage() {
  const { data: session, status } = useSession();
  const router                   = useRouter();

  const [step,        setStep]        = useState(1);
  const [fd,          setFd]          = useState<FormData>(INITIAL);
  const [sending,     setSending]     = useState(false);
  const [submitted,   setSubmitted]   = useState(false);
  const [photoError,  setPhotoError]  = useState("");

  // Pre-fill from Google session
  useEffect(() => {
    if (session?.user?.name) {
      setFd(prev => ({ ...prev, nome_completo: prev.nome_completo || session.user.name || "" }));
    }
  }, [session]);

  // Redirect if not logged in
  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  const set  = (k: keyof FormData, v: unknown) => setFd(prev => ({ ...prev, [k]: v }));
  const next = () => setStep(s => Math.min(s + 1, STEPS.length));
  const prev = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fd.foto_rosto || !fd.foto_corpo) {
      setPhotoError("As duas fotos são obrigatórias.");
      return;
    }
    setPhotoError("");
    setSending(true);
    try {
      const body = new globalThis.FormData();
      const textKeys: (keyof FormData)[] = [
        "nome_completo","cpf","rg","data_nascimento","genero","etnia","whatsapp","instagram",
        "cep","endereco","numero","bairro","cidade","estado",
        "altura","peso","manequim","tamanho_camiseta","calcado","olhos","cabelo_tipo","cabelo_comprimento",
        "experiencia","disponibilidade","nivel_ingles","nivel_espanhol",
      ];
      // Add email from session
      body.append("email", session?.user?.email ?? "");
      textKeys.forEach(k => body.append(k, String(fd[k] ?? "")));
      body.append("areas_interesse", fd.areas_interesse.join(","));
      body.append("foto_rosto", fd.foto_rosto, "foto_rosto.jpg");
      body.append("foto_corpo", fd.foto_corpo, "foto_corpo.jpg");
      body.append("google_login", "true");

      const res  = await fetch("/api/cadastro", { method: "POST", body });
      const data = await res.json();

      if (!res.ok) {
        setPhotoError(data.error || "Erro ao enviar. Tente novamente.");
        return;
      }
      localStorage.setItem("cc_profile_complete", "true");
      setSubmitted(true);
    } catch {
      setPhotoError("Erro de conexão. Verifique sua internet e tente novamente.");
    } finally {
      setSending(false);
    }
  };

  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand animate-spin" />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-brand/15 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-brand" />
          </div>
          <h1 className="text-3xl font-bold text-cream mb-3">Perfil enviado!</h1>
          <p className="text-cream/50 mb-8 leading-relaxed">
            Suas informações e fotos foram enviadas para análise. Nossa equipe retornará em até 48 horas.
          </p>
          <Link href="/minha-conta"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-brand hover:bg-brand-light text-ink font-bold rounded transition-all btn-shimmer">
            Ir para minha conta <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950 text-cream">
      <header className="sticky top-0 z-50 bg-dark-900/95 backdrop-blur-xl border-b border-dark-700">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/minha-conta" className="flex items-center gap-3">
            <Image src="/logo casting certo/logo casting certo.PNG" alt="Casting Certo" width={32} height={32} className="rounded-md" />
            <span className="text-sm font-bold text-cream hidden sm:block">Casting Certo</span>
          </Link>
          <p className="text-xs text-cream/40">Etapa {step} de {STEPS.length}</p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-2xl">
        <div className="mb-10">
          <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-2">Completar Perfil</p>
          <h1 className="text-3xl font-bold text-cream">
            {session?.user?.name ? `Olá, ${session.user.name.split(" ")[0]}!` : "Complete seu perfil"}
          </h1>
          <p className="text-cream/40 text-sm mt-2">
            Preencha as informações para aparecer nas nossas vagas de eventos.
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="hidden sm:flex items-center gap-2 overflow-x-auto pb-1">
              {STEPS.map(({ id, label, icon: Icon }) => (
                <div key={id} className="flex items-center gap-2">
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    id < step  ? "bg-brand/20 text-brand border border-brand/30" :
                    id === step ? "bg-brand text-ink border border-brand" :
                                  "bg-dark-800 text-cream/30 border border-dark-700"
                  }`}>
                    <Icon className="w-3 h-3" />{label}
                  </div>
                  {id < STEPS.length && <div className={`w-4 h-px ${id < step ? "bg-brand/50" : "bg-dark-700"}`} />}
                </div>
              ))}
            </div>
            <p className="text-xs text-cream/40 sm:hidden">{STEPS[step - 1].label}</p>
          </div>
          <div className="h-1.5 bg-dark-800 rounded-full overflow-hidden mt-2">
            <div className="h-full bg-brand rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-dark-900 border border-dark-700 rounded-2xl p-6 sm:p-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
              {(() => {
                const { icon: Icon, label } = STEPS[step - 1];
                return (
                  <>
                    <div className="w-9 h-9 rounded-lg bg-brand/15 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-brand" />
                    </div>
                    <div>
                      <p className="font-bold text-cream">{label}</p>
                      <p className="text-xs text-cream/40">Etapa {step} de {STEPS.length}</p>
                    </div>
                  </>
                );
              })()}
            </div>

            {step === 1 && <Step1 fd={fd} set={set} />}
            {step === 2 && <Step2 fd={fd} set={set} />}
            {step === 3 && <Step3 fd={fd} set={set} />}
            {step === 4 && <Step4 fd={fd} set={set} />}
            {step === 5 && <PhotoStep fd={fd} set={set} submitError={photoError} />}
          </div>

          <div className="flex items-center justify-between gap-4">
            <button type="button" onClick={prev} disabled={step === 1}
              className="inline-flex items-center gap-2 px-6 py-3 rounded border border-dark-600 text-cream/60 hover:text-cream hover:border-dark-500 text-sm font-semibold transition-all disabled:opacity-30">
              <ArrowLeft className="w-4 h-4" />Voltar
            </button>

            {step < STEPS.length ? (
              <button type="button" onClick={next}
                className="inline-flex items-center gap-2 px-8 py-3 bg-brand hover:bg-brand-light text-ink font-bold rounded transition-all btn-shimmer text-sm">
                Próximo<ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button type="submit" disabled={sending}
                className="inline-flex items-center gap-2 px-8 py-3 bg-brand hover:bg-brand-light text-ink font-bold rounded transition-all btn-shimmer disabled:opacity-60 text-sm">
                {sending ? <><Loader2 className="w-4 h-4 animate-spin" />Enviando...</> : <>Enviar perfil<ArrowRight className="w-4 h-4" /></>}
              </button>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}
