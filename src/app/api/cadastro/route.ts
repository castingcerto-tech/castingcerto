import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadToCloudinary(
  buffer: Buffer,
  filename: string,
  folder: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: filename,
        resource_type: "image",
        transformation: [{ quality: "auto", fetch_format: "auto" }],
      },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const nome         = formData.get("nome_completo") as string;
    const email        = formData.get("email") as string;
    const password     = formData.get("password") as string;
    const cpf          = formData.get("cpf") as string;
    const whatsapp     = formData.get("whatsapp") as string;
    const fotoRosto    = formData.get("foto_rosto") as File | null;
    const fotoCorpo    = formData.get("foto_corpo") as File | null;

    if (!email || !password || password.length < 8) {
      return NextResponse.json({ error: "E-mail e senha são obrigatórios (mínimo 8 caracteres)." }, { status: 400 });
    }

    // Verifica se já existe
    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (existing) {
      return NextResponse.json({ error: "Este e-mail já está cadastrado." }, { status: 409 });
    }

    if (!fotoRosto || !fotoCorpo) {
      return NextResponse.json(
        { error: "As duas fotos são obrigatórias." },
        { status: 400 }
      );
    }

    // Sanitiza o nome para usar no public_id
    const slugNome = (nome || "promotor")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "_")
      .slice(0, 40);
    const timestamp = Date.now();
    const folder = `casting_certo/promotores`;

    // Converte File → Buffer
    const [rostoBuffer, corpoBuffer] = await Promise.all([
      fotoRosto.arrayBuffer().then((ab) => Buffer.from(ab)),
      fotoCorpo.arrayBuffer().then((ab) => Buffer.from(ab)),
    ]);

    // Faz upload em paralelo
    const [urlRosto, urlCorpo] = await Promise.all([
      uploadToCloudinary(rostoBuffer, `${slugNome}_${timestamp}_rosto`, folder),
      uploadToCloudinary(corpoBuffer, `${slugNome}_${timestamp}_corpo`, folder),
    ]);

    // Monta objeto com todos os campos do formulário
    const dados: Record<string, string> = {};
    formData.forEach((value, key) => {
      if (key !== "foto_rosto" && key !== "foto_corpo" && key !== "password" && key !== "confirm_password") {
        dados[key] = value.toString();
      }
    });

    // Salva no banco de dados
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        passwordHash,
        role: "PROMOTOR",
        status: "PENDENTE",
        perfil: {
          create: {
            nomeCompleto:     nome || null,
            cpf:              cpf || null,
            whatsapp:         whatsapp || null,
            dataNascimento:   dados.data_nascimento ? new Date(dados.data_nascimento) : null,
            genero:           dados.genero || null,
            etnia:            dados.etnia || null,
            instagram:        dados.instagram || null,
            cep:              dados.cep || null,
            endereco:         dados.endereco || null,
            numero:           dados.numero || null,
            bairro:           dados.bairro || null,
            cidade:           dados.cidade || null,
            estado:           dados.estado || null,
            altura:           dados.altura || null,
            peso:             dados.peso || null,
            manequim:         dados.manequim || null,
            tamanhoCamiseta:  dados.tamanho_camiseta || null,
            calcado:          dados.calcado || null,
            olhos:            dados.olhos || null,
            cabeloTipo:       dados.cabelo_tipo || null,
            cabeloComprimento: dados.cabelo_comprimento || null,
            experiencia:      dados.experiencia || null,
            areasAtuacao:     dados.areas_interesse || null,
            disponibilidade:  dados.disponibilidade || null,
            nivelIngles:      dados.nivel_ingles || null,
            nivelEspanhol:    dados.nivel_espanhol || null,
            fotoRosto:        urlRosto,
            fotoCorpo:        urlCorpo,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Cadastro recebido com sucesso!",
      userId: user.id,
      fotos: { rosto: urlRosto, corpo: urlCorpo },
    });
  } catch (err) {
    console.error("Erro no cadastro:", err);
    return NextResponse.json(
      { error: "Erro interno. Tente novamente." },
      { status: 500 }
    );
  }
}
