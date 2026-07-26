import { loadEnvFile } from "node:process";
import { defineConfig, env } from "prisma/config";

// Prisma 7 tidak lagi memuat berkas .env sendiri, dan CLI-nya jalan di luar Next.
// `loadEnvFile` bawaan Node 24 — tanpa paket dotenv.
try {
  loadEnvFile(".env.local");
} catch {
  // Di Vercel variabelnya sudah ada di environment, berkasnya memang tidak ada.
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: { url: env("DATABASE_URL") },
  migrations: { seed: "node prisma/seed.ts" },
});
