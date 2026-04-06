import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || undefined;
  const q = searchParams.get("q") || undefined;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { role: "PROMOTOR" };
  if (status) where.status = status;

  if (q) {
    where.OR = [
      { email: { contains: q, mode: "insensitive" } },
      { perfil: { nomeCompleto: { contains: q, mode: "insensitive" } } },
      { perfil: { cidade: { contains: q, mode: "insensitive" } } },
    ];
  }

  const promotores = await prisma.user.findMany({
    where,
    include: {
      perfil: {
        select: {
          nomeCompleto: true,
          whatsapp: true,
          cidade: true,
          estado: true,
          fotoRosto: true,
        },
      },
    },
    orderBy: { criadoEm: "desc" },
    take: 100,
  });

  return NextResponse.json({
    promotores: promotores.map((u) => ({
      id: u.id,
      email: u.email,
      status: u.status,
      criadoEm: u.criadoEm.toISOString(),
      perfil: u.perfil,
    })),
  });
}
