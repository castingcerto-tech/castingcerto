"use client";

import { useEffect, useState } from "react";
import {
  HardDrive,
  Wifi,
  Image as ImageIcon,
  RefreshCw,
  Globe,
  Server,
  Database,
  Mail,
  Cloud,
  Camera,
  Github,
  Info,
  AlertTriangle,
} from "lucide-react";

/* ─── types ───────────────────────────────────────────────────── */
interface CloudinaryUsage {
  storage: { used: number; limit: number };
  bandwidth: { used: number; limit: number };
  transformations: { used: number; limit: number };
  objects: number;
  lastUpdated: string;
}

interface NeonUsage {
  projectName: string;
  storage: { used: number; limit: number };
  compute: { used: number; limit: number };
  transfer: { used: number; limit: number };
  branches: { used: number; limit: number };
  lastUpdated: string;
}

/* ─── helpers ─────────────────────────────────────────────────── */
function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/* ─── UsageBar (barra de progresso) ──────────────────────────── */
function UsageBar({ label, icon: Icon, used, limit, formatFn }: {
  label: string;
  icon: React.ElementType;
  used: number;
  limit: number;
  formatFn: (n: number) => string;
}) {
  const pct = limit > 0 ? Math.min((used / limit) * 100, 100) : 0;
  const color = pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-yellow-500" : "bg-green-500";
  const textColor = pct >= 90 ? "text-red-400" : pct >= 70 ? "text-yellow-400" : "text-green-400";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-cream/50" />
          <span className="text-sm font-medium text-cream/70">{label}</span>
        </div>
        <span className={`text-sm font-bold ${textColor}`}>{pct.toFixed(1)}%</span>
      </div>
      <div className="w-full h-3 bg-dark-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-cream/40">
        <span>{formatFn(used)} usado</span>
        <span>{formatFn(limit)} total</span>
      </div>
    </div>
  );
}

