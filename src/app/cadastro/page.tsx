"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight, ArrowLeft, CheckCircle2, User, MapPin, Ruler,
  Briefcase, Landmark, Camera, Lock, Eye, EyeOff, ChevronRight,
  AlertCircle, Loader2,
} from "lucide-react";

// ─── Mask / validation utils ─────────────────────────────────────────────────

function onlyDigits(v: string) { return v.replace(/\D/g, ""); }

function maskCPF(v: string) {
  const d = onlyDigits(v).slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0,3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0,3)}.${d.slice(3,6)}.${d.slice(6)}`;
  return `${d.slice(0,3)}.${d.slice(3,6)}.${d.slice(6,9)}-${d.slice(9)}`;
}

function validateCPF(cpf: string): boolean {
  const d = onlyDigits(cpf);
  if (d.length !== 11) return false;
  if (/^(\d)\1+$/.test(d)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(d[i]) * (10 - i);
  let r = (sum * 10) % 11;
  if (r === 10 || r === 11) r = 0;
  if (r !== parseInt(d[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(d[i]) * (11 - i);
  r = (sum * 10) % 11;
  if (r === 10 || r === 11) r = 0;
  return r === parseInt(d[10]);
}

function maskPhone(v: string, ddi: string) {
  const d = onlyDigits(v).slice(0, 11);
  if (!d) return "";
  if (d.length <= 2)  return `(${d}`;
  if (d.length <= 6)  return `(${d.slice(0,2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`;
  return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
}

function maskDate(v: string) {
  const d = onlyDigits(v).slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0,2)}/${d.slice(2)}`;
  return `${d.slice(0,2)}/${d.slice(2,4)}/${d.slice(4)}`;
}

function maskCEP(v: string) {
  const d = onlyDigits(v).slice(0, 8);
  if (d.length <= 5) return d;
  return `${d.slice(0,5)}-${d.slice(5)}`;
}

function maskAltura(v: string) {
  const d = onlyDigits(v).slice(0, 3);
  if (d.length <= 1) return d;
  return `${d.slice(0,1)}.${d.slice(1)}`;
}

function maskPeso(v: string) {
  // allow digits and one dot/comma
  const clean = v.replace(/[^0-9.,]/g, "").replace(",", ".").slice(0, 5);
  return clean;
}

function maskCalcado(v: string) {
  return onlyDigits(v).slice(0, 2);
}

function maskManequim(v: string) {
  return onlyDigits(v).slice(0, 3);
}

function getAge(dateStr: string): number | null {
  if (dateStr.length !== 10) return null;
  const [day, month, year] = dateStr.split("/").map(Number);
  if (!day || !month || !year || year < 1900) return null;
  const birth = new Date(year, month - 1, day);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < day)) age--;
  return age;
}

// ─── Types ────────────────────────────────────────────────────────────────────

type FormData = {
  email: string; password: string; confirm_password: string; nome_completo: string;
  cpf: string; rg: string; whatsapp: string; whatsapp_ddi: string;
  instagram: string; data_nascimento: string; genero: string; etnia: string;
  nacionalidade: string; is_pcd: boolean; descricao_pcd: string;
  cep: string; endereco: string; numero: string; bairro: string; cidade: string; estado: string;
  altura: string; peso: string; manequim: string; tamanho_camiseta: string;
  calcado: string; olhos: string; cabelo_tipo: string; cabelo_comprimento: string;
  experiencia: string; disponibilidade: string; areas_interesse: string[];
  areas_outros_texto: string; nivel_ingles: string; nivel_espanhol: string;
  nivel_frances: string; outros_idiomas: string;
  banco: string; tipo_conta: string; agencia: string; conta: string;
  tipo_chave_pix: string; chave_pix: string;
  foto_rosto: File | null; foto_corpo: File | null;
  termo_uso_imagem: boolean; termo_comunicacao: boolean;
};

const INITIAL: FormData = {
  email: "", password: "", confirm_password: "", nome_completo: "",
  cpf: "", rg: "", whatsapp: "", whatsapp_ddi: "+55", instagram: "", data_nascimento: "",
  genero: "", etnia: "", nacionalidade: "brasileira", is_pcd: false, descricao_pcd: "",
  cep: "", endereco: "", numero: "", bairro: "", cidade: "", estado: "",
  altura: "", peso: "", manequim: "", tamanho_camiseta: "", calcado: "", olhos: "", cabelo_tipo: "", cabelo_comprimento: "",
  experiencia: "", disponibilidade: "", areas_interesse: [], areas_outros_texto: "", nivel_ingles: "", nivel_espanhol: "", nivel_frances: "", outros_idiomas: "",
  banco: "", tipo_conta: "", agencia: "", conta: "", tipo_chave_pix: "", chave_pix: "",
  foto_rosto: null, foto_corpo: null, termo_uso_imagem: false, termo_comunicacao: false,
};

const DDI_OPTIONS = [
  { code: "+55",  flag: "🇧🇷", label: "Brasil" },
  { code: "+1",   flag: "🇺🇸", label: "EUA/CA" },
  { code: "+351", flag: "🇵🇹", label: "Portugal" },
  { code: "+34",  flag: "🇪🇸", label: "Espanha" },
  { code: "+33",  flag: "🇫🇷", label: "França" },
  { code: "+39",  flag: "🇮🇹", label: "Itália" },
  { code: "+49",  flag: "🇩🇪", label: "Alemanha" },
  { code: "+81",  flag: "🇯🇵", label: "Japão" },
  { code: "+86",  flag: "🇨🇳", label: "China" },
];

// ─── Step config ──────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: "Acesso",       icon: Lock },
  { id: 2, label: "Pessoal",      icon: User },
  { id: 3, label: "Endereço",     icon: MapPin },
  { id: 4, label: "Físico",       icon: Ruler },
  { id: 5, label: "Profissional", icon: Briefcase },
  { id: 6, label: "Bancário",     icon: Landmark },
  { id: 7, label: "Fotos",        icon: Camera },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Field({
  label, required = false, error, children,
}: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-cream/60 uppercase tracking-wider mb-1.5">
        {label}{required && <span className="text-brand ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1.5 mt-1.5 text-xs text-red-400">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />{error}
        </p>
      )}
    </div>
  );
}

