import "dotenv/config";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";
import { user, session, account, verification } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const seedAuth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user, session, account, verification },
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 1,
  },
  secret: process.env.BETTER_AUTH_SECRET || "seed-secret",
});

async function seed() {
  const existing = await db.select().from(user).where(eq(user.email, "admin@example.com"));

  if (existing.length > 0) {
    console.log("✅ Пользователь admin@example.com уже существует");
    return;
  }

  const result = await seedAuth.api.signUpEmail({
    body: {
      email: "admin@example.com",
      password: "admin",
      name: "Admin",
    },
  });

  console.log("✅ Создан тестовый пользователь:");
  console.log("   Email: admin@example.com");
  console.log("   Пароль: admin");
  console.log("   ID:", (result as { user?: { id: string } }).user?.id);
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Ошибка при создании пользователя:", err);
    process.exit(1);
  });
