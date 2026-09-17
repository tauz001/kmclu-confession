import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// Pre-hash the admin password for comparison
const getHashedPassword = async () => {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  return bcrypt.hash(password, 10);
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret:
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    "kmclu-confessions-secure-jwt-auth-secret-key-2024",
  trustHost: true,
  providers: [
    Credentials({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const identifier = (credentials?.email as string)?.trim();
        const password = credentials?.password as string;

        if (!identifier || !password) return null;

        // 1. Check Database for pre-stored Admin user
        try {
          const dbConnect = (await import("@/lib/mongodb")).default;
          await dbConnect();

          const Admin = (await import("@/models/Admin")).default;
          const lowerIdentifier = identifier.toLowerCase();

          const adminUser = await Admin.findOne({
            $or: [
              { username: lowerIdentifier },
              { email: lowerIdentifier },
            ],
          });

          if (adminUser) {
            const isMatch = await bcrypt.compare(password, adminUser.password);
            if (isMatch) {
              return {
                id: adminUser._id.toString(),
                name: adminUser.username,
                email: adminUser.email || `${adminUser.username}@kmclu.com`,
                role: adminUser.role || "ADMIN",
              };
            }
            // If password was wrong for this found user, reject
            return null;
          }
        } catch (dbErr) {
          console.warn("MongoDB auth lookup notice (falling back to env credentials):", dbErr);
        }

        // 2. Fallback to Environment Variables (if DB not yet seeded or configured)
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (adminEmail && adminPassword) {
          const isEmailMatch =
            identifier.toLowerCase() === adminEmail.toLowerCase() ||
            identifier.toLowerCase() === "admin";
          const isPasswordMatch = password === adminPassword;

          if (isEmailMatch && isPasswordMatch) {
            return {
              id: "admin-env",
              name: "Admin",
              email: adminEmail,
              role: "ADMIN",
            };
          }
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
});
