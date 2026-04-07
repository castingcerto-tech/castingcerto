const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

async function main() {
  const prisma = new PrismaClient();
  
  const email = "admin@castingcerto.com.br";
  const password = "CastingCerto@2026";
  
  // Verifica se já existe
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("Admin já existe, atualizando role e senha...");
    const hash = await bcrypt.hash(password, 12);
    await prisma.user.update({
      where: { email },
      data: { passwordHash: hash, role: "ADMIN", status: "APROVADO" },
    });
    console.log("✅ Admin atualizado!");
  } else {
    const hash = await bcrypt.hash(password, 12);
    await prisma.user.create({
      data: {
        email,
        passwordHash: hash,
        role: "ADMIN",
        status: "APROVADO",
        perfil: { create: { nomeCompleto: "Administrador" } },
      },
    });
    console.log("✅ Admin criado com sucesso!");
  }
  
  console.log(`   Email: ${email}`);
  console.log(`   Senha: ${password}`);
  
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
