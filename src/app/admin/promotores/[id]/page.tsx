"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft, CheckCircle2, XCircle, AlertTriangle, Clock,
  User, Phone, Mail, MapPin, Calendar, Briefcase, CreditCard,
  Eye, X, Loader2,
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

const LABELS: Record<string, string> = {
  genero: "Gênero",
  etnia: "Etnia",
  nacionalidade: "Nacionalidade",
  nivelIngles: "Inglês",
  nivelEspanhol: "Espanhol",
  altura: "Altura",
  peso: "Peso",
  manequim: "Manequim",
  calcado: "Calçado",
  tamanhoCamiseta: "Camiseta",
  olhos: "Olhos",
  cabeloTipo: "Cabelo",
  cabeloComprimento: "Comprimento",
  experiencia: "Experiência",
  areasAtuacao: "Áreas de Atuação",
  disponibilidade: "Disponibilidade",
  banco: "Banco",
  tipoConta: "Tipo de Conta",
  agencia: "Agência",
  conta: "Conta",
  tipoChavePix: "Tipo Chave PIX",
  chavePix: "Chave PIX",
};

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
  const statusColor: Record<string, string> = {
    PENDENTE: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    APROVADO: "bg-green-500/15 text-green-400 border-green-500/30",
    REPROVADO: "bg-red-500/15 text-red-400 border-red-500/30",
    CORRECAO: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    BLOQUEADO: "bg-red-600/15 text-red-500 border-red-600/30",
  };
  const statusLabel: Record<string, string> = {
    PENDENTE: "Pendente", APROVADO: "Aprovado", REPROVADO: "Reprovado",
    CORRECAO: "Correção", BLOQUEADO: "Bloqueado",
  };

  return (
    <div>
      {/* Photo modal */}
      {photoModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setPhotoModal(null)}>
          <div className="relative max-w-2xl max-h-[90vh]">
            <button className="absolute -top-10 right-0 text-white/60 hover:text-white" onClick={() => setPhotoModal(null)}>
              <X className="w-6 h-6" />
            </button>
            <img src={photoModal} alt="" className="max-w-full max-h-[85vh] rounded-xl object-contain" />
          </div>
        </div>
      )}

      {/* Reject modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-dark-900 border border-dark-600 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-cream">
                {rejectAction === "reprovar" ? "Reprovar Cadastro" : "Solicitar Correção"}
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
                <label key={m} className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rejectMotivos.includes(m)}
                    onChange={() => toggleMotivo(m)}
                    className="mt-0.5 w-4 h-4 rounded border-dark-600 bg-dark-800 text-brand focus:ring-brand/50 shrink-0"
                  />
                  <span className="text-sm text-cream/70 group-hover:text-cream transition-colors">{m}</span>
                </label>
              ))}
            </div>

            <div className="mb-5">
              <label className="text-xs text-cream/50 font-semibold uppercase tracking-wider">
                Observação adicional (opcional)
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

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.push("/admin/promotores")} className="text-cream/40 hover:text-cream transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-cream truncate">{(p.nomeCompleto as string) || "Sem nome"}</h1>
          <p className="text-cream/40 text-sm">{data.email}</p>
        </div>
        <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${statusColor[data.status] ?? "bg-dark-700 text-cream/40"}`}>
          {statusLabel[data.status] ?? data.status}
        </span>
      </div>

      {msg && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-brand/10 border border-brand/20 text-sm text-brand">{msg}</div>
      )}

      {/* Ações */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button
          onClick={handleAprovar}
          disabled={acting || data.status === "APROVADO"}
          className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white font-bold text-sm rounded-xl transition-colors disabled:opacity-30"
        >
          <CheckCircle2 className="w-4 h-4" />
          Aprovar
        </button>
        <button
          onClick={() => { setRejectAction("reprovar"); setShowRejectModal(true); }}
          disabled={acting}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-sm rounded-xl transition-colors disabled:opacity-30"
        >
          <XCircle className="w-4 h-4" />
          Reprovar
        </button>
        <button
          onClick={() => { setRejectAction("correcao"); setShowRejectModal(true); }}
          disabled={acting}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-colors disabled:opacity-30"
        >
          <AlertTriangle className="w-4 h-4" />
          Pedir Correção
        </button>
      </div>

      {/* Motivo da última reprovação/correção */}
      {data.motivoReprovacao && (
        <div className="mb-8 p-4 rounded-2xl border border-red-500/20 bg-red-500/5">
          <p className="text-xs text-red-400 font-semibold uppercase tracking-wider mb-1">Motivo da reprovação</p>
          <p className="text-sm text-cream/70">{data.motivoReprovacao}</p>
          {data.observacaoAdmin && (
            <p className="text-sm text-cream/50 mt-2 italic">&ldquo;{data.observacaoAdmin}&rdquo;</p>
          )}
          {data.dataReprovacao && (
            <p className="text-xs text-cream/30 mt-2">Data: {new Date(data.dataReprovacao).toLocaleDateString("pt-BR")}</p>
          )}
        </div>
      )}

      {/* Fotos */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {[
          { url: p.fotoRosto as string | null, label: "Foto de Rosto" },
          { url: p.fotoCorpo as string | null, label: "Foto de Corpo" },
        ].map((foto) => (
          <div key={foto.label} className="rounded-2xl border border-dark-700 bg-dark-900 overflow-hidden">
            <p className="px-4 py-2 text-xs text-cream/40 font-semibold uppercase tracking-wider border-b border-dark-700">
              {foto.label}
            </p>
            {foto.url ? (
              <button onClick={() => setPhotoModal(foto.url!)} className="w-full relative group">
                <img src={foto.url} alt={foto.label} className="w-full h-64 object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
            ) : (
              <div className="h-64 flex items-center justify-center text-cream/15">
                <User className="w-12 h-12" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Dados pessoais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Identidade */}
        <Section title="Dados Pessoais" icon={User}>
          <Field label="Nome Completo" value={p.nomeCompleto} />
          <Field label="CPF" value={p.cpf} />
          <Field label="RG" value={p.rg} />
          <Field label="Data de Nascimento" value={p.dataNascimento} />
          <Field label="Gênero" value={p.genero} />
          <Field label="Etnia" value={p.etnia} />
          <Field label="Nacionalidade" value={p.nacionalidade} />
          <Field label="Instagram" value={p.instagram} />
          {Boolean(p.isPcd) && <Field label="PCD" value={String(p.descricaoPcd || "Sim")} />}
        </Section>

        {/* Contato */}
        <Section title="Contato e Endereço" icon={MapPin}>
          <Field label="WhatsApp" value={p.whatsapp} />
          <Field label="E-mail" value={data.email} />
          <Field label="CEP" value={p.cep} />
          <Field label="Endereço" value={[p.endereco, p.numero].filter(Boolean).join(", ")} />
          <Field label="Bairro" value={p.bairro} />
          <Field label="Cidade" value={[p.cidade, p.estado].filter(Boolean).join(" - ")} />
        </Section>

        {/* Físico */}
        <Section title="Medidas e Aparência" icon={Eye}>
          <Field label="Altura" value={p.altura} />
          <Field label="Peso" value={p.peso} />
          <Field label="Manequim" value={p.manequim} />
          <Field label="Calçado" value={p.calcado} />
          <Field label="Camiseta" value={p.tamanhoCamiseta} />
          <Field label="Olhos" value={p.olhos} />
          <Field label="Cabelo" value={p.cabeloTipo} />
          <Field label="Comprimento" value={p.cabeloComprimento} />
        </Section>

        {/* Profissional */}
        <Section title="Profissional" icon={Briefcase}>
          <Field label="Experiência" value={p.experiencia} />
          <Field label="Áreas de Atuação" value={p.areasAtuacao} />
          <Field label="Disponibilidade" value={p.disponibilidade} />
          <Field label="Inglês" value={p.nivelIngles} />
          <Field label="Espanhol" value={p.nivelEspanhol} />
        </Section>

        {/* Bancário */}
        <Section title="Dados Bancários" icon={CreditCard}>
          <Field label="Banco" value={p.banco} />
          <Field label="Tipo de Conta" value={p.tipoConta} />
          <Field label="Agência" value={p.agencia} />
          <Field label="Conta" value={p.conta} />
          <Field label="Tipo Chave PIX" value={p.tipoChavePix} />
          <Field label="Chave PIX" value={p.chavePix} />
        </Section>

        {/* Meta */}
        <Section title="Informações do Sistema" icon={Calendar}>
          <Field label="Cadastro em" value={new Date(data.criadoEm).toLocaleDateString("pt-BR")} />
          <Field label="Status" value={statusLabel[data.status] ?? data.status} />
          <Field label="ID" value={data.id} />
        </Section>
      </div>
    </div>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-dark-700 bg-dark-900 overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3 border-b border-dark-700 bg-dark-800/50">
        <Icon className="w-4 h-4 text-brand" />
        <h3 className="text-sm font-bold text-cream">{title}</h3>
      </div>
      <div className="px-5 py-4 space-y-2.5">{children}</div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: unknown }) {
  const display = value == null || value === "" ? "—" : String(value);
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-xs text-cream/40 shrink-0">{label}</span>
      <span className={`text-sm text-right ${display === "—" ? "text-cream/20" : "text-cream/80"}`}>{display}</span>
    </div>
  );
}