const inputCls =
  "w-full bg-dark-800 border border-dark-600 rounded-lg px-4 py-3 text-cream placeholder-cream/20 text-sm focus:outline-none focus:border-brand/60 focus:bg-dark-700 transition-colors";

const inputErrCls =
  "w-full bg-dark-800 border border-red-500/60 rounded-lg px-4 py-3 text-cream placeholder-cream/20 text-sm focus:outline-none focus:border-red-400 focus:bg-dark-700 transition-colors";

const selectCls = inputCls + " appearance-none cursor-pointer";

// ─── Step 1 ───────────────────────────────────────────────────────────────────

function Step1({ fd, set }: { fd: FormData; set: (k: keyof FormData, v: unknown) => void }) {
  const [show, setShow]   = useState(false);
  const [show2, setShow2] = useState(false);

  return (
    <div className="grid gap-5">
      <Field label="Nome Completo" required>
        <input className={inputCls} placeholder="Nome artístico ou civil" value={fd.nome_completo}
          onChange={e => set("nome_completo", e.target.value)} />
      </Field>
      <Field label="E-mail" required>
        <input className={inputCls} type="email" placeholder="seuemail@exemplo.com" value={fd.email}
          onChange={e => set("email", e.target.value)} />
      </Field>
      <Field label="Senha" required>
        <div className="relative">
          <input className={inputCls + " pr-12"} type={show ? "text" : "password"}
            placeholder="Mínimo 8 caracteres" value={fd.password}
            onChange={e => set("password", e.target.value)} />
          <button type="button" onClick={() => setShow(v => !v)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/30 hover:text-cream/70 transition-colors">
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </Field>
      <Field label="Confirmar Senha" required
        error={fd.confirm_password && fd.password !== fd.confirm_password ? "As senhas não conferem." : undefined}>
        <div className="relative">
          <input
            className={(fd.confirm_password && fd.password !== fd.confirm_password ? inputErrCls : inputCls) + " pr-12"}
            type={show2 ? "text" : "password"} placeholder="Repita a senha" value={fd.confirm_password}
            onChange={e => set("confirm_password", e.target.value)} />
          <button type="button" onClick={() => setShow2(v => !v)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/30 hover:text-cream/70 transition-colors">
            {show2 ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </Field>
    </div>
  );
}

// ─── Step 2 ───────────────────────────────────────────────────────────────────

function Step2({ fd, set }: { fd: FormData; set: (k: keyof FormData, v: unknown) => void }) {
  const cpfTouched = useRef(false);
  const cpfInvalid = cpfTouched.current && fd.cpf.length === 14 && !validateCPF(fd.cpf);
  const age = getAge(fd.data_nascimento);
  const ageError = age !== null && age < 16
    ? `Você precisa ter pelo menos 16 anos para se cadastrar. (Idade detectada: ${age} anos)`
    : undefined;

  return (
    <div className="grid sm:grid-cols-2 gap-5">
      {/* CPF */}
      <Field label="CPF" required error={cpfInvalid ? "CPF inválido. Verifique os números." : undefined}>
        <input
          className={cpfInvalid ? inputErrCls : inputCls}
          placeholder="000.000.000-00"
          value={fd.cpf}
          inputMode="numeric"
          onChange={e => {
            cpfTouched.current = true;
            set("cpf", maskCPF(e.target.value));
          }}
          onBlur={() => { cpfTouched.current = true; }}
          maxLength={14}
        />
      </Field>

      {/* RG */}
      <Field label="RG / RNE">
        <input className={inputCls} placeholder="Número do RG" value={fd.rg}
          onChange={e => set("rg", e.target.value)} />
      </Field>

      {/* WhatsApp com DDI */}
      <div className="sm:col-span-2">
        <Field label="WhatsApp" required>
          <div className="flex gap-2">
            <select
              className="bg-dark-800 border border-dark-600 rounded-lg px-3 py-3 text-cream text-sm focus:outline-none focus:border-brand/60 focus:bg-dark-700 transition-colors appearance-none cursor-pointer shrink-0"
              value={fd.whatsapp_ddi}
              onChange={e => set("whatsapp_ddi", e.target.value)}
            >
              {DDI_OPTIONS.map(({ code, flag, label }) => (
                <option key={code} value={code}>{flag} {code}</option>
              ))}
            </select>
            <input
              className={inputCls}
              placeholder="(11) 99999-9999"
              value={fd.whatsapp}
              inputMode="numeric"
              onChange={e => set("whatsapp", maskPhone(e.target.value, fd.whatsapp_ddi))}
              maxLength={15}
            />
          </div>
        </Field>
      </div>

      {/* Instagram */}
      <div className="sm:col-span-2">
        <Field label="Instagram">
          <div className="flex">
            <span className="flex items-center px-3 bg-dark-700 border border-r-0 border-dark-600 rounded-l-lg text-cream/40 text-sm whitespace-nowrap">
              instagram.com/
            </span>
            <input
              className="flex-1 bg-dark-800 border border-dark-600 rounded-r-lg px-4 py-3 text-cream placeholder-cream/20 text-sm focus:outline-none focus:border-brand/60 focus:bg-dark-700 transition-colors"
              placeholder="seu.usuario"
              value={fd.instagram}
              onChange={e => set("instagram", e.target.value.replace(/^@/, ""))}
            />
          </div>
        </Field>
      </div>

      {/* Data de Nascimento */}
      <Field label="Data de Nascimento" required error={ageError}>
        <input
          className={ageError ? inputErrCls : inputCls}
          placeholder="DD/MM/AAAA"
          value={fd.data_nascimento}
          inputMode="numeric"
          onChange={e => set("data_nascimento", maskDate(e.target.value))}
          maxLength={10}
        />
      </Field>

      {/* Gênero */}
      <Field label="Gênero" required>
        <select className={selectCls} value={fd.genero} onChange={e => set("genero", e.target.value)}>
          <option value="">Selecione...</option>
          <option value="feminino">Feminino</option>
          <option value="masculino">Masculino</option>
          <option value="nao_binario">Não-binário</option>
          <option value="outros">Outros</option>
          <option value="prefiro_nao_dizer">Prefiro não dizer</option>
        </select>
      </Field>

      {/* Etnia */}
      <Field label="Cor / Etnia" required>
        <select className={selectCls} value={fd.etnia} onChange={e => set("etnia", e.target.value)}>
          <option value="">Selecione...</option>
          <option value="branca">Branca</option>
          <option value="preta">Preta</option>
          <option value="parda">Parda</option>
          <option value="amarela">Amarela (Asiáticos/Orientais)</option>
          <option value="indigena">Indígena</option>
          <option value="outra">Outra</option>
        </select>
      </Field>

      {/* Nacionalidade */}
      <Field label="Nacionalidade" required>
        <select className={selectCls} value={fd.nacionalidade} onChange={e => set("nacionalidade", e.target.value)}>
          <option value="brasileira">Brasileira 🇧🇷</option>
          <option value="americana">Americana 🇺🇸</option>
          <option value="espanhola">Espanhola 🇪🇸</option>
          <option value="francesa">Francesa 🇫🇷</option>
          <option value="italiana">Italiana 🇮🇹</option>
          <option value="japonesa">Japonesa 🇯🇵</option>
          <option value="chinesa">Chinesa 🇨🇳</option>
          <option value="alemama">Alemã 🇩🇪</option>
          <option value="outra">Outra</option>
        </select>
      </Field>

      {/* PCD */}
      <div className="sm:col-span-2 flex items-start gap-3 p-4 rounded-lg bg-dark-800 border border-dark-600">
        <input type="checkbox" id="is_pcd" checked={fd.is_pcd}
          onChange={e => set("is_pcd", e.target.checked)}
          className="mt-0.5 w-4 h-4 accent-brand cursor-pointer" />
        <label htmlFor="is_pcd" className="text-sm text-cream/70 cursor-pointer select-none">
          Sou PCD (Pessoa com Deficiência)
        </label>
      </div>
      {fd.is_pcd && (
        <div className="sm:col-span-2">
          <Field label="Qual deficiência?">
            <input className={inputCls} placeholder="Descreva brevemente" value={fd.descricao_pcd}
              onChange={e => set("descricao_pcd", e.target.value)} />
          </Field>
        </div>
      )}
    </div>
  );
}

// ─── Step 3 ───────────────────────────────────────────────────────────────────

function Step3({ fd, set }: { fd: FormData; set: (k: keyof FormData, v: unknown) => void }) {
  const [loadingCep, setLoadingCep] = useState(false);
  const [cepError, setCepError]     = useState("");

  async function lookupCEP(cep: string) {
    const digits = onlyDigits(cep);
    if (digits.length !== 8) return;
    setLoadingCep(true);
    setCepError("");
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const data = await res.json();
      if (data.erro) {
        setCepError("CEP não encontrado.");
      } else {
        set("endereco", data.logradouro || "");
        set("bairro",   data.bairro     || "");
        set("cidade",   data.localidade || "");
        set("estado",   data.uf         || "");
      }
    } catch {
      setCepError("Erro ao buscar CEP. Preencha o endereço manualmente.");
    } finally {
      setLoadingCep(false);
    }
  }

  return (
    <div className="grid sm:grid-cols-2 gap-5">
      {/* CEP */}
      <Field label="CEP" required error={cepError}>
        <div className="relative">
          <input
            className={cepError ? inputErrCls : inputCls}
            placeholder="00000-000"
            value={fd.cep}
            inputMode="numeric"
            maxLength={9}
            onChange={e => {
              const masked = maskCEP(e.target.value);
              set("cep", masked);
              if (onlyDigits(masked).length === 8) lookupCEP(masked);
            }}
          />
          {loadingCep && (
            <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand animate-spin" />
          )}
        </div>
      </Field>

      <div /> {/* spacer */}

      {/* Endereço */}
      <div className="sm:col-span-2">
        <Field label="Endereço (Rua)" required>
          <input className={inputCls} placeholder="Nome da rua (preenchido automaticamente)" value={fd.endereco}
            onChange={e => set("endereco", e.target.value)} />
        </Field>
      </div>

      <Field label="Número" required>
        <input className={inputCls} placeholder="Ex: 123" value={fd.numero}
          onChange={e => set("numero", onlyDigits(e.target.value).slice(0, 6))} inputMode="numeric" />
      </Field>

      <Field label="Bairro" required>
        <input className={inputCls} placeholder="Seu bairro" value={fd.bairro}
          onChange={e => set("bairro", e.target.value)} />
      </Field>

      <Field label="Cidade" required>
        <input className={inputCls} placeholder="Sua cidade" value={fd.cidade}
          onChange={e => set("cidade", e.target.value)} />
      </Field>

      <Field label="Estado (UF)" required>
        <select className={selectCls} value={fd.estado} onChange={e => set("estado", e.target.value)}>
          <option value="">Selecione...</option>
          {["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"].map(uf => (
            <option key={uf} value={uf}>{uf}</option>
          ))}
        </select>
      </Field>
    </div>
  );
}

// ─── Step 4 ───────────────────────────────────────────────────────────────────

function Step4({ fd, set }: { fd: FormData; set: (k: keyof FormData, v: unknown) => void }) {
  return (
    <div className="grid sm:grid-cols-2 gap-5">
      <Field label="Altura (m)" required>
        <div className="relative">
          <input
            className={inputCls + " pr-10"}
            placeholder="1.70"
            value={fd.altura}
            inputMode="numeric"
            maxLength={4}
            onChange={e => set("altura", maskAltura(e.target.value))}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/30 text-xs">m</span>
        </div>
      </Field>

      <Field label="Peso (kg)">
        <div className="relative">
          <input
            className={inputCls + " pr-12"}
            placeholder="65.0"
            value={fd.peso}
            inputMode="decimal"
            maxLength={5}
            onChange={e => set("peso", maskPeso(e.target.value))}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/30 text-xs">kg</span>
        </div>
      </Field>

      <Field label="Manequim" required>
        <input
          className={inputCls}
          placeholder="38"
          value={fd.manequim}
          inputMode="numeric"
          maxLength={3}
          onChange={e => set("manequim", maskManequim(e.target.value))}
        />
      </Field>

      <Field label="Tamanho de Camiseta">
        <select className={selectCls} value={fd.tamanho_camiseta} onChange={e => set("tamanho_camiseta", e.target.value)}>
          <option value="">Selecione...</option>
          {["PP","P","M","G","GG","XG"].map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </Field>

      <Field label="Calçado (número)" required>
        <input
          className={inputCls}
          placeholder="37"
          value={fd.calcado}
          inputMode="numeric"
          maxLength={2}
          onChange={e => set("calcado", maskCalcado(e.target.value))}
        />
      </Field>

      <Field label="Cor dos Olhos">
        <select className={selectCls} value={fd.olhos} onChange={e => set("olhos", e.target.value)}>
          <option value="">Selecione...</option>
          <option value="castanho_escuro">Castanho Escuro</option>
          <option value="castanho_claro">Castanho Claro</option>
          <option value="azul">Azul</option>
          <option value="verde">Verde</option>
          <option value="mel">Mel</option>
          <option value="preto">Preto</option>
          <option value="heterocromia">Heterocromia</option>
        </select>
      </Field>

      <Field label="Tipo de Cabelo">
        <select className={selectCls} value={fd.cabelo_tipo} onChange={e => set("cabelo_tipo", e.target.value)}>
          <option value="">Selecione...</option>
          <option value="liso">Liso</option>
          <option value="ondulado">Ondulado</option>
          <option value="cacheado">Cacheado</option>
          <option value="crespo">Crespo</option>
          <option value="black_power">Black Power</option>
          <option value="dread">Dreadlocks</option>
          <option value="trancas">Tranças</option>
        </select>
      </Field>

      <Field label="Comprimento do Cabelo">
        <select className={selectCls} value={fd.cabelo_comprimento} onChange={e => set("cabelo_comprimento", e.target.value)}>
          <option value="">Selecione...</option>
          <option value="curto">Curto</option>
          <option value="medio">Médio</option>
          <option value="longo">Longo</option>
          <option value="careca">Careca / Raspado</option>
        </select>
      </Field>
    </div>
  );
}

// ─── Step 5 ───────────────────────────────────────────────────────────────────

const AREAS = [
  { value: "recepcao",        label: "Recepção" },
  { value: "degustacao",      label: "Degustação" },
  { value: "bartender",       label: "Bartender" },
  { value: "garcom",          label: "Garçom / Garçonete" },
  { value: "modelo",          label: "Modelo" },
  { value: "seguranca",       label: "Segurança" },
  { value: "mascote",         label: "Mascote" },
  { value: "controle_acesso", label: "Controle de Acesso" },
  { value: "limpeza",         label: "Limpeza" },
  { value: "dj",              label: "DJ" },
  { value: "fotografo",       label: "Fotógrafo" },
  { value: "apresentador",    label: "Apresentador / Locutor" },
  { value: "outros",          label: "Outros (Descrever abaixo)" },
];

function Step5({ fd, set }: { fd: FormData; set: (k: keyof FormData, v: unknown) => void }) {
  const toggleArea = (val: string) => {
    set("areas_interesse",
      fd.areas_interesse.includes(val)
        ? fd.areas_interesse.filter(a => a !== val)
        : [...fd.areas_interesse, val]
    );
  };

  return (
    <div className="grid sm:grid-cols-2 gap-5">
      <Field label="Experiência como promotor" required>
        <select className={selectCls} value={fd.experiencia} onChange={e => set("experiencia", e.target.value)}>
          <option value="">Selecione...</option>
          <option value="sem_experiencia">Não tenho experiência (Começando agora)</option>
          <option value="pouca">Tenho, mas pouca</option>
          <option value="media">Tenho experiência</option>
          <option value="muita">Sim, há bastante tempo (Expert)</option>
        </select>
      </Field>
      <Field label="Disponibilidade" required>
        <select className={selectCls} value={fd.disponibilidade} onChange={e => set("disponibilidade", e.target.value)}>
          <option value="">Selecione...</option>
          <option value="total">Todos os dias (Incluindo Finais de Semana)</option>
          <option value="seg_sex">Segunda a Sexta</option>
          <option value="fds">Somente Finais de Semana</option>
          <option value="noite">Somente Período Noturno</option>
          <option value="freelancer">Dias Aleatórios / Sem data fixa</option>
        </select>
      </Field>

      <div className="sm:col-span-2">
        <label className="block text-xs font-semibold text-cream/60 uppercase tracking-wider mb-3">
          Áreas de Interesse
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {AREAS.map(({ value, label }) => {
            const checked = fd.areas_interesse.includes(value);
            return (
              <button key={value} type="button" onClick={() => toggleArea(value)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all duration-200 ${
                  checked ? "bg-brand/15 border-brand/50 text-brand" : "bg-dark-800 border-dark-600 text-cream/50 hover:border-dark-500 hover:text-cream/80"
                }`}>
                {checked && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                <span className="leading-tight">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {fd.areas_interesse.includes("outros") && (
        <div className="sm:col-span-2">
          <Field label="Quais outras áreas?">
            <input className={inputCls} placeholder="Descreva..." value={fd.areas_outros_texto}
              onChange={e => set("areas_outros_texto", e.target.value)} />
          </Field>
        </div>
      )}

      <Field label="Inglês">
        <select className={selectCls} value={fd.nivel_ingles} onChange={e => set("nivel_ingles", e.target.value)}>
          <option value="">Selecione o nível...</option>
          <option value="basico">Básico</option>
          <option value="intermediario">Intermediário</option>
          <option value="fluente">Fluente / Nativo</option>
        </select>
      </Field>
      <Field label="Espanhol">
        <select className={selectCls} value={fd.nivel_espanhol} onChange={e => set("nivel_espanhol", e.target.value)}>
          <option value="">Selecione o nível...</option>
          <option value="basico">Básico</option>
          <option value="intermediario">Intermediário</option>
          <option value="fluente">Fluente / Nativo</option>
        </select>
      </Field>
      <Field label="Francês">
        <select className={selectCls} value={fd.nivel_frances} onChange={e => set("nivel_frances", e.target.value)}>
          <option value="">Selecione o nível...</option>
          <option value="basico">Básico</option>
          <option value="intermediario">Intermediário</option>
          <option value="fluente">Fluente / Nativo</option>
        </select>
      </Field>
      <Field label="Outros Idiomas">
        <input className={inputCls} placeholder="Ex: Japonês Fluente, Alemão Básico" value={fd.outros_idiomas}
          onChange={e => set("outros_idiomas", e.target.value)} />
      </Field>
    </div>
  );
}

// ─── Step 6 ───────────────────────────────────────────────────────────────────

function Step6({ fd, set }: { fd: FormData; set: (k: keyof FormData, v: unknown) => void }) {
  return (
    <div className="grid sm:grid-cols-2 gap-5">
      <div className="sm:col-span-2">
        <p className="text-cream/40 text-sm">
          Dados bancários são usados para pagamento dos eventos. Podem ser atualizados depois no seu perfil.
        </p>
      </div>
      <Field label="PIX — Tipo de Chave">
        <select className={selectCls} value={fd.tipo_chave_pix} onChange={e => set("tipo_chave_pix", e.target.value)}>
          <option value="">Selecione...</option>
          <option value="cpf">CPF</option>
          <option value="email">E-mail</option>
          <option value="telefone">Telefone</option>
          <option value="aleatoria">Chave Aleatória</option>
        </select>
      </Field>
      <Field label="PIX — Chave">
        <input className={inputCls} placeholder="Digite sua chave PIX" value={fd.chave_pix}
          onChange={e => set("chave_pix", e.target.value)} />
      </Field>
      <div className="sm:col-span-2 border-t border-dark-600 pt-5">
        <p className="text-xs font-semibold text-cream/40 uppercase tracking-wider mb-4">Ou Transferência Bancária</p>
      </div>
      <Field label="Banco">
        <input className={inputCls} placeholder="Ex: Nubank, Itaú" value={fd.banco}
          onChange={e => set("banco", e.target.value)} />
      </Field>
      <Field label="Tipo de Conta">
        <select className={selectCls} value={fd.tipo_conta} onChange={e => set("tipo_conta", e.target.value)}>
          <option value="">Selecione...</option>
          <option value="corrente">Conta Corrente</option>
          <option value="poupanca">Conta Poupança</option>
        </select>
      </Field>
      <Field label="Agência">
        <input className={inputCls} placeholder="Ex: 0001" value={fd.agencia}
          onChange={e => set("agencia", onlyDigits(e.target.value).slice(0, 6))} inputMode="numeric" />
      </Field>
      <Field label="Conta com Dígito">
        <input className={inputCls} placeholder="Ex: 12345-6" value={fd.conta}
          onChange={e => set("conta", e.target.value.replace(/[^0-9-]/g, "").slice(0, 12))} inputMode="numeric" />
      </Field>
    </div>
  );
}

// ─── Step 7 ───────────────────────────────────────────────────────────────────

function PhotoPreview({ file, onRemove }: { file: File; onRemove: () => void }) {
  return (
    <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden border-2 border-brand/40 group">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-dark-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <button type="button" onClick={onRemove}
          className="px-4 py-2 bg-red-500/80 hover:bg-red-500 text-white text-xs font-semibold rounded-lg transition-colors">
          Remover foto
        </button>
      </div>
      <div className="absolute bottom-2 right-2 bg-brand/90 text-ink text-xs font-bold px-2 py-0.5 rounded">
        ✓
      </div>
    </div>
  );
}

const PHOTO_RULES = {
  foto_rosto: {
    label: "Foto de Rosto",
    badge: "Obrigatória",
    icon: "🤳",
    tip: "Capricha! Essa é a sua vitrine.",
    rules: [
      "Olhando direto para a câmera, expressão natural",
      "Boa iluminação — de frente, sem sombras no rosto",
      "Sem selfie, sem espelho, sem filtros",
      "Sem óculos escuros, boné ou cabelo cobrindo o rosto",
      "Só o rosto — do ombro para cima",
    ],
    placeholder: "foto de rosto",
  },
  foto_corpo: {
    label: "Foto de Corpo Inteiro",
    badge: "Obrigatória",
    icon: "🎪",
    tip: "Foto em evento, stand ou feira tem preferência!",
    rules: [
      "Corpo inteiro ou até os joelhos, de frente",
      "Preferencialmente em um evento, stand ou feira",
      "Roupa adequada — sem mostrar demais nem de menos",
      "Sem filtros pesados, boa iluminação",
      "Se tiver uniforme de algum evento anterior, ainda melhor!",
    ],
    placeholder: "foto de corpo inteiro",
  },
} as const;

function Step7({ fd, set, submitError }: { fd: FormData; set: (k: keyof FormData, v: unknown) => void; submitError?: string }) {
  return (
    <div className="grid gap-6">
      {/* Alerta de importância */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-brand/10 border border-brand/30">
        <span className="text-xl shrink-0">📸</span>
        <div>
          <p className="text-sm font-bold text-brand mb-1">Suas fotos são o seu cartão de visita!</p>
          <p className="text-sm text-cream/60 leading-relaxed">
            A Casting Certo seleciona profissionais com base nas fotos do cadastro. Capriche — fotos de qualidade aumentam muito suas chances de ser chamado para eventos.
          </p>
        </div>
      </div>

      {/* Cards de cada foto */}
      <div className="grid sm:grid-cols-2 gap-6">
        {(["foto_rosto", "foto_corpo"] as const).map((key) => {
          const cfg = PHOTO_RULES[key];
          const file = fd[key];
          const missing = submitError && !file;
          return (
            <div key={key} className="flex flex-col gap-3">
              {/* Header do card */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">{cfg.icon}</span>
                  <span className="text-xs font-bold text-cream uppercase tracking-wide">{cfg.label}</span>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                  {cfg.badge}
                </span>
              </div>

              {/* Instruções */}
              <div className={`rounded-xl p-4 border ${
                missing ? "bg-red-500/5 border-red-500/40" : "bg-dark-800 border-dark-600"
              }`}>
                <p className="text-xs font-semibold text-gold mb-2">{cfg.tip}</p>
                <ul className="space-y-1">
                  {cfg.rules.map((r, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-cream/50">
                      <span className="text-brand shrink-0 mt-0.5">•</span>{r}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Upload / Preview */}
              {file ? (
                <PhotoPreview file={file} onRemove={() => set(key, null)} />
              ) : (
                <label className={`group flex flex-col items-center justify-center aspect-[3/4] rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                  missing
                    ? "border-red-500/60 bg-red-500/5 hover:border-red-400"
                    : "border-dark-600 bg-dark-800 hover:border-brand/40 hover:bg-dark-700"
                }`}>
                  <Camera className={`w-10 h-10 mb-2 transition-colors ${
                    missing ? "text-red-400/60" : "text-cream/20 group-hover:text-brand/50"
                  }`} />
                  <span className={`text-xs font-semibold mb-1 transition-colors ${
                    missing ? "text-red-400" : "text-cream/40 group-hover:text-cream/70"
                  }`}>
                    {missing ? "⚠ Foto obrigatória" : "Clique para enviar"}
                  </span>
                  <span className="text-xs text-cream/25">JPG ou PNG · máx. 5 MB</span>
                  <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
                    onChange={e => set(key, e.target.files?.[0] ?? null)} />
                </label>
              )}
            </div>
          );
        })}
      </div>

      {/* Erro geral de fotos */}
      {submitError && (
        <p className="flex items-center gap-2 text-sm text-red-400 font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0" />{submitError}
        </p>
      )}

      {/* Termos */}
      <div className="space-y-3">
        {([
          ["termo_uso_imagem", "Autorizo o uso da minha imagem para divulgação pela Casting Certo."],
          ["termo_comunicacao", "Autorizo o contato via WhatsApp e E-mail para envio de vagas e comunicações."],
        ] as const).map(([key, text]) => (
          <div key={key} className="flex items-start gap-3 p-4 rounded-lg bg-dark-800 border border-dark-600">
            <input type="checkbox" id={key} checked={fd[key] as boolean}
              onChange={e => set(key, e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-brand cursor-pointer" />
            <label htmlFor={key} className="text-sm text-cream/70 cursor-pointer select-none">
              <span className="text-brand font-semibold">* </span>{text}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function CadastroPage() {
  const [step, setStep]           = useState(1);
  const [fd, setFd]               = useState<FormData>(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [photoError, setPhotoError] = useState("");

  const set = (k: keyof FormData, v: unknown) => setFd(prev => ({ ...prev, [k]: v }));

  const next = () => setStep(s => Math.min(s + 1, 7));
  const prev = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fd.foto_rosto || !fd.foto_corpo) {
      setPhotoError(
        !fd.foto_rosto && !fd.foto_corpo
          ? "As duas fotos são obrigatórias para concluir o cadastro."
          : !fd.foto_rosto
          ? "A foto de rosto é obrigatória."
          : "A foto de corpo inteiro é obrigatória."
      );
      return;
    }
    if (!fd.termo_uso_imagem || !fd.termo_comunicacao) {
      setPhotoError("Você precisa aceitar os dois termos para enviar o cadastro.");
      return;
    }
    setPhotoError("");
    setSubmitted(true);
  };

  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  if (submitted) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-brand/15 flex items-center justify-center mx-auto mb-6 animate-glow-brand">
            <CheckCircle2 className="w-10 h-10 text-brand" />
          </div>
          <h1 className="text-3xl font-bold text-cream mb-3">Cadastro enviado!</h1>
          <p className="text-cream/50 mb-8 leading-relaxed">
            Nossa equipe irá analisar seu perfil em até 48 horas e você receberá uma resposta no e-mail e WhatsApp informados.
          </p>
          <Link href="/" className="inline-flex items-center gap-2 px-7 py-3.5 bg-brand hover:bg-brand-light text-ink font-bold rounded transition-all btn-shimmer">
            Voltar à página inicial
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950 text-cream">
      <header className="sticky top-0 z-50 bg-dark-900/95 backdrop-blur-xl border-b border-dark-700">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo casting certo/logo casting certo.PNG" alt="Casting Certo" width={32} height={32} className="rounded-md" />
            <span className="text-sm font-bold text-cream hidden sm:block">Casting Certo</span>
          </Link>
          <p className="text-xs text-cream/40">Etapa {step} de {STEPS.length}</p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-2xl">
        <div className="mb-10">
          <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-2">Cadastro de Promotor</p>
          <h1 className="text-3xl font-bold text-cream">Faça parte da nossa equipe</h1>
          <p className="text-cream/40 text-sm mt-2">Preencha as informações abaixo para se candidatar às vagas da Casting Certo.</p>
        </div>

        {/* Step pills */}
        <div className="mb-8">
          <div className="flex items-center gap-1.5 mb-4 overflow-x-auto scrollbar-hide pb-1">
            {STEPS.map(({ id, label, icon: Icon }) => {
              const done   = id < step;
              const active = id === step;
              return (
                <div key={id}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 ${
                    active ? "bg-brand text-ink" : done ? "bg-dark-700 text-cream" : "bg-dark-800 text-cream/30"
                  }`}>
                  {done ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> : <Icon className="w-3.5 h-3.5 shrink-0" />}
                  {label}
                </div>
              );
            })}
          </div>
          <div className="h-1 bg-dark-800 rounded-full overflow-hidden">
            <div className="h-full bg-brand rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-dark-900 border border-dark-700 rounded-2xl p-6 md:p-8 mb-8">
            <div className="flex items-center gap-3 mb-7">
              {(() => {
                const { icon: Icon, label } = STEPS[step - 1];
                return (
                  <>
                    <div className="w-9 h-9 bg-brand/15 rounded-lg flex items-center justify-center text-brand shrink-0">
                      <Icon className="w-5 h-5" />
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
            {step === 5 && <Step5 fd={fd} set={set} />}
            {step === 6 && <Step6 fd={fd} set={set} />}
            {step === 7 && <Step7 fd={fd} set={set} submitError={photoError} />}
          </div>

          <div className="flex items-center justify-between gap-4">
            {step > 1 ? (
              <button type="button" onClick={prev}
                className="inline-flex items-center gap-2 px-6 py-3 rounded border border-dark-600 text-cream/60 hover:text-cream hover:border-dark-500 text-sm font-semibold transition-all">
                <ArrowLeft className="w-4 h-4" />Voltar
              </button>
            ) : (
              <Link href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded border border-dark-600 text-cream/60 hover:text-cream hover:border-dark-500 text-sm font-semibold transition-all">
                <ArrowLeft className="w-4 h-4" />Início
              </Link>
            )}

            {step < 7 ? (
              <button type="button" onClick={next}
                className="inline-flex items-center gap-2 px-7 py-3 bg-brand hover:bg-brand-light text-ink font-bold rounded transition-all active:scale-95 btn-shimmer">
                Próximo<ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button type="submit"
                className="inline-flex items-center gap-2 px-7 py-3 bg-brand hover:bg-brand-light text-ink font-bold rounded transition-all active:scale-95 btn-shimmer">
                Enviar Cadastro<ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {step === 1 && (
            <p className="text-center text-sm text-cream/30 mt-6">
              Já tem cadastro?{" "}
              <Link href="/login" className="text-cream/60 hover:text-cream underline transition-colors">Entrar</Link>
            </p>
          )}
        </form>
      </main>
    </div>
  );
}