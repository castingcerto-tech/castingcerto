import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const NEON_API_BASE = "https://console.neon.tech/api/v2";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const apiKey = process.env.NEON_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "NEON_API_KEY não configurada" }, { status: 500 });
  }

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    Accept: "application/json",
  };

  try {
    // Buscar projetos para obter branch_count e project_id
    const projectsRes = await fetch(`${NEON_API_BASE}/projects`, { headers });
    if (!projectsRes.ok) {
      const err = await projectsRes.text();
      console.error("Neon projects error:", projectsRes.status, err);
      throw new Error("Erro ao buscar projetos");
    }
    const projectsData = await projectsRes.json();
    const project = projectsData.projects?.[0];

    if (!project) {
      return NextResponse.json({ error: "Nenhum projeto encontrado" }, { status: 404 });
    }

    // Buscar consumo do período atual
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const from = startOfMonth.toISOString();
    const to = now.toISOString();

    const consumptionRes = await fetch(
      `${NEON_API_BASE}/consumption/projects?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&limit=10`,
      { headers }
    );

    let storageBytes = 0;
    let computeSeconds = 0;
    let transferBytes = 0;

    if (consumptionRes.ok) {
      const consumptionData = await consumptionRes.json();
      const projectConsumption = consumptionData.projects?.find(
        (p: { project_id: string }) => p.project_id === project.id
      ) ?? consumptionData.projects?.[0];

      if (projectConsumption) {
        storageBytes = projectConsumption.synthetic_storage_size ?? 0;
        computeSeconds = projectConsumption.compute_time_seconds ?? 0;
        transferBytes = projectConsumption.data_transfer_bytes ?? 0;
      }
    } else {
      console.error("Neon consumption error:", consumptionRes.status, await consumptionRes.text());
    }

    // Free tier limits
    const STORAGE_LIMIT = 0.5 * 1024 * 1024 * 1024; // 512 MB
    const COMPUTE_LIMIT_HOURS = 191.9;
    const TRANSFER_LIMIT = 5 * 1024 * 1024 * 1024; // 5 GB
    const BRANCHES_LIMIT = 10;

    return NextResponse.json({
      projectName: project.name ?? "—",
      storage: {
        used: storageBytes,
        limit: STORAGE_LIMIT,
      },
      compute: {
        used: computeSeconds / 3600, // em horas
        limit: COMPUTE_LIMIT_HOURS,
      },
      transfer: {
        used: transferBytes,
        limit: TRANSFER_LIMIT,
      },
      branches: {
        used: project.branch_count ?? 1,
        limit: BRANCHES_LIMIT,
      },
      lastUpdated: new Date().toISOString(),
    });
  } catch (error: unknown) {
    console.error("Erro ao buscar uso do Neon:", error);
    return NextResponse.json(
      { error: "Erro ao buscar dados do Neon" },
      { status: 500 }
    );
  }
}
