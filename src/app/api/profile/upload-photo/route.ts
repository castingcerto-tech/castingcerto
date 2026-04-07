import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
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
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { perfil: { select: { nomeCompleto: true } } },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    const formData = await req.formData();
    const tipo = formData.get("tipo") as string; // "rosto" ou "corpo"
    const file = formData.get("foto") as File | null;

    if (!file || !["rosto", "corpo"].includes(tipo)) {
      return NextResponse.json({ error: "Envie a foto e o tipo (rosto ou corpo)" }, { status: 400 });
    }

    // Validação de tipo de arquivo
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Formato inválido. Use JPG, PNG ou WebP." }, { status: 400 });
    }

    // Validação de tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "A foto deve ter no máximo 5 MB." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const slugNome = (user.perfil?.nomeCompleto ?? user.email)
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "_")
      .slice(0, 40);
    const timestamp = Date.now();
    const folder = "casting_certo/promotores";

    const url = await uploadToCloudinary(buffer, `${slugNome}_${timestamp}_${tipo}`, folder);

    // Atualiza o perfil com a nova URL
    const updateData = tipo === "rosto"
      ? { fotoRosto: url }
      : { fotoCorpo: url };

    await prisma.userProfile.update({
      where: { userId: user.id },
      data: updateData,
    });

    return NextResponse.json({ success: true, url });
  } catch (err) {
    console.error("[POST /api/profile/upload-photo]", err);
    return NextResponse.json({ error: "Erro ao enviar foto." }, { status: 500 });
  }
}
