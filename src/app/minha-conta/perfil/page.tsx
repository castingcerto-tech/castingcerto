"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft, Save, CheckCircle2, Loader2, AlertCircle,
  User, MapPin, Ruler, Briefcase, Landmark,
  AlertTriangle,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type ProfileData = {
  nome_completo: string; cpf: string; rg: string; data_nascimento: string;
  genero: string; etnia: string; whatsapp: string; instagram: string;
  cep: string; endereco: string; numero: string; bairro: string;
  cidade: string; estado: string;
  altura: string; peso: string; manequim: string; tamanho_camiseta: string;
  calcado: string; olhos: string; cabelo_tipo: string; cabelo_comprimento: string;
  areas_interesse: string[];
  experiencia: string; disponibilidade: string; nivel_ingles: string; nivel_espanhol: string;
  tipo_chave_pix: string; chave_pix: string;
  banco: string; tipo_conta: string; agencia: string; conta: string;
};

const INITIAL: ProfileData = {
  nome_completo: "", cpf: "", rg: "", data_nascimento: "",
  genero: "", etnia: "", whatsapp: "", instagram: "",
  cep: "", endereco: "", numero: "", bairro: "", cidade: "", estado: "",
  altura: "", peso: "", manequim: "", tamanho_camiseta: "",
  calcado: "", olhos: "", cabelo_tipo: "", cabelo_comprimento: "",
  areas_interesse: [],
  experiencia: "", disponibilidade: "", nivel_ingles: "", nivel_espanhol: "",
  tipo_chave_pix: "", chave_pix: "", banco: "", tipo_conta: "", agencia: "", conta: "",
};

const AREAS = [
  "Eventos", "Feiras e Exposições", "PDV e Supermercados",
  "Ativação de Marca", "Promotora de Vendas", "Recepcionista",
  "Modelo Fotográfico", "Hostess", "Outros",
];

// ─── Tailwind helpers ─────────────────────────────────────────────────────────

const inputCls = "w-full bg-dark-800 border border-dark-600 rounded-lg px-4 py-3 text-cream placeholder-cream/20 text-sm focus:outline-none focus:border-brand/60 focus:bg-dark-700 transition-colors";
const selectCls = inputCls + " appearance-none cursor-pointer";

