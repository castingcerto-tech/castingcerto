import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const usage = await cloudinary.api.usage();

    // Free plan limits
    const STORAGE_LIMIT_BYTES = 25 * 1024 * 1024 * 1024; // 25 GB
    const BANDWIDTH_LIMIT_BYTES = 25 * 1024 * 1024 * 1024; // 25 GB
    const TRANSFORMATIONS_LIMIT = 25000;

    return NextResponse.json({
      storage: {
        used: usage.storage?.usage ?? 0,
        limit: STORAGE_LIMIT_BYTES,
      },
      bandwidth: {
        used: usage.bandwidth?.usage ?? 0,
        limit: BANDWIDTH_LIMIT_BYTES,
      },
      transformations: {
        used: usage.transformations?.usage ?? 0,
        limit: TRANSFORMATIONS_LIMIT,
      },
      objects: usage.resources ?? 0,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error: unknown) {
    console.error("Erro ao buscar uso do Cloudinary:", error);
    return NextResponse.json(
      { error: "Erro ao buscar dados do Cloudinary" },
      { status: 500 }
    );
  }
}
