import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId:     process.env.GOOGLE_CLIENT_ID     ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "Credenciais",
      credentials: {
        email:    { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
          include: { perfil: { select: { nomeCompleto: true } } },
        });
        if (!user || !user.passwordHash) return null;

        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) return null;

        return {
          id:    user.id,
          email: user.email,
          name:  user.perfil?.nomeCompleto ?? user.email.split("@")[0],
          image: null,
          role:  user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 dias — sessão persiste mesmo fechando o navegador
  },
  pages:   { signIn: "/login" },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) token.provider = account.provider;
      if (user) token.role = (user as { role?: string }).role ?? "PROMOTOR";
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.provider = token.provider as string;
        session.user.role = (token.role as string) ?? "PROMOTOR";
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
