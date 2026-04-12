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
          <strong className="text-cream/80">O que é isso?</strong> O site da Casting Certo funciona usando vários serviços online gratuitos (como se fossem "ferramentas" que mantêm tudo rodando). Cada ferramenta tem um limite de uso. Nesta página você acompanha se está tudo tranquilo ou se está perto de algum limite. As barrinhas coloridas mostram:{" "}
          <strong className="text-green-400">Verde</strong> = tudo certo, pode ficar tranquila,{" "}
          <strong className="text-yellow-400">Amarelo</strong> = começando a usar bastante, atenção,{" "}
          <strong className="text-red-400">Vermelho</strong> = quase estourando o limite, precisa de ação.
        </div>
      </div>

      <div className="space-y-6">

        {/* ═══════ CLOUDINARY ═══════ */}
        <ServiceSection
          icon={Camera}
          emoji="📸"
          title="Armazenamento de Fotos (Cloudinary)"
          description="É o 'armário digital' onde ficam guardadas todas as fotos dos promotores (rosto e corpo inteiro). Quando alguém faz cadastro e envia foto, ela vai parar aqui."
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
                label="Espaço para fotos (quanto cabe no armário)"
                icon={HardDrive}
                used={cloudUsage.storage.used}
                limit={cloudUsage.storage.limit}
                formatFn={formatBytes}
              />
              <UsageBar
                label="Tráfego mensal (cada vez que alguém abre o site e vê uma foto, gasta um pouquinho)"
                icon={Wifi}
                used={cloudUsage.bandwidth.used}
                limit={cloudUsage.bandwidth.limit}
                formatFn={formatBytes}
              />
              <UsageBar
                label="Edições de imagem por mês (cortar, redimensionar — dificilmente vocês vão usar isso)"
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
            <p>As fotos que já estão no site continuam aparecendo normalmente. Mas se o espaço acabar, novos promotores não vão conseguir enviar fotos até sobrar espaço. Se o tráfego acabar, as fotos param de carregar até o mês seguinte (aí zera e volta ao normal).</p>
          </div>
        </ServiceSection>

        {/* ═══════ VERCEL ═══════ */}
        <ServiceSection
          icon={Server}
          emoji="🌐"
          title="Hospedagem do Site (Vercel)"
          description="É o lugar onde o site fica 'ligado' na internet. Sem isso, ninguém conseguiria acessar castingcerto.com.br. Pense como se fosse a energia elétrica da casa — se cortar, apaga tudo."
          color="bg-white/10 text-white"
        >
          <div className="space-y-0">
            <LimitRow
              label="Banda mensal (quantidade de dados que o site consegue enviar para quem acessa)"
              value="100 GB / mês"
              tip="Cada vez que alguém entra no site, gasta um pouquinho. 100 GB é MUITO — dá pra milhares de pessoas acessarem por mês sem problema."
            />
            <LimitRow
              label="Builds (cada vez que o programador atualiza o site, conta como 1 build)"
              value="6.000 minutos / mês"
              tip="É o tempo que a Vercel leva pra 'montar' o site depois de uma atualização. Cada atualização gasta uns 2 minutinhos. Dificilmente vocês vão se preocupar com isso."
            />
            <LimitRow
              label="Deploys por dia (quantas vezes o site pode ser atualizado por dia)"
              value="100 por dia"
              tip="Cada vez que o programador manda uma mudança pro site, conta como 1 deploy. 100 por dia é demais — relaxa com esse."
            />
            <LimitRow
              label="Tempo das ações do site (login, cadastro, aprovar promotor...)"
              value="Máximo 10 segundos cada"
              tip="Cada ação que alguém faz no site (como fazer login ou se cadastrar) precisa terminar em até 10 segundos. Na prática termina em menos de 2."
            />
            <LimitRow
              label="Otimização de imagens (o site ajusta fotos pra carregar mais rápido)"
              value="1.000 imagens / mês"
              tip="O site automaticamente deixa as fotos mais leves. 1.000 por mês é bastante."
            />
          </div>
          <div className="mt-4 p-3 rounded-lg bg-dark-800/50 text-xs text-cream/30 space-y-1">
            <p>💡 <strong className="text-cream/50">Risco de ultrapassar?</strong></p>
            <p>Muuuito baixo! A Vercel é super generosa no plano gratuito. Só precisaria pagar se o site ficasse famosão com milhares de acessos por dia. Pode ficar tranquila.</p>
          </div>
        </ServiceSection>

        {/* ═══════ NEON ═══════ */}
        <ServiceSection
          icon={Database}
          emoji="🗄️"
          title="Banco de Dados (Neon)"
          description="É tipo uma 'planilha gigante' onde ficam guardadas todas as informações: nomes, CPFs, telefones, e-mails, dados bancários, logins... Tudo que os promotores preenchem no cadastro vai parar aqui."
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
                label="Espaço para dados (quanto cabe na 'planilha')"
                icon={HardDrive}
                used={neonUsage.storage.used}
                limit={neonUsage.storage.limit}
                formatFn={formatBytes}
              />
              <UsageBar
                label="Horas de processamento — tempo que o banco fica 'pensando' quando alguém faz algo no site"
                icon={Database}
                used={neonUsage.compute.used}
                limit={neonUsage.compute.limit}
                formatFn={(n) => n.toFixed(1) + " horas"}
              />
              <UsageBar
                label="Transferência de dados — quantidade de informação trocada entre o site e o banco"
                icon={Wifi}
                used={neonUsage.transfer.used}
                limit={neonUsage.transfer.limit}
                formatFn={formatBytes}
              />
              <UsageBar
                label="Branches — são 'cópias' do banco usadas pra testes (vocês não vão usar, fica tranquila 😄)"
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
            <p>Se acabar as horas de processamento, o banco "dorme" — o site para de funcionar até o mês seguinte (quando zera e volta ao normal). Mas relaxa: o banco é esperto e "dorme sozinho" quando ninguém está usando, então economiza horas automaticamente. E o mais importante: <strong className="text-cream/50">os dados NUNCA são perdidos</strong>, mesmo que o banco pause.</p>
          </div>
        </ServiceSection>

        {/* ═══════ CLOUDFLARE ═══════ */}
        <ServiceSection
          icon={Mail}
          emoji="📧"
          title="E-mail Profissional (Cloudflare)"
          description="É o 'carteiro digital' que pega os e-mails enviados para @castingcerto.com.br e entrega direitinho na caixa de entrada do Gmail. Sem ele, o e-mail profissional não funcionaria."
          color="bg-orange-500/15 text-orange-400"
        >
          <div className="space-y-0">
            <LimitRow
              label="E-mails recebidos"
              value="Ilimitado ✨"
              tip="Pode receber e-mail à vontade em @castingcerto.com.br. Sem limite nenhum!"
            />
            <LimitRow
              label="Quantos endereços de e-mail podem criar"
              value="Até 200 endereços"
              tip="Dá pra criar vários e-mails tipo suporte@, contato@, jessica@, daniela@... até 200 diferentes. Mais que suficiente!"
            />
            <LimitRow
              label="Envio de e-mails por dia"
              value="500 por dia"
              tip="Máximo de e-mails que podem ser enviados por dia. Dificilmente vocês vão chegar perto disso no dia a dia."
            />
          </div>
          <div className="mt-4 p-3 rounded-lg bg-dark-800/50 text-xs text-cream/30 space-y-1">
            <p>💡 <strong className="text-cream/50">Preciso me preocupar?</strong></p>
            <p>Não mesmo! Receber é ilimitado e 500 envios por dia é mais do que qualquer empresa pequena precisa. Pode usar sem medo.</p>
          </div>
        </ServiceSection>

        {/* ═══════ GMAIL ═══════ */}
        <ServiceSection
          icon={Mail}
          emoji="✉️"
          title="E-mail Principal (Gmail)"
          description="É a caixa de entrada real onde vocês leem e respondem todos os e-mails. Quando alguém manda mensagem para suporte@castingcerto.com.br, cai aqui no Gmail."
          color="bg-red-500/15 text-red-400"
        >
          <div className="space-y-0">
            <LimitRow
              label="Espaço para guardar e-mails (inclui anexos como fotos e PDFs)"
              value="15 GB gratuitos"
              tip="Esse espaço é compartilhado com Google Drive e Google Fotos da mesma conta. 15 GB dá pra MUITA coisa."
            />
            <LimitRow
              label="Envio de e-mails por dia"
              value="500 por dia"
              tip="Dá pra mandar até 500 e-mails por dia. No dia a dia normal, vocês vão usar uns 10-20 no máximo."
            />
            <LimitRow
              label="Tamanho máximo de arquivo anexado"
              value="25 MB por e-mail"
              tip="Cada e-mail pode ter arquivos (fotos, PDFs, etc.) de até 25 MB. Se precisar mandar algo maior, use o Google Drive."
            />
          </div>
          <div className="mt-4 p-3 rounded-lg bg-dark-800/50 text-xs text-cream/30 space-y-1">
            <p>💡 <strong className="text-cream/50">Boa notícia</strong></p>
            <p>15 GB é bastante e 500 e-mails por dia é muito mais do que vocês vão precisar. Só fique de olho se a conta do Gmail começar a encher com muitos anexos pesados (aí é só apagar os antigos).</p>
          </div>
        </ServiceSection>

        {/* ═══════ GITHUB ═══════ */}
        <ServiceSection
          icon={Github}
          emoji="💻"
          title="Código-fonte (GitHub)"
          description="É onde fica guardado todo o 'código' do site (as instruções que fazem o site funcionar). Vocês não precisam mexer aqui — é só pro programador. Mas é bom saber que existe."
          color="bg-purple-500/15 text-purple-400"
        >
          <div className="space-y-0">
            <LimitRow
              label="Repositórios privados (cada projeto é um 'repositório')"
              value="Ilimitado ✨"
              tip="Podem ter quantos projetos privados quiser. O código do site fica privado, ninguém de fora consegue ver."
            />
            <LimitRow
              label="Colaboradores (pessoas com acesso ao código)"
              value="Ilimitado ✨"
              tip="Se um dia precisar de outro programador, pode dar acesso sem problema."
            />
            <LimitRow
              label="GitHub Actions (automações — vocês não usam isso, pode ignorar 😄)"
              value="2.000 minutos / mês"
              tip="É uma ferramenta pra programadores automatizarem tarefas. Não estamos usando, então não precisa se preocupar."
            />
            <LimitRow
              label="Armazenamento de pacotes (vocês não usam isso também 😄)"
              value="500 MB"
              tip="Serve pra guardar códigos compartilhados. Não estamos usando."
            />
          </div>
          <div className="mt-4 p-3 rounded-lg bg-dark-800/50 text-xs text-cream/30 space-y-1">
            <p>💡 <strong className="text-cream/50">Preciso me preocupar?</strong></p>
            <p>Zero preocupação! O GitHub é onde fica o código do site guardado em segurança. Vocês não vão precisar entrar lá nunca — isso é coisa do programador. Tá aqui só pra vocês saberem que existe.</p>
          </div>
        </ServiceSection>

        {/* ═══════ REGISTRO.BR ═══════ */}
        <ServiceSection
          icon={Globe}
          emoji="🌎"
          title="Domínio (Registro.br)"
          description="O domínio é o endereço do site: castingcerto.com.br. É como a 'placa' da loja na internet. Se não renovar, outra pessoa pode pegar esse nome."
          color="bg-blue-500/15 text-blue-400"
        >
          <div className="space-y-0">
            <LimitRow
              label="Valor"
              value="~R$ 40/ano"
              tip="Paga uma vez por ano, tipo uma 'assinatura' do nome do site. É baratinho."
            />
            <LimitRow
              label="Renovação"
              value="Todo ano (não pode esquecer!)"
              tip="Se passar da data e não renovar, o endereço castingcerto.com.br fica disponível. Alguém pode registrar no seu lugar!"
            />
          </div>
          <div className="mt-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-xs text-cream/40 space-y-1">
            <p className="flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-yellow-400" />
              <strong className="text-yellow-400">IMPORTANTE</strong>
            </p>
            <p>Este é o <strong className="text-cream/60">único serviço que precisa pagar</strong> (~R$ 40 por ano). Coloca um lembrete no celular pra não esquecer de renovar!</p>
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
