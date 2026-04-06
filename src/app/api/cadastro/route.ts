import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

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
    const cpf          = formData.get("cpf") as string;
    const whatsapp     = formData.get("whatsapp") as string;
    const fotoRosto    = formData.get("foto_rosto") as File | null;
    const fotoCorpo    = formData.get("foto_corpo") as File | null;

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

    // Log no servidor (em produção substituir por salvar no banco)
    console.log("=== NOVO CADASTRO ===");
    console.log("Nome:", nome);
    console.log("Email:", email);
    console.log("CPF:", cpf);
    console.log("WhatsApp:", whatsapp);
    console.log("Foto rosto:", urlRosto);
    console.log("Foto corpo:", urlCorpo);
    console.log("Dados completos:", dados);

    return NextResponse.json({
      success: true,
      message: "Cadastro recebido com sucesso!",
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
