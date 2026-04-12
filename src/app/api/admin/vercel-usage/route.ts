import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const VERCEL_API = "https://api.vercel.com";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const token = process.env.VERCEL_API_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "VERCEL_API_TOKEN não configurado" }, { status: 500 });
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  try {
    // Buscar deploys do mês atual
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const since = startOfMonth.getTime();

    const deploymentsRes = await fetch(
      `${VERCEL_API}/v6/deployments?limit=100&since=${since}&projectId=${process.env.VERCEL_PROJECT_ID || ""}`,
      { headers }
    );

    let deploymentsThisMonth = 0;
    let deploymentsToday = 0;

    if (deploymentsRes.ok) {
      const data = await deploymentsRes.json();
      const deployments = data.deployments ?? [];
      deploymentsThisMonth = deployments.length;

      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      deploymentsToday = deployments.filter(
        (d: { created: number }) => d.created >= startOfDay
      ).length;
    }

    // Tentar buscar projetos para pegar o nome
    let projectName = "castingcerto";
    const projectsRes = await fetch(`${VERCEL_API}/v9/projects?limit=5`, { headers });
    if (projectsRes.ok) {
      const pdata = await projectsRes.json();
      const proj = pdata.projects?.[0];
      if (proj?.name) projectName = proj.name;
    }

    // Free tier limits
    const BANDWIDTH_LIMIT = 100 * 1024 * 1024 * 1024; // 100 GB
    const BUILD_MINUTES_LIMIT = 6000;
    const DEPLOYS_PER_DAY_LIMIT = 100;
    const IMAGE_OPTIMIZATION_LIMIT = 1000;

    return NextResponse.json({
      projectName,
      deployments: {
        thisMonth: deploymentsThisMonth,
        today: deploymentsToday,
        dailyLimit: DEPLOYS_PER_DAY_LIMIT,
      },
      limits: {
        bandwidth: BANDWIDTH_LIMIT,
        buildMinutes: BUILD_MINUTES_LIMIT,
        imageOptimization: IMAGE_OPTIMIZATION_LIMIT,
      },
      lastUpdated: new Date().toISOString(),
    });
  } catch (error: unknown) {
    console.error("Erro ao buscar uso da Vercel:", error);
    return NextResponse.json(
      { error: "Erro ao buscar dados da Vercel" },
      { status: 500 }
    );
  }
}
