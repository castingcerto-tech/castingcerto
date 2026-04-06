import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

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
        // MVP: aceita qualquer email/senha válidos
        // TODO: verificar contra banco de dados em produção
        if (!credentials?.email || !credentials?.password) return null;
        if (credentials.password.length < 8) return null;
        return {
          id:    credentials.email,
          email: credentials.email,
          name:  credentials.email.split("@")[0],
          image: null,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages:   { signIn: "/login" },
  callbacks: {
    async jwt({ token, account }) {
      if (account) token.provider = account.provider;
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.provider = token.provider as string;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
