import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: buscar dados completos de um promotor
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: { perfil: true },
  });

  if (!user) {
    return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
  }

  return NextResponse.json({
    id: user.id,
    email: user.email,
    status: user.status,
    role: user.role,
    motivoReprovacao: user.motivoReprovacao,
    observacaoAdmin: user.observacaoAdmin,
    dataReprovacao: user.dataReprovacao?.toISOString() ?? null,
    criadoEm: user.criadoEm.toISOString(),
    perfil: user.perfil
      ? {
          nomeCompleto: user.perfil.nomeCompleto,
          cpf: user.perfil.cpf,
          rg: user.perfil.rg,
          whatsapp: user.perfil.whatsapp,
          instagram: user.perfil.instagram,
          dataNascimento: user.perfil.dataNascimento?.toISOString().split("T")[0] ?? null,
          genero: user.perfil.genero,
          etnia: user.perfil.etnia,
          isPcd: user.perfil.isPcd,
          descricaoPcd: user.perfil.descricaoPcd,
          nacionalidade: user.perfil.nacionalidade,
          nivelIngles: user.perfil.nivelIngles,
          nivelEspanhol: user.perfil.nivelEspanhol,
          cep: user.perfil.cep,
          endereco: user.perfil.endereco,
          numero: user.perfil.numero,
          bairro: user.perfil.bairro,
          cidade: user.perfil.cidade,
          estado: user.perfil.estado,
          altura: user.perfil.altura,
          peso: user.perfil.peso,
          manequim: user.perfil.manequim,
          calcado: user.perfil.calcado,
          tamanhoCamiseta: user.perfil.tamanhoCamiseta,
          olhos: user.perfil.olhos,
          cabeloTipo: user.perfil.cabeloTipo,
          cabeloComprimento: user.perfil.cabeloComprimento,
          experiencia: user.perfil.experiencia,
          areasAtuacao: user.perfil.areasAtuacao,
          disponibilidade: user.perfil.disponibilidade,
          banco: user.perfil.banco,
          tipoConta: user.perfil.tipoConta,
          agencia: user.perfil.agencia,
          conta: user.perfil.conta,
          tipoChavePix: user.perfil.tipoChavePix,
          chavePix: user.perfil.chavePix,
          fotoRosto: user.perfil.fotoRosto,
          fotoCorpo: user.perfil.fotoCorpo,
        }
      : null,
  });
}

// PUT: aprovar ou reprovar promotor
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  const body = await req.json();
  const { action, motivos, descricao } = body;

  if (action === "aprovar") {
    await prisma.user.update({
      where: { id: params.id },
      data: {
        status: "APROVADO",
        motivoReprovacao: null,
        observacaoAdmin: null,
        dataReprovacao: null,
      },
    });

    // Busca email do promotor para notificação
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: { perfil: { select: { nomeCompleto: true } } },
    });

    // TODO: enviar e-mail real de aprovação
    console.log(`[APROVADO] ${user?.perfil?.nomeCompleto} (${user?.email})`);

    return NextResponse.json({ success: true, message: "Promotor aprovado!" });
  }

  if (action === "reprovar") {
    const motivoTexto = Array.isArray(motivos) ? motivos.join(", ") : (motivos ?? "");

    await prisma.user.update({
      where: { id: params.id },
      data: {
        status: "REPROVADO",
        motivoReprovacao: motivoTexto,
        observacaoAdmin: descricao || null,
        dataReprovacao: new Date(),
      },
    });

    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: { perfil: { select: { nomeCompleto: true } } },
    });

    // TODO: enviar e-mail real de reprovação com motivos
    console.log(`[REPROVADO] ${user?.perfil?.nomeCompleto} (${user?.email}) - Motivo: ${motivoTexto}. Obs: ${descricao}`);

    return NextResponse.json({ success: true, message: "Promotor reprovado." });
  }

  if (action === "correcao") {
    const motivoTexto = Array.isArray(motivos) ? motivos.join(", ") : (motivos ?? "");

    await prisma.user.update({
      where: { id: params.id },
      data: {
        status: "CORRECAO",
        motivoReprovacao: motivoTexto,
        observacaoAdmin: descricao || null,
      },
    });

    return NextResponse.json({ success: true, message: "Solicitação de correção enviada." });
  }

  return NextResponse.json({ error: "Ação inválida" }, { status: 400 });
}
