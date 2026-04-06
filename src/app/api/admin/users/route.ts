import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// POST: criar admin seed (só funciona se não existir nenhum admin)
// ou se o usuário logado já for ADMIN
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name, action, targetUserId } = body;

    const session = await getServerSession(authOptions);

    // Ação: promover/revogar role de um usuário existente (precisa ser admin)
    if (action === "set-role" && targetUserId) {
      if (!session?.user?.role || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
      }
      const newRole = body.role === "ADMIN" ? "ADMIN" : "PROMOTOR";
      await prisma.user.update({
        where: { id: targetUserId },
        data: { role: newRole },
      });
      return NextResponse.json({ success: true, message: `Role atualizado para ${newRole}` });
    }

    // Ação: criar novo admin
    if (action === "create-admin") {
      if (!session?.user?.role || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
      }
      if (!email || !password || password.length < 8) {
        return NextResponse.json({ error: "E-mail e senha obrigatórios (mínimo 8 caracteres)" }, { status: 400 });
      }
      const exists = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
      if (exists) {
        return NextResponse.json({ error: "Este e-mail já está cadastrado" }, { status: 409 });
      }
      const hash = await bcrypt.hash(password, 12);
      await prisma.user.create({
        data: {
          email: email.toLowerCase().trim(),
          passwordHash: hash,
          role: "ADMIN",
          status: "APROVADO",
          perfil: { create: { nomeCompleto: name || "Administrador" } },
        },
      });
      return NextResponse.json({ success: true, message: "Admin criado com sucesso" });
    }

    // Ação: seed — criar primeiro admin (só funciona se não existir nenhum)
    const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
    if (adminCount > 0) {
      return NextResponse.json({ error: "Já existe um admin. Use o painel para criar novos." }, { status: 403 });
    }

    if (!email || !password || password.length < 8) {
      return NextResponse.json({ error: "E-mail e senha obrigatórios (mínimo 8 caracteres)" }, { status: 400 });
    }

    const hash = await bcrypt.hash(password, 12);
    await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        passwordHash: hash,
        role: "ADMIN",
        status: "APROVADO",
        perfil: { create: { nomeCompleto: name || "Administrador" } },
      },
    });

    return NextResponse.json({ success: true, message: "Admin inicial criado com sucesso!" });
  } catch (err) {
    console.error("[POST /api/admin/users]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// GET: listar todos os usuários (precisa ser admin)
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    include: { perfil: { select: { nomeCompleto: true } } },
    orderBy: { criadoEm: "desc" },
    take: 200,
  });

  return NextResponse.json({
    users: users.map((u) => ({
      id: u.id,
      email: u.email,
      role: u.role,
      status: u.status,
      nome: u.perfil?.nomeCompleto ?? null,
      criadoEm: u.criadoEm.toISOString(),
    })),
  });
}
