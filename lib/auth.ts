import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId:     process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email:    { label: "Email",    type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          await dbConnect();
          // Must explicitly select password (select: false in schema)
          const user = await User.findOne({ email: credentials.email.toLowerCase() }).select("+password");
          if (!user)              return null;
          if (user.isBanned)      throw new Error("Account suspended");
          if (!user.password)     return null; // OAuth-only account
          const valid = await bcrypt.compare(credentials.password, user.password);
          if (!valid) return null;
          return {
            id:    user._id.toString(),
            email: user.email,
            name:  user.name,
            image: user.avatar,
            role:  user.role,
            xp:    user.xp,
          };
        } catch {
          return null;
        }
      },
    }),
  ],

  pages: {
    signIn: "/en/auth/signin",
    error:  "/en/auth/signin",
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "github") {
        try {
          await dbConnect();
          const existing = await User.findOne({
            $or: [{ email: user.email }, { githubId: user.id }]
          });
          if (!existing) {
            await User.create({
              name:     user.name || "GitHub User",
              email:    user.email,
              avatar:   user.image,
              githubId: user.id,
              xp:       50,
            });
          } else {
            // Keep avatar fresh
            await User.findByIdAndUpdate(existing._id, { avatar: user.image, githubId: user.id });
          }
        } catch (e) {
          console.error("GitHub signIn error:", e);
        }
      }
      return true;
    },

    async session({ session, token }) {
      if (session.user && token) {
        (session.user as any).id   = token.sub;
        (session.user as any).role = token.role;
        (session.user as any).xp   = token.xp;
      }
      return session;
    },

    async jwt({ token, user, trigger, session: newSession }) {
      if (user) {
        token.sub  = user.id;
        token.role = (user as any).role;
        token.xp   = (user as any).xp;
      }
      // Allow client to update XP/role via useSession({ update }) 
      if (trigger === "update" && newSession) {
        if (newSession.xp   !== undefined) token.xp   = newSession.xp;
        if (newSession.role !== undefined) token.role = newSession.role;
      }
      return token;
    },
  },

  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 }, // 30 days
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
