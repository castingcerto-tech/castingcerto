"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, CheckCircle2, XCircle, AlertTriangle,
  User, X, Loader2, ZoomIn,
} from "lucide-react";

const MOTIVOS_REPROVACAO = [
  "Fotos não condizem com o solicitado",
  "Fotos de baixa qualidade ou escuras",
  "Dados pessoais incompletos ou incorretos",
  "Documentos ilegíveis ou inconsistentes",
  "Não atende o perfil no momento",
  "Menor de idade",
  "Duplicidade de cadastro",
  "Informações falsas ou suspeitas",
];

interface Promotor {
  id: string;
  email: string;
  status: string;
  motivoReprovacao: string | null;
  observacaoAdmin: string | null;
  dataReprovacao: string | null;
  criadoEm: string;
  perfil: Record<string, unknown> | null;
}

function calcIdade(dateStr: unknown): string {
  if (!dateStr) return "";
  const d = new Date(String(dateStr));
  if (isNaN(d.getTime())) return "";
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  if (now.getMonth() < d.getMonth() || (now.getMonth() === d.getMonth() && now.getDate() < d.getDate())) age--;
  return `${age} anos`;
}

export default function PromotorDetalhePage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<Promotor | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectMotivos, setRejectMotivos] = useState<string[]>([]);
  const [rejectDesc, setRejectDesc] = useState("");
  const [rejectAction, setRejectAction] = useState<"reprovar" | "correcao">("reprovar");
  const [photoModal, setPhotoModal] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  const fetchData = () => {
    setLoading(true);
    fetch(`/api/admin/promotores/${id}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleAprovar = async () => {
    setActing(true);
    setMsg("");
    try {
      const res = await fetch(`/api/admin/promotores/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "aprovar" }),
      });
      const d = await res.json();
      setMsg(d.message || "Aprovado!");
      fetchData();
    } catch { setMsg("Erro ao aprovar"); }
    finally { setActing(false); }
  };

  const handleReject = async () => {
    if (rejectMotivos.length === 0) return;
    setActing(true);
    setMsg("");
    try {
      const res = await fetch(`/api/admin/promotores/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: rejectAction,
          motivos: rejectMotivos,
          descricao: rejectDesc.trim() || null,
        }),
      });
      const d = await res.json();
      setMsg(d.message || "Ação concluída!");
      setShowRejectModal(false);
      setRejectMotivos([]);
      setRejectDesc("");
      fetchData();
    } catch { setMsg("Erro"); }
    finally { setActing(false); }
  };

  const toggleMotivo = (m: string) => {
    setRejectMotivos((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-brand animate-spin" />
      </div>
    );
  }

  if (!data || !data.perfil) {
    return (
      <div className="text-center py-20 text-cream/30">
        <p>Promotor não encontrado.</p>
        <Link href="/admin/promotores" className="text-brand text-sm mt-2 inline-block">← Voltar</Link>
      </div>
    );
  }

  const p = data.perfil;
  const v = (key: string) => {
    const val = p[key];
    return val == null || val === "" ? null : String(val);
  };

  const statusConfig: Record<string, { bg: string; text: string; border: string; emoji: string; label: string }> = {
    PENDENTE:  { bg: "bg-yellow-500/10", text: "text-yellow-400", border: "border-yellow-500/30", emoji: "⏳", label: "Pendente" },
    APROVADO:  { bg: "bg-green-500/10",  text: "text-green-400",  border: "border-green-500/30",  emoji: "✅", label: "Aprovado" },
    REPROVADO: { bg: "bg-red-500/10",    text: "text-red-400",    border: "border-red-500/30",    emoji: "❌", label: "Reprovado" },
    CORRECAO:  { bg: "bg-blue-500/10",   text: "text-blue-400",   border: "border-blue-500/30",   emoji: "🔄", label: "Correção" },
    BLOQUEADO: { bg: "bg-red-600/10",    text: "text-red-500",    border: "border-red-600/30",    emoji: "🚫", label: "Bloqueado" },
  };
  const st = statusConfig[data.status] ?? statusConfig.PENDENTE;

  const idade = calcIdade(p.dataNascimento);
  const cidadeEstado = [v("cidade"), v("estado")].filter(Boolean).join(" – ");

  return (
    <div>
      {/* Photo modal */}
      {photoModal && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setPhotoModal(null)}>
          <div className="relative max-w-3xl max-h-[90vh]">
            <button className="absolute -top-10 right-0 text-white/60 hover:text-white" onClick={() => setPhotoModal(null)}>
              <X className="w-6 h-6" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photoModal} alt="" className="max-w-full max-h-[85vh] rounded-2xl object-contain" />
          </div>
        </div>
      )}

      {/* Reject modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-dark-900 border border-dark-600 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-cream flex items-center gap-2">
                {rejectAction === "reprovar" ? "❌ Reprovar Cadastro" : "🔄 Solicitar Correção"}
              </h2>
              <button onClick={() => setShowRejectModal(false)} className="text-cream/30 hover:text-cream">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-cream/50 text-sm mb-4">
              Selecione os motivos {rejectAction === "reprovar" ? "da reprovação" : "do ajuste necessário"}:
            </p>

            <div className="space-y-2 mb-5">
              {MOTIVOS_REPROVACAO.map((m) => (
                <label key={m} className={`flex items-center gap-3 cursor-pointer p-3 rounded-xl border transition-all ${
                  rejectMotivos.includes(m)
                    ? "bg-brand/10 border-brand/40"
                    : "bg-dark-800/50 border-dark-700 hover:border-dark-500"
                }`}>
                  <input
                    type="checkbox"
                    checked={rejectMotivos.includes(m)}
                    onChange={() => toggleMotivo(m)}
                    className="w-4 h-4 rounded border-dark-600 bg-dark-800 text-brand focus:ring-brand/50 shrink-0"
                  />
                  <span className={`text-sm font-medium transition-colors ${
                    rejectMotivos.includes(m) ? "text-cream" : "text-cream/60"
                  }`}>{m}</span>
                </label>
              ))}
            </div>

            <div className="mb-5">
              <label className="text-xs text-cream/50 font-semibold uppercase tracking-wider">
                💬 Observação adicional (opcional)
              </label>
              <textarea
                value={rejectDesc}
                onChange={(e) => setRejectDesc(e.target.value)}
                rows={3}
                className="mt-1 w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-xl text-sm text-cream placeholder:text-cream/30 focus:outline-none focus:border-brand/50 resize-none"
                placeholder="Descreva detalhes adicionais se necessário..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 py-3 border border-dark-600 hover:border-dark-500 text-cream/60 font-semibold rounded-xl text-sm transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleReject}
                disabled={acting || rejectMotivos.length === 0}
                className={`flex-1 py-3 font-bold rounded-xl text-sm transition-colors disabled:opacity-50 ${
                  rejectAction === "reprovar"
                    ? "bg-red-500 hover:bg-red-400 text-white"
                    : "bg-blue-500 hover:bg-blue-400 text-white"
                }`}
              >
                {acting ? "Enviando..." : rejectAction === "reprovar" ? "Confirmar Reprovação" : "Solicitar Correção"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════ HEADER ═══════ */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.push("/admin/promotores")} className="p-2 rounded-xl text-cream/40 hover:text-cream hover:bg-dark-800 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-cream">{v("nomeCompleto") || "Sem nome"}</h1>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${st.bg} ${st.text} ${st.border}`}>
              <span>{st.emoji}</span> {st.label}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1 text-sm text-cream/40 flex-wrap">
            <span>📧 {data.email}</span>
            {cidadeEstado && <><span className="text-cream/15">•</span><span>📍 {cidadeEstado}</span></>}
            {idade && <><span className="text-cream/15">•</span><span>🎂 {idade}</span></>}
            <span className="text-cream/15">•</span>
            <span>📅 Cadastro {new Date(data.criadoEm).toLocaleDateString("pt-BR")}</span>
          </div>
        </div>
      </div>

      {msg && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-brand/10 border border-brand/20 text-sm text-brand font-semibold flex items-center gap-2">
          ✨ {msg}
        </div>
      )}

      {/* ═══════ AÇÕES ═══════ */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button
          onClick={handleAprovar}
          disabled={acting || data.status === "APROVADO"}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30 disabled:hover:scale-100"
        >
          <CheckCircle2 className="w-5 h-5" />
          Aprovar
        </button>
        <button
          onClick={() => { setRejectAction("reprovar"); setShowRejectModal(true); }}
          disabled={acting}
          className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30"
        >
          <XCircle className="w-5 h-5" />
          Reprovar
        </button>
        <button
          onClick={() => { setRejectAction("correcao"); setShowRejectModal(true); }}
          disabled={acting}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30"
        >
          <AlertTriangle className="w-5 h-5" />
          Pedir Correção
        </button>
      </div>

      {/* ═══════ REPROVAÇÃO ANTERIOR ═══════ */}
      {data.motivoReprovacao && (
        <div className="mb-8 p-5 rounded-2xl border border-red-500/20 bg-red-500/5">
          <p className="text-sm font-bold text-red-400 mb-2 flex items-center gap-2">⚠️ Última reprovação</p>
          <p className="text-sm text-cream/70 leading-relaxed">{data.motivoReprovacao}</p>
          {data.observacaoAdmin && (
            <p className="text-sm text-cream/50 mt-2 italic border-t border-red-500/10 pt-2">&ldquo;{data.observacaoAdmin}&rdquo;</p>
          )}
          {data.dataReprovacao && (
            <p className="text-xs text-cream/30 mt-2">📅 {new Date(data.dataReprovacao).toLocaleDateString("pt-BR")}</p>
          )}
        </div>
      )}

      {/* ═══════ FOTOS — TAMANHO COMPLETO ═══════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
        {[
          { url: v("fotoRosto"), label: "🤳 Selfie / Rosto", empty: "Sem foto de rosto" },
          { url: v("fotoCorpo"), label: "🧍 Corpo Inteiro", empty: "Sem foto de corpo" },
        ].map((foto) => (
          <div key={foto.label} className="rounded-2xl border border-dark-700 bg-dark-900 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-dark-700 bg-dark-800/50">
              <span className="text-sm font-bold text-cream">{foto.label}</span>
              {foto.url && (
                <button
                  onClick={() => setPhotoModal(foto.url!)}
                  className="flex items-center gap-1.5 text-xs text-brand hover:text-brand-light font-semibold transition-colors"
                >
                  <ZoomIn className="w-3.5 h-3.5" /> Ampliar
                </button>
              )}
            </div>
            {foto.url ? (
              <button onClick={() => setPhotoModal(foto.url!)} className="w-full relative group cursor-zoom-in">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={foto.url} alt={foto.label} className="w-full object-contain max-h-[500px] bg-dark-950" />
              </button>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-cream/15 gap-2">
                <User className="w-12 h-12" />
                <span className="text-xs">{foto.empty}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ═══════ DADOS — CARDS VISUAIS ═══════ */}
      <div className="space-y-6 mb-8">

        {/* Dados Pessoais + Contato */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <InfoCard emoji="👤" title="Dados Pessoais">
            <InfoRow emoji="📝" label="Nome" value={v("nomeCompleto")} />
            <InfoRow emoji="🪪" label="CPF" value={v("cpf")} />
            <InfoRow emoji="🆔" label="RG" value={v("rg")} />
            <InfoRow emoji="🎂" label="Nascimento" value={v("dataNascimento")} extra={idade} />
            <InfoRow emoji="⚧" label="Gênero" value={v("genero")} />
            <InfoRow emoji="🌍" label="Etnia" value={v("etnia")} />
            <InfoRow emoji="🏳️" label="Nacionalidade" value={v("nacionalidade")} />
            <InfoRow emoji="📸" label="Instagram" value={v("instagram") ? `@${v("instagram")}` : null} link={v("instagram") ? `https://instagram.com/${v("instagram")}` : undefined} />
            {Boolean(p.isPcd) && <InfoRow emoji="♿" label="PCD" value={String(p.descricaoPcd || "Sim")} />}
          </InfoCard>

          <InfoCard emoji="📞" title="Contato e Endereço">
            <InfoRow emoji="💬" label="WhatsApp" value={v("whatsapp")} />
            <InfoRow emoji="📧" label="E-mail" value={data.email} />
            <InfoRow emoji="📮" label="CEP" value={v("cep")} />
            <InfoRow emoji="🏠" label="Endereço" value={[v("endereco"), v("numero")].filter(Boolean).join(", ") || null} />
            <InfoRow emoji="🏘️" label="Bairro" value={v("bairro")} />
            <InfoRow emoji="📍" label="Cidade" value={cidadeEstado || null} />
          </InfoCard>
        </div>

        {/* Medidas + Profissional */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <InfoCard emoji="📏" title="Medidas e Aparência">
            <div className="grid grid-cols-2 gap-3">
              <MiniStat emoji="📐" label="Altura" value={v("altura")} />
              <MiniStat emoji="⚖️" label="Peso" value={v("peso") ? `${v("peso")} kg` : null} />
              <MiniStat emoji="👗" label="Manequim" value={v("manequim")} />
              <MiniStat emoji="👟" label="Calçado" value={v("calcado")} />
              <MiniStat emoji="👕" label="Camiseta" value={v("tamanhoCamiseta")} />
              <MiniStat emoji="👁️" label="Olhos" value={v("olhos")} />
              <MiniStat emoji="💇" label="Cabelo" value={v("cabeloTipo")} />
              <MiniStat emoji="✂️" label="Comprimento" value={v("cabeloComprimento")} />
            </div>
          </InfoCard>

          <InfoCard emoji="💼" title="Profissional">
            <InfoRow emoji="🎯" label="Experiência" value={v("experiencia")} />
            {v("areasAtuacao") && (
              <div className="pt-1 pb-2">
                <p className="text-xs text-cream/40 mb-2">🏷️ Áreas de Atuação</p>
                <div className="flex flex-wrap gap-2">
                  {String(v("areasAtuacao")).split(",").map((a) => (
                    <span key={a} className="px-3 py-1 rounded-full text-xs font-semibold bg-brand/10 text-brand border border-brand/20">
                      {a.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <InfoRow emoji="📅" label="Disponibilidade" value={v("disponibilidade")} />
            <InfoRow emoji="🇺🇸" label="Inglês" value={v("nivelIngles")} />
            <InfoRow emoji="🇪🇸" label="Espanhol" value={v("nivelEspanhol")} />
          </InfoCard>
        </div>

        {/* Dados Bancários */}
        <InfoCard emoji="🏦" title="Dados Bancários">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
            <InfoRow emoji="🔑" label="Chave PIX" value={v("chavePix")} />
            <InfoRow emoji="🏷️" label="Tipo PIX" value={v("tipoChavePix")} />
            <InfoRow emoji="🏧" label="Banco" value={v("banco")} />
            <InfoRow emoji="📋" label="Tipo Conta" value={v("tipoConta")} />
            <InfoRow emoji="🔢" label="Agência" value={v("agencia")} />
            <InfoRow emoji="💳" label="Conta" value={v("conta")} />
          </div>
        </InfoCard>
      </div>
    </div>
  );
}

/* ── Info Card ─────────────────────────────────────────────────── */
function InfoCard({ emoji, title, children }: { emoji: string; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-dark-700 bg-dark-900 overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-dark-700 bg-dark-800/50">
        <span className="text-lg">{emoji}</span>
        <h3 className="font-bold text-cream">{title}</h3>
      </div>
      <div className="px-5 py-4 space-y-0">{children}</div>
    </div>
  );
}

/* ── Info Row ─────────────────────────────────────────────────── */
function InfoRow({ emoji, label, value, extra, link }: {
  emoji: string; label: string; value: string | null; extra?: string; link?: string;
}) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-dark-800 last:border-0">
      <span className="text-base shrink-0">{emoji}</span>
      <span className="text-sm text-cream/50 shrink-0 min-w-[90px]">{label}</span>
      <span className="flex-1" />
      {value ? (
        <span className="text-sm font-semibold text-cream text-right">
          {link ? (
            <a href={link} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">{value}</a>
          ) : value}
          {extra && <span className="text-cream/40 font-normal ml-1.5">({extra})</span>}
        </span>
      ) : (
        <span className="text-sm text-cream/20 italic">—</span>
      )}
    </div>
  );
}

/* ── Mini Stat Card ───────────────────────────────────────────── */
function MiniStat({ emoji, label, value }: { emoji: string; label: string; value: string | null }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-dark-800/50 border border-dark-700/50">
      <span className="text-lg">{emoji}</span>
      <div className="min-w-0">
        <p className="text-[10px] text-cream/40 uppercase tracking-wider leading-tight">{label}</p>
        <p className={`text-sm font-bold leading-tight mt-0.5 ${value ? "text-cream" : "text-cream/20"}`}>
          {value ?? "—"}
        </p>
      </div>
    </div>
  );
}