/* ─── ServiceSection (card de cada serviço) ──────────────────── */
function ServiceSection({ icon: Icon, emoji, title, description, color, children }: {
  icon: React.ElementType;
  emoji: string;
  title: string;
  description: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dark-700 bg-dark-900 p-6">
      <div className="flex items-start gap-4 mb-5">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-cream">{emoji} {title}</h2>
          <p className="text-sm text-cream/40 mt-0.5">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

/* ─── LimitRow (linha de limite estático) ────────────────────── */
function LimitRow({ label, value, tip }: { label: string; value: string; tip?: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-dark-800 last:border-0 gap-1">
      <div>
        <span className="text-sm text-cream/70">{label}</span>
        {tip && <p className="text-xs text-cream/30 mt-0.5">{tip}</p>}
      </div>
      <span className="text-sm font-semibold text-cream/90 sm:text-right">{value}</span>
    </div>
  );
}

/* ─── Page ────────────────────────────────────────────────────── */
export default function LimitesPage() {
  const [cloudUsage, setCloudUsage] = useState<CloudinaryUsage | null>(null);
  const [cloudLoading, setCloudLoading] = useState(true);
  const [neonUsage, setNeonUsage] = useState<NeonUsage | null>(null);
  const [neonLoading, setNeonLoading] = useState(true);

  const fetchCloudUsage = () => {
    setCloudLoading(true);
    fetch("/api/admin/cloudinary-usage")
      .then((r) => r.json())
      .then((data) => { if (!data.error) setCloudUsage(data); })
      .catch(() => {})
      .finally(() => setCloudLoading(false));
  };

  const fetchNeonUsage = () => {
    setNeonLoading(true);
    fetch("/api/admin/neon-usage")
      .then((r) => r.json())
      .then((data) => { if (!data.error) setNeonUsage(data); })
      .catch(() => {})
      .finally(() => setNeonLoading(false));
  };

  useEffect(() => {
    fetchCloudUsage();
    fetchNeonUsage();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-cream">📊 Limites e Uso dos Serviços</h1>
        <p className="text-cream/40 text-sm mt-1">
          Acompanhe em tempo real o uso de cada serviço gratuito que mantém o site funcionando.
        </p>
      </div>

      {/* Alerta explicativo */}
      <div className="mb-6 rounded-xl border border-brand/30 bg-brand/5 p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-brand shrink-0 mt-0.5" />
        <div className="text-sm text-cream/60">
          <strong className="text-cream/80">O que é isso?</strong> O site usa vários serviços gratuitos. Cada um tem limites.
          Aqui você acompanha se está perto de algum limite. <strong className="text-green-400">Verde</strong> = tranquilo,{" "}
          <strong className="text-yellow-400">Amarelo</strong> = atenção,{" "}
          <strong className="text-red-400">Vermelho</strong> = quase no limite.
        </div>
      </div>

      <div className="space-y-6">

        {/* ═══════ CLOUDINARY ═══════ */}
        <ServiceSection
          icon={Camera}
          emoji="📸"
          title="Armazenamento de Fotos (Cloudinary)"
          description="Onde ficam guardadas todas as fotos dos promotores — rosto e corpo inteiro."
          color="bg-orange-500/15 text-orange-400"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-cream/30">
              {cloudUsage && <>Atualizado em {new Date(cloudUsage.lastUpdated).toLocaleString("pt-BR")}</>}
            </p>
            <button
              onClick={fetchCloudUsage}
              disabled={cloudLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-800 hover:bg-dark-700 transition-colors disabled:opacity-50 text-xs text-cream/60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${cloudLoading ? "animate-spin" : ""}`} />
              Atualizar
            </button>
          </div>

          {cloudLoading && !cloudUsage ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
            </div>
          ) : cloudUsage ? (
            <div className="space-y-5">
              <UsageBar
                label="Espaço para fotos"
                icon={HardDrive}
                used={cloudUsage.storage.used}
                limit={cloudUsage.storage.limit}
                formatFn={formatBytes}
              />
              <UsageBar
                label="Tráfego mensal (quando alguém vê as fotos)"
                icon={Wifi}
                used={cloudUsage.bandwidth.used}
                limit={cloudUsage.bandwidth.limit}
                formatFn={formatBytes}
              />
              <UsageBar
                label="Edições de imagem por mês"
                icon={ImageIcon}
                used={cloudUsage.transformations.used}
                limit={cloudUsage.transformations.limit}
                formatFn={(n) => n.toLocaleString("pt-BR")}
              />
              <div className="pt-3 border-t border-dark-700 flex items-center gap-2 text-xs text-cream/40">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Total de fotos salvas: <strong className="text-cream/60">{cloudUsage.objects.toLocaleString("pt-BR")}</strong></span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-red-400/70 text-center py-4">
              Não foi possível carregar os dados. Tente atualizar.
            </p>
          )}

          <div className="mt-4 p-3 rounded-lg bg-dark-800/50 text-xs text-cream/30 space-y-1">
            <p>💡 <strong className="text-cream/50">O que acontece se acabar?</strong></p>
            <p>As fotos já salvas continuam no ar, mas novas fotos não poderão ser enviadas até o próximo mês (banda) ou até liberar espaço (armazenamento).</p>
          </div>
        </ServiceSection>

        {/* ═══════ VERCEL ═══════ */}
        <ServiceSection
          icon={Server}
          emoji="🌐"
          title="Hospedagem do Site (Vercel)"
          description="Onde o site fica no ar para as pessoas acessarem. É como o 'terreno' onde a 'casa' do site foi construída."
          color="bg-white/10 text-white"
        >
          <div className="space-y-0">
            <LimitRow
              label="Banda mensal"
              value="100 GB / mês"
              tip="Quanto de dados o site pode enviar para quem acessa. 100 GB é bastante — milhares de visitas por mês."
            />
            <LimitRow
              label="Builds (atualizações do site)"
              value="6.000 minutos / mês"
              tip="Cada vez que atualizamos o site, conta como um 'build'. Cada um usa poucos minutos."
            />
            <LimitRow
              label="Deploys por dia"
              value="100 por dia"
              tip="Quantidade de vezes que o site pode ser atualizado por dia. Dificilmente passamos de 10."
            />
            <LimitRow
              label="Funções serverless"
              value="Tempo máximo de 10 segundos"
              tip="As ações do site (login, cadastro, etc.) devem finalizar em até 10 segundos cada."
            />
            <LimitRow
              label="Otimização de imagens"
              value="1.000 imagens / mês"
              tip="Imagens que o site ajusta automaticamente para carregar mais rápido."
            />
          </div>
          <div className="mt-4 p-3 rounded-lg bg-dark-800/50 text-xs text-cream/30 space-y-1">
            <p>💡 <strong className="text-cream/50">Risco de ultrapassar?</strong></p>
            <p>Muito baixo. O plano gratuito da Vercel é bastante generoso. Só é necessário investir em plano pago se o site tiver milhares de acessos diários.</p>
          </div>
        </ServiceSection>

        {/* ═══════ NEON ═══════ */}
        <ServiceSection
          icon={Database}
          emoji="🗄️"
          title="Banco de Dados (Neon)"
          description="Onde ficam guardados todos os dados: cadastros, nomes, CPFs, informações dos promotores, logins, etc."
          color="bg-emerald-500/15 text-emerald-400"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-cream/30">
              {neonUsage && <>Atualizado em {new Date(neonUsage.lastUpdated).toLocaleString("pt-BR")}</>}
            </p>
            <button
              onClick={fetchNeonUsage}
              disabled={neonLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-800 hover:bg-dark-700 transition-colors disabled:opacity-50 text-xs text-cream/60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${neonLoading ? "animate-spin" : ""}`} />
              Atualizar
            </button>
          </div>

          {neonLoading && !neonUsage ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : neonUsage ? (
            <div className="space-y-5">
              <UsageBar
                label="Armazenamento de dados"
                icon={HardDrive}
                used={neonUsage.storage.used}
                limit={neonUsage.storage.limit}
                formatFn={formatBytes}
              />
              <UsageBar
                label="Horas de processamento (mensal)"
                icon={Database}
                used={neonUsage.compute.used}
                limit={neonUsage.compute.limit}
                formatFn={(n) => n.toFixed(1) + " horas"}
              />
              <UsageBar
                label="Transferência de dados (mensal)"
                icon={Wifi}
                used={neonUsage.transfer.used}
                limit={neonUsage.transfer.limit}
                formatFn={formatBytes}
              />
              <UsageBar
                label="Branches (cópias do banco)"
                icon={Database}
                used={neonUsage.branches.used}
                limit={neonUsage.branches.limit}
                formatFn={(n) => Math.round(n).toString()}
              />
            </div>
          ) : (
            <p className="text-sm text-red-400/70 text-center py-4">
              Não foi possível carregar os dados. Tente atualizar.
            </p>
          )}

          <div className="mt-4 p-3 rounded-lg bg-dark-800/50 text-xs text-cream/30 space-y-1">
            <p>💡 <strong className="text-cream/50">O que acontece se acabar?</strong></p>
            <p>O banco pausa automaticamente quando acaba as horas de processamento. Volta no início do próximo mês. Os dados nunca são perdidos.</p>
          </div>
        </ServiceSection>

        {/* ═══════ CLOUDFLARE ═══════ */}
        <ServiceSection
          icon={Mail}
          emoji="📧"
          title="E-mail Profissional (Cloudflare)"
          description="Serviço que faz com que e-mails enviados para @castingcerto.com.br cheguem no Gmail."
          color="bg-orange-500/15 text-orange-400"
        >
          <div className="space-y-0">
            <LimitRow
              label="E-mails recebidos"
              value="Ilimitado"
              tip="Não tem limite para receber e-mails em @castingcerto.com.br."
            />
            <LimitRow
              label="Endereços de e-mail"
              value="200 endereços"
              tip="Podem criar até 200 e-mails diferentes (suporte@, contato@, jessica@, etc)."
            />
            <LimitRow
              label="Envio de e-mails (pelo Gmail)"
              value="500 por dia"
              tip="Limite do Gmail para enviar e-mails. É o limite de envio pela conta Gmail que recebe os e-mails."
            />
          </div>
          <div className="mt-4 p-3 rounded-lg bg-dark-800/50 text-xs text-cream/30 space-y-1">
            <p>💡 <strong className="text-cream/50">Preciso me preocupar?</strong></p>
            <p>Não. O plano gratuito do Cloudflare Email Routing é muito generoso. 500 e-mails/dia é mais que suficiente.</p>
          </div>
        </ServiceSection>

        {/* ═══════ GMAIL ═══════ */}
        <ServiceSection
          icon={Mail}
          emoji="✉️"
          title="E-mail Principal (Gmail)"
          description="A conta do Gmail real que recebe todos os e-mails redirecionados de @castingcerto.com.br."
          color="bg-red-500/15 text-red-400"
        >
          <div className="space-y-0">
            <LimitRow
              label="Armazenamento"
              value="15 GB gratuitos"
              tip="Espaço para guardar e-mails, anexos e arquivos no Google Drive. Compartilhado com Drive e Google Fotos."
            />
            <LimitRow
              label="Envio de e-mails"
              value="500 por dia"
              tip="Máximo de e-mails que podem ser enviados por dia com Gmail gratuito."
            />
            <LimitRow
              label="Tamanho máximo de anexo"
              value="25 MB por e-mail"
              tip="Cada e-mail pode ter anexos de até 25 MB."
            />
            <LimitRow
              label="E-mails automáticos do site (redefinir senha, etc.)"
              value="Depende do provedor"
              tip="E-mails automáticos (como 'Esqueci minha senha') são enviados pela Vercel/NextAuth. O limite é do serviço de envio configurado."
            />
          </div>
          <div className="mt-4 p-3 rounded-lg bg-dark-800/50 text-xs text-cream/30 space-y-1">
            <p>💡 <strong className="text-cream/50">Sobre e-mails automáticos do site</strong></p>
            <p>Atualmente o site usa login por senha e Google. E-mails automáticos (como redefinição de senha) não estão ativos — o login é direto, sem envio de e-mail.</p>
          </div>
        </ServiceSection>

        {/* ═══════ GITHUB ═══════ */}
        <ServiceSection
          icon={Github}
          emoji="💻"
          title="Código-fonte (GitHub)"
          description="Onde fica salvo todo o código do site. É como o 'cofre' com a receita do site."
          color="bg-purple-500/15 text-purple-400"
        >
          <div className="space-y-0">
            <LimitRow
              label="Repositórios privados"
              value="Ilimitado"
              tip="Podem ter quantos projetos privados quiser no plano gratuito."
            />
            <LimitRow
              label="Colaboradores"
              value="Ilimitado"
              tip="Quantas pessoas quiser podem ter acesso ao código."
            />
            <LimitRow
              label="GitHub Actions (automações)"
              value="2.000 minutos / mês"
              tip="Usado para testes e deploys automáticos. Não estamos usando isso."
            />
            <LimitRow
              label="Armazenamento de pacotes"
              value="500 MB"
              tip="Espaço para pacotes. Não estamos usando."
            />
          </div>
          <div className="mt-4 p-3 rounded-lg bg-dark-800/50 text-xs text-cream/30 space-y-1">
            <p>💡 <strong className="text-cream/50">Preciso me preocupar?</strong></p>
            <p>Não. O GitHub é extremamente generoso no plano gratuito. O código do site está seguro e sem risco de atingir limites.</p>
          </div>
        </ServiceSection>

        {/* ═══════ REGISTRO.BR ═══════ */}
        <ServiceSection
          icon={Globe}
          emoji="🌎"
          title="Domínio (Registro.br)"
          description="O endereço 'castingcerto.com.br' — é como o 'nome' do site na internet."
          color="bg-blue-500/15 text-blue-400"
        >
          <div className="space-y-0">
            <LimitRow
              label="Valor"
              value="~R$ 40/ano"
              tip="O domínio .com.br precisa ser renovado uma vez por ano."
            />
            <LimitRow
              label="Renovação"
              value="Anual (obrigatória)"
              tip="Se não renovar, outra pessoa pode registrar o domínio castingcerto.com.br."
            />
          </div>
          <div className="mt-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-xs text-cream/40 space-y-1">
            <p className="flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-yellow-400" />
              <strong className="text-yellow-400">IMPORTANTE</strong>
            </p>
            <p>Este é o <strong className="text-cream/60">único serviço pago</strong>. Fique atenta à data de vencimento no Registro.br para não perder o domínio!</p>
          </div>
        </ServiceSection>

      </div>

      {/* Resumo final */}
      <div className="mt-8 rounded-2xl border border-dark-700 bg-dark-900 p-6">
        <h2 className="text-lg font-bold text-cream mb-4">📋 Resumo dos serviços</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-700 text-cream/40">
                <th className="text-left py-2 pr-4 font-medium">Serviço</th>
                <th className="text-left py-2 pr-4 font-medium">Para que serve</th>
                <th className="text-left py-2 pr-4 font-medium">Plano</th>
                <th className="text-left py-2 font-medium">Custo</th>
              </tr>
            </thead>
            <tbody className="text-cream/60">
              <tr className="border-b border-dark-800">
                <td className="py-2.5 pr-4 font-medium text-cream/80">📸 Cloudinary</td>
                <td className="py-2.5 pr-4">Fotos dos promotores</td>
                <td className="py-2.5 pr-4">Gratuito</td>
                <td className="py-2.5"><span className="text-green-400 font-medium">R$ 0</span></td>
              </tr>
              <tr className="border-b border-dark-800">
                <td className="py-2.5 pr-4 font-medium text-cream/80">🌐 Vercel</td>
                <td className="py-2.5 pr-4">Hospedagem do site</td>
                <td className="py-2.5 pr-4">Hobby (gratuito)</td>
                <td className="py-2.5"><span className="text-green-400 font-medium">R$ 0</span></td>
              </tr>
              <tr className="border-b border-dark-800">
                <td className="py-2.5 pr-4 font-medium text-cream/80">🗄️ Neon</td>
                <td className="py-2.5 pr-4">Banco de dados</td>
                <td className="py-2.5 pr-4">Free Tier</td>
                <td className="py-2.5"><span className="text-green-400 font-medium">R$ 0</span></td>
              </tr>
              <tr className="border-b border-dark-800">
                <td className="py-2.5 pr-4 font-medium text-cream/80">📧 Cloudflare</td>
                <td className="py-2.5 pr-4">E-mail @castingcerto.com.br</td>
                <td className="py-2.5 pr-4">Gratuito</td>
                <td className="py-2.5"><span className="text-green-400 font-medium">R$ 0</span></td>
              </tr>
              <tr className="border-b border-dark-800">
                <td className="py-2.5 pr-4 font-medium text-cream/80">✉️ Gmail</td>
                <td className="py-2.5 pr-4">E-mail principal (recebe tudo)</td>
                <td className="py-2.5 pr-4">Gratuito</td>
                <td className="py-2.5"><span className="text-green-400 font-medium">R$ 0</span></td>
              </tr>
              <tr className="border-b border-dark-800">
                <td className="py-2.5 pr-4 font-medium text-cream/80">💻 GitHub</td>
                <td className="py-2.5 pr-4">Código-fonte</td>
                <td className="py-2.5 pr-4">Free</td>
                <td className="py-2.5"><span className="text-green-400 font-medium">R$ 0</span></td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-medium text-cream/80">🌎 Registro.br</td>
                <td className="py-2.5 pr-4">Domínio castingcerto.com.br</td>
                <td className="py-2.5 pr-4">Registro anual</td>
                <td className="py-2.5"><span className="text-yellow-400 font-medium">~R$ 40/ano</span></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 pt-4 border-t border-dark-700 flex items-center justify-between text-sm">
          <span className="text-cream/40">Custo total mensal</span>
          <span className="text-xl font-bold text-green-400">R$ 0,00 <span className="text-xs text-cream/30 font-normal">(+ R$40/ano do domínio)</span></span>
        </div>
      </div>
    </div>
  );
}
