import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

const config: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
      async profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          githubId: profile.id.toString(),
        };
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          await dbConnect();
          const user = await User.findOne({ email: credentials.email });
          if (!user) return null;
          if (user.isBanned) throw new Error("Account banned");
          const valid = bcrypt.compareSync(credentials.password, user.password);
          if (!valid) return null;
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.avatar,
            role: user.role,
            xp: user.xp,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/en/auth/signin",
    error: "/en/auth/signin",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "github") {
        try {
          await dbConnect();
          const existing = await User.findOne({
            $or: [
              { email: user.email },
              { githubId: (user as any).githubId },
            ]
          });
          if (!existing) {
            await User.create({
              name: user.name,
              email: user.email,
              avatar: user.image,
              githubId: (user as any).githubId,
              xp: 50, // welcome XP
            });
          } else {
            // Update avatar if changed
            await User.findByIdAndUpdate(existing._id, { avatar: user.image });
          }
        } catch (e) {
          console.error("GitHub signIn error:", e);
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
        (session.user as any).role = token.role;
        (session.user as any).xp = token.xp;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = (user as any).role;
        token.xp = (user as any).xp;
      }
      return token;
    },
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};

export const authOptions: NextAuthOptions = config;
