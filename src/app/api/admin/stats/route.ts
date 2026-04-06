import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  // TODO: verificar role ADMIN no banco
  const [totalPromotores, pendentes, aprovados, reprovados, totalTrabalhos, totalClientes, totalOrcamentos] =
    await Promise.all([
      prisma.user.count({ where: { role: "PROMOTOR" } }),
      prisma.user.count({ where: { role: "PROMOTOR", status: "PENDENTE" } }),
      prisma.user.count({ where: { role: "PROMOTOR", status: "APROVADO" } }),
      prisma.user.count({ where: { role: "PROMOTOR", status: "REPROVADO" } }),
      prisma.job.count(),
      prisma.cliente.count(),
      prisma.orcamento.count(),
    ]);

  return NextResponse.json({
    totalPromotores,
    pendentes,
    aprovados,
    reprovados,
    totalTrabalhos,
    totalClientes,
    totalOrcamentos,
  });
}
