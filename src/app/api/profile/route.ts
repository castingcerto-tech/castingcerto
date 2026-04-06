import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { perfil: true },
    });

    if (!user?.perfil) {
      return NextResponse.json({ perfil: null, userStatus: user?.status ?? "PENDENTE" });
    }

    const p = user.perfil;
    return NextResponse.json({
      userStatus: user.status,         // PENDENTE | APROVADO | REPROVADO | CORRECAO | BLOQUEADO
      motivoReprovacao: user.motivoReprovacao ?? null,
      observacaoAdmin: user.observacaoAdmin ?? null,
      perfil: {
        nome_completo:     p.nomeCompleto     ?? "",
        cpf:               p.cpf              ?? "",
        rg:                p.rg               ?? "",
        data_nascimento:   p.dataNascimento
          ? p.dataNascimento.toISOString().split("T")[0]
          : "",
        genero:            p.genero           ?? "",
        etnia:             p.etnia            ?? "",
        whatsapp:          p.whatsapp         ?? "",
        instagram:         p.instagram        ?? "",
        cep:               p.cep              ?? "",
        endereco:          p.endereco         ?? "",
        numero:            p.numero           ?? "",
        bairro:            p.bairro           ?? "",
        cidade:            p.cidade           ?? "",
        estado:            p.estado           ?? "",
        altura:            p.altura           ?? "",
        peso:              p.peso             ?? "",
        manequim:          p.manequim         ?? "",
        tamanho_camiseta:  p.tamanhoCamiseta  ?? "",
        calcado:           p.calcado          ?? "",
        olhos:             p.olhos            ?? "",
        cabelo_tipo:       p.cabeloTipo       ?? "",
        cabelo_comprimento: p.cabeloComprimento ?? "",
        areas_interesse:   p.areasAtuacao
          ? p.areasAtuacao.split(",").filter(Boolean)
          : [],
        experiencia:       p.experiencia      ?? "",
        disponibilidade:   p.disponibilidade  ?? "",
        nivel_ingles:      p.nivelIngles      ?? "",
        nivel_espanhol:    p.nivelEspanhol    ?? "",
        tipo_chave_pix:    p.tipoChavePix     ?? "",
        chave_pix:         p.chavePix         ?? "",
        banco:             p.banco            ?? "",
        tipo_conta:        p.tipoConta        ?? "",
        agencia:           p.agencia          ?? "",
        conta:             p.conta            ?? "",
        foto_rosto_url:    p.fotoRosto        ?? "",
        foto_corpo_url:    p.fotoCorpo        ?? "",
      },
    });
  } catch (err) {
    console.error("[GET /api/profile]", err);
    return NextResponse.json({ error: "Erro interno ao buscar perfil." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const email = session.user.email;
    const body = await req.json();

    // Upsert user (cria se não existir)
    const user = await prisma.user.upsert({
      where:  { email },
      create: { email },
      update: {},
    });

    const dataNasc = body.data_nascimento
      ? new Date(body.data_nascimento + "T12:00:00Z")
      : null;

    const profileData = {
      nomeCompleto:      body.nome_completo      || null,
      cpf:               body.cpf               || null,
      rg:                body.rg                || null,
      dataNascimento:    dataNasc,
      genero:            body.genero            || null,
      etnia:             body.etnia             || null,
      whatsapp:          body.whatsapp          || null,
      instagram:         body.instagram         || null,
      cep:               body.cep               || null,
      endereco:          body.endereco          || null,
      numero:            body.numero            || null,
      bairro:            body.bairro            || null,
      cidade:            body.cidade            || null,
      estado:            body.estado            || null,
      altura:            body.altura            || null,
      peso:              body.peso              || null,
      manequim:          body.manequim          || null,
      tamanhoCamiseta:   body.tamanho_camiseta  || null,
      calcado:           body.calcado           || null,
      olhos:             body.olhos             || null,
      cabeloTipo:        body.cabelo_tipo       || null,
      cabeloComprimento: body.cabelo_comprimento || null,
      areasAtuacao:      Array.isArray(body.areas_interesse)
        ? body.areas_interesse.join(",")
        : (body.areas_interesse || null),
      experiencia:       body.experiencia       || null,
      disponibilidade:   body.disponibilidade   || null,
      nivelIngles:       body.nivel_ingles      || null,
      nivelEspanhol:     body.nivel_espanhol    || null,
      tipoChavePix:      body.tipo_chave_pix    || null,
      chavePix:          body.chave_pix         || null,
      banco:             body.banco             || null,
      tipoConta:         body.tipo_conta        || null,
      agencia:           body.agencia           || null,
      conta:             body.conta             || null,
      ...(body.foto_rosto_url ? { fotoRosto: body.foto_rosto_url } : {}),
      ...(body.foto_corpo_url ? { fotoCorpo: body.foto_corpo_url } : {}),
    };

    await prisma.userProfile.upsert({
      where:  { userId: user.id },
      create: { userId: user.id, ...profileData },
      update: profileData,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[PUT /api/profile]", err);
    return NextResponse.json({ error: "Erro ao salvar perfil. Verifique sua conexão e tente novamente." }, { status: 500 });
  }
}
