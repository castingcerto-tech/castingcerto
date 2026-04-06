# Casting Certo Web

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Banco de Dados (Neon PostgreSQL)
DATABASE_URL="postgresql://usuario:senha@host/casting_certo?sslmode=require"

# JWT
JWT_SECRET="seu-segredo-jwt-longo-e-aleatorio"

# Google OAuth
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Asaas (Pagamentos)
ASAAS_API_KEY=""
ASAAS_BASE_URL="https://sandbox.asaas.com/api/v3"

# UploadThing (Upload de arquivos)
UPLOADTHING_SECRET=""
UPLOADTHING_APP_ID=""

# Email (Gmail SMTP)
EMAIL_FROM=""
EMAIL_PASSWORD=""
```

## Instalação e Dev

```bash
npm install
cp .env.example .env   # configure as variáveis
npx prisma db push     # sobe o schema no banco
npm run dev
```

## Estrutura

```
src/
  app/            → páginas Next.js (App Router)
  lib/            → utilitários (auth, prisma, email, etc.)
  components/     → componentes reutilizáveis
prisma/
  schema.prisma   → modelos do banco de dados
```