function Field({ label, req = false, hint, children }: {
  label: string; req?: boolean; hint?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-cream/60 uppercase tracking-wider mb-1.5">
        {label}{req && <span className="text-brand ml-1">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-cream/30">{hint}</p>}
    </div>
  );
}

function SectionTitle({ icon: Icon, title, subtitle }: {
  icon: React.ElementType; title: string; subtitle?: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-dark-700">
      <div className="w-10 h-10 rounded-xl bg-brand/15 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-brand" />
      </div>
      <div>
        <h2 className="font-bold text-cream">{title}</h2>
        {subtitle && <p className="text-xs text-cream/40 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

// ─── Masks ───────────────────────────────────────────────────────────────────

function maskCpf(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

function maskPhone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function maskCep(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function PerfilPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [pd, setPd] = useState<ProfileData>(INITIAL);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveError, setSaveError] = useState("");
  const [cepLoading, setCepLoading] = useState(false);
  const [dataLost, setDataLost] = useState(false);
  const bankingRef = useRef<HTMLDivElement>(null);
  const photoUrlsRef = useRef({ foto_rosto_url: "", foto_corpo_url: "" });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  // Carrega perfil do banco de dados
  useEffect(() => {
    if (status !== "authenticated" || !session) return;
    // Exibe localStorage como cache imediato enquanto carrega do servidor
    const raw = localStorage.getItem("cc_profile_data");
    if (raw) {
      try {
        const cached = JSON.parse(raw);
        setPd(prev => ({ ...prev, ...cached }));
      } catch { /* ignore */ }
    }
    fetch("/api/profile")
      .then(r => r.json())
      .then(data => {
        if (data.perfil) {
          const p = data.perfil;
          photoUrlsRef.current = {
            foto_rosto_url: p.foto_rosto_url || "",
            foto_corpo_url: p.foto_corpo_url || "",
          };
          setPd({
            ...INITIAL,
            ...p,
            nome_completo: p.nome_completo || session.user?.name || "",
          });
          // Atualiza cache local
          localStorage.setItem("cc_profile_data", JSON.stringify(p));
        } else {
          // Nenhum perfil no BD ainda — usa nome da sessão
          setPd(prev => ({
            ...prev,
            nome_completo: prev.nome_completo || session.user?.name || "",
          }));
          const markedComplete = localStorage.getItem("cc_profile_complete") === "true";
          if (markedComplete && !raw) setDataLost(true);
        }
      })
      .catch(() => {
        // Fallback: usa localStorage se a API falhar
        if (!raw) setDataLost(localStorage.getItem("cc_profile_complete") === "true");
      })
      .finally(() => setLoading(false));
  }, [status, session]);

  // Scroll para #bancario se vier da URL
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#bancario") {
      setTimeout(() => bankingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 400);
    }
  }, []);

  // Auto-fill PIX com CPF quando tipo_chave_pix = "cpf"
  useEffect(() => {
    if (pd.tipo_chave_pix === "cpf") {
      setPd(prev => ({ ...prev, chave_pix: prev.cpf }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pd.tipo_chave_pix]);

  // Atualiza chave pix quando CPF muda e tipo = cpf
  useEffect(() => {
    if (pd.tipo_chave_pix === "cpf") {
      setPd(prev => ({ ...prev, chave_pix: prev.cpf }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pd.cpf]);

  const set = (k: keyof ProfileData, v: unknown) =>
    setPd(prev => ({ ...prev, [k]: v }));

  const buscarCep = async () => {
    const raw = pd.cep.replace(/\D/g, "");
    if (raw.length !== 8) return;
    setCepLoading(true);
    try {
      const r = await fetch(`https://viacep.com.br/ws/${raw}/json/`);
      const d = await r.json();
      if (!d.erro) {
        set("endereco", d.logradouro ?? "");
        set("bairro", d.bairro ?? "");
        set("cidade", d.localidade ?? "");
        set("estado", d.uf ?? "");
      }
    } finally {
      setCepLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError("");
    try {
      const payload = {
        ...pd,
        ...photoUrlsRef.current,
      };
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Erro ao salvar");
      }
      // Atualiza cache local
      localStorage.setItem("cc_profile_data", JSON.stringify(pd));
      const profileOk = !!(pd.nome_completo && pd.cpf && pd.whatsapp && pd.data_nascimento && pd.cep && pd.cidade);
      const bankingOk = !!((pd.tipo_chave_pix && pd.chave_pix) || (pd.banco && pd.conta));
      if (profileOk) localStorage.setItem("cc_profile_complete", "true");
      if (bankingOk) localStorage.setItem("cc_banking_complete", "true");
      setSaved(true);
      setTimeout(() => router.push("/minha-conta"), 1200);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Erro ao salvar. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const toggleArea = (area: string) => {
    const cur = pd.areas_interesse;
    set("areas_interesse", cur.includes(area) ? cur.filter(a => a !== area) : [...cur, area]);
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-dark-950 text-cream pb-28">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-dark-900/95 backdrop-blur-xl border-b border-dark-700">
        <div className="container mx-auto px-6 h-16 flex items-center gap-4">
          <Link href="/minha-conta"
            className="flex items-center gap-2 text-cream/50 hover:text-cream transition-colors shrink-0">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-semibold hidden sm:block">Minha Conta</span>
          </Link>
          <div className="flex-1 flex justify-center">
            <Link href="/minha-conta">
              <Image src="/logo casting certo/logo casting certo.PNG" alt="Casting Certo" width={28} height={28} className="rounded-md" />
            </Link>
          </div>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-brand hover:bg-brand-light text-ink font-bold rounded-lg transition-all btn-shimmer disabled:opacity-60 text-sm shrink-0">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Salvar
          </button>
        </div>
      </header>

      {/* Toast de sucesso */}
      {saved && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 bg-green-500 text-white font-bold rounded-xl shadow-2xl text-sm pointer-events-none">
          <CheckCircle2 className="w-4 h-4" />Alterações salvas com sucesso!
        </div>
      )}

      {/* Toast de erro */}
      {saveError && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 bg-red-500 text-white font-bold rounded-xl shadow-2xl text-sm max-w-xs text-center">
          <AlertCircle className="w-4 h-4 shrink-0" />{saveError}
        </div>
      )}

      <main className="container mx-auto px-6 py-8 max-w-2xl space-y-6">

        <div>
          <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-1">Editar Perfil</p>
          <h1 className="text-xl font-bold text-cream">Suas informações</h1>
          <p className="text-cream/40 text-sm mt-1">
            Mantenha seus dados atualizados. Clique em &ldquo;Salvar&rdquo; para guardar as alterações.
          </p>
        </div>

        {/* Aviso dados não encontrados localmente */}
        {dataLost && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-amber-300 mb-0.5">Dados não encontrados neste dispositivo</p>
              <p className="text-sm text-amber-300/70 leading-relaxed">
                Seus dados foram enviados anteriormente, mas não estão salvos neste navegador.
                Por favor, preencha novamente e clique em <strong>Salvar</strong> para guardar localmente.
              </p>
            </div>
          </div>
        )}

        {/* ── 1. DADOS PESSOAIS ──────────────────────────────── */}
        <div className="bg-dark-900 border border-dark-700 rounded-2xl p-6">
          <SectionTitle icon={User} title="Dados Pessoais" subtitle="Informações de identificação" />
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <Field label="Nome Completo" req>
                <input className={inputCls} value={pd.nome_completo}
                  onChange={e => set("nome_completo", e.target.value)} placeholder="Como aparece no RG" />
              </Field>
            </div>
            <Field label="CPF" req>
              <input className={inputCls} value={pd.cpf} inputMode="numeric"
                onChange={e => set("cpf", maskCpf(e.target.value))} placeholder="000.000.000-00" maxLength={14} />
            </Field>
            <Field label="RG">
              <input className={inputCls} value={pd.rg}
                onChange={e => set("rg", e.target.value)} placeholder="0000000-0" />
            </Field>
            <Field label="Data de Nascimento" req>
              <input type="date" className={inputCls} value={pd.data_nascimento}
                onChange={e => set("data_nascimento", e.target.value)} />
            </Field>
            <Field label="Gênero">
              <select className={selectCls} value={pd.genero} onChange={e => set("genero", e.target.value)}>
                <option value="">Selecione...</option>
                <option>Feminino</option><option>Masculino</option>
                <option>Não-binário</option><option>Prefiro não informar</option>
              </select>
            </Field>
            <Field label="WhatsApp" req>
              <input className={inputCls} value={pd.whatsapp} inputMode="tel"
                onChange={e => set("whatsapp", maskPhone(e.target.value))} placeholder="(11) 99999-9999" />
            </Field>
            <Field label="Instagram">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/30 text-sm pointer-events-none select-none">@</span>
                <input className={inputCls + " pl-8"} value={pd.instagram}
                  onChange={e => set("instagram", e.target.value.replace(/^@/, ""))} placeholder="seuperfil" />
              </div>
            </Field>
            <Field label="Etnia">
              <select className={selectCls} value={pd.etnia} onChange={e => set("etnia", e.target.value)}>
                <option value="">Selecione...</option>
                <option>Branco(a)</option><option>Pardo(a)</option><option>Preto(a)</option>
                <option>Amarelo(a)</option><option>Indígena</option><option>Prefiro não informar</option>
              </select>
            </Field>
          </div>
        </div>

        {/* ── 2. ENDEREÇO ───────────────────────────────────────── */}
        <div className="bg-dark-900 border border-dark-700 rounded-2xl p-6">
          <SectionTitle icon={MapPin} title="Endereço" subtitle="Local de residência" />
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <Field label="CEP" req>
                <div className="flex gap-2">
                  <input className={inputCls} value={pd.cep} inputMode="numeric"
                    onChange={e => set("cep", maskCep(e.target.value))}
                    onBlur={buscarCep} placeholder="00000-000" />
                  <button type="button" onClick={buscarCep} disabled={cepLoading}
                    className="px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-xs font-semibold text-cream/60 hover:text-cream hover:border-dark-500 transition-all shrink-0 disabled:opacity-50">
                    {cepLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Buscar"}
                  </button>
                </div>
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Rua / Logradouro">
                <input className={inputCls} value={pd.endereco}
                  onChange={e => set("endereco", e.target.value)} placeholder="Rua, Avenida..." />
              </Field>
            </div>
            <Field label="Número">
              <input className={inputCls} value={pd.numero} inputMode="numeric"
                onChange={e => set("numero", e.target.value.replace(/\D/g, ""))} placeholder="123" />
            </Field>
            <Field label="Bairro">
              <input className={inputCls} value={pd.bairro}
                onChange={e => set("bairro", e.target.value)} placeholder="Bairro" />
            </Field>
            <Field label="Cidade" req>
              <input className={inputCls} value={pd.cidade}
                onChange={e => set("cidade", e.target.value)} placeholder="São Paulo" />
            </Field>
            <Field label="Estado">
              <select className={selectCls} value={pd.estado} onChange={e => set("estado", e.target.value)}>
                <option value="">UF</option>
                {["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG",
                  "PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"].map(uf =>
                  <option key={uf}>{uf}</option>
                )}
              </select>
            </Field>
          </div>
        </div>

        {/* ── 3. CARACTERÍSTICAS FÍSICAS ──────────────────────── */}
        <div className="bg-dark-900 border border-dark-700 rounded-2xl p-6">
          <SectionTitle icon={Ruler} title="Características Físicas" />
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Altura">
              <input className={inputCls} value={pd.altura} inputMode="numeric"
                onChange={e => set("altura", e.target.value)} placeholder="1,70 m" />
            </Field>
            <Field label="Peso (kg)">
              <input className={inputCls} value={pd.peso} inputMode="numeric"
                onChange={e => set("peso", e.target.value.replace(/\D/g, "").slice(0, 3))} placeholder="65" />
            </Field>
            <Field label="Manequim">
              <select className={selectCls} value={pd.manequim} onChange={e => set("manequim", e.target.value)}>
                <option value="">Selecione...</option>
                {["PP","P","M","G","GG","XGG"].map(t => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Tamanho de Camiseta">
              <select className={selectCls} value={pd.tamanho_camiseta} onChange={e => set("tamanho_camiseta", e.target.value)}>
                <option value="">Selecione...</option>
                {["PP","P","M","G","GG","XGG"].map(t => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Número do Calçado">
              <input className={inputCls} value={pd.calcado} inputMode="numeric"
                onChange={e => set("calcado", e.target.value.replace(/\D/g, "").slice(0, 2))} placeholder="37" />
            </Field>
            <Field label="Cor dos Olhos">
              <select className={selectCls} value={pd.olhos} onChange={e => set("olhos", e.target.value)}>
                <option value="">Selecione...</option>
                {["Pretos","Castanhos","Verdes","Azuis","Mel","Cinzas"].map(o => <option key={o}>{o}</option>)}
              </select>
            </Field>
            <Field label="Tipo de Cabelo">
              <select className={selectCls} value={pd.cabelo_tipo} onChange={e => set("cabelo_tipo", e.target.value)}>
                <option value="">Selecione...</option>
                {["Liso","Ondulado","Cacheado","Crespo"].map(t => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Comprimento do Cabelo">
              <select className={selectCls} value={pd.cabelo_comprimento} onChange={e => set("cabelo_comprimento", e.target.value)}>
                <option value="">Selecione...</option>
                {["Careca","Muito Curto","Curto","Médio","Longo","Muito Longo"].map(c => <option key={c}>{c}</option>)}
              </select>
            </Field>
          </div>
        </div>

        {/* ── 4. EXPERIÊNCIA ────────────────────────────────────── */}
        <div className="bg-dark-900 border border-dark-700 rounded-2xl p-6">
          <SectionTitle icon={Briefcase} title="Experiência e Disponibilidade" />
          <div className="space-y-5">
            <div>
              <p className="text-xs font-semibold text-cream/60 uppercase tracking-wider mb-3">Áreas de Interesse</p>
              <div className="flex flex-wrap gap-2">
                {AREAS.map(area => (
                  <button type="button" key={area} onClick={() => toggleArea(area)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      pd.areas_interesse.includes(area)
                        ? "bg-brand/20 border-brand/50 text-brand"
                        : "bg-dark-800 border-dark-600 text-cream/50 hover:border-dark-500"
                    }`}>{area}</button>
                ))}
              </div>
            </div>
            <Field label="Experiência Profissional">
              <textarea className={inputCls + " resize-none min-h-[90px]"}
                value={pd.experiencia} onChange={e => set("experiencia", e.target.value)}
                placeholder="Descreva brevemente sua experiência com eventos, promoções, etc." />
            </Field>
            <div className="grid sm:grid-cols-3 gap-5">
              <Field label="Disponibilidade">
                <select className={selectCls} value={pd.disponibilidade} onChange={e => set("disponibilidade", e.target.value)}>
                  <option value="">Selecione...</option>
                  <option>Fins de semana</option>
                  <option>Dias úteis</option>
                  <option>Qualquer dia</option>
                  <option>Apenas feriados</option>
                </select>
              </Field>
              <Field label="Inglês">
                <select className={selectCls} value={pd.nivel_ingles} onChange={e => set("nivel_ingles", e.target.value)}>
                  <option value="">Nível...</option>
                  {["Nenhum","Básico","Intermediário","Avançado","Fluente"].map(n => <option key={n}>{n}</option>)}
                </select>
              </Field>
              <Field label="Espanhol">
                <select className={selectCls} value={pd.nivel_espanhol} onChange={e => set("nivel_espanhol", e.target.value)}>
                  <option value="">Nível...</option>
                  {["Nenhum","Básico","Intermediário","Avançado","Fluente"].map(n => <option key={n}>{n}</option>)}
                </select>
              </Field>
            </div>
          </div>
        </div>

        {/* ── 5. DADOS BANCÁRIOS ────────────────────────────────── */}
        <div ref={bankingRef} id="bancario" className="bg-dark-900 border border-dark-700 rounded-2xl p-6 scroll-mt-20">
          <SectionTitle icon={Landmark} title="Dados Bancários" subtitle="Para receber pagamentos dos eventos" />

          {/* Alerta titular */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 mb-6">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-300/80 leading-relaxed">
              <strong className="text-amber-300 font-bold">Atenção:</strong>{" "}
              Transferimos apenas para conta bancária no nome do próprio titular.
              Não realizamos transferências para terceiros.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="PIX — Tipo de Chave">
              <select className={selectCls} value={pd.tipo_chave_pix}
                onChange={e => set("tipo_chave_pix", e.target.value)}>
                <option value="">Selecione...</option>
                <option value="cpf">CPF</option>
                <option value="email">E-mail</option>
                <option value="telefone">Telefone</option>
                <option value="aleatoria">Chave Aleatória</option>
              </select>
            </Field>

            <Field label="PIX — Chave"
              hint={pd.tipo_chave_pix === "cpf" ? "Preenchido automaticamente com seu CPF" : undefined}>
              <input
                className={`${inputCls} ${pd.tipo_chave_pix === "cpf" ? "opacity-70 cursor-not-allowed" : ""}`}
                placeholder={pd.tipo_chave_pix === "cpf" ? "Automático..." : "Sua chave PIX"}
                value={pd.chave_pix}
                readOnly={pd.tipo_chave_pix === "cpf"}
                onChange={e => set("chave_pix", e.target.value)}
              />
            </Field>

            {pd.tipo_chave_pix === "cpf" && !pd.cpf && (
              <div className="sm:col-span-2">
                <p className="flex items-center gap-1.5 text-xs text-amber-400">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  Preencha o CPF em &ldquo;Dados Pessoais&rdquo; para puxar automaticamente.
                </p>
              </div>
            )}

            <div className="sm:col-span-2 pt-3 border-t border-dark-700">
              <p className="text-xs font-semibold text-cream/30 uppercase tracking-wider mb-4">
                Ou Transferência Bancária
              </p>
            </div>

            <Field label="Banco">
              <input className={inputCls} value={pd.banco}
                onChange={e => set("banco", e.target.value)} placeholder="Ex: Nubank, Itaú, Bradesco..." />
            </Field>
            <Field label="Tipo de Conta">
              <select className={selectCls} value={pd.tipo_conta} onChange={e => set("tipo_conta", e.target.value)}>
                <option value="">Selecione...</option>
                <option value="corrente">Conta Corrente</option>
                <option value="poupanca">Conta Poupança</option>
              </select>
            </Field>
            <Field label="Agência">
              <input className={inputCls} value={pd.agencia} inputMode="numeric"
                onChange={e => set("agencia", e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="0001" />
            </Field>
            <Field label="Conta com Dígito">
              <input className={inputCls} value={pd.conta}
                onChange={e => set("conta", e.target.value.replace(/[^0-9-]/g, "").slice(0, 12))} placeholder="12345-6" inputMode="numeric" />
            </Field>
          </div>
        </div>

        {/* Botão salvar final */}
        <button onClick={handleSave} disabled={saving}
          className="w-full flex items-center justify-center gap-2 py-4 bg-brand hover:bg-brand-light text-ink font-bold rounded-2xl transition-all btn-shimmer disabled:opacity-60 text-base">
          {saving
            ? <><Loader2 className="w-5 h-5 animate-spin" />Salvando...</>
            : <><Save className="w-5 h-5" />Salvar alterações</>}
        </button>
      </main>
    </div>
  );
}
