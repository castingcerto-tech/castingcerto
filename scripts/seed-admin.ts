// Script para criar o primeiro admin
// Uso: npx ts-node --compiler-options '{"module":"commonjs"}' scripts/seed-admin.ts
// Ou simplesmente via API: POST /api/admin/users com body { email, password, name }

const ADMIN_EMAIL = "admin@castingcerto.com.br";
const ADMIN_PASSWORD = "CastingCerto@2026";
const ADMIN_NAME = "Administrador";

async function seed() {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  
  const res = await fetch(`${baseUrl}/api/admin/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      name: ADMIN_NAME,
    }),
  });

  const data = await res.json();
  
  if (res.ok) {
    console.log("✅ Admin criado com sucesso!");
    console.log(`   Email: ${ADMIN_EMAIL}`);
    console.log(`   Senha: ${ADMIN_PASSWORD}`);
  } else {
    console.log("❌ Erro:", data.error);
  }
}

seed().catch(console.error);
