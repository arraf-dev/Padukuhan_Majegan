import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * Satu instance PrismaClient dipakai bersama.
 *
 * Tanpa ini, hot-reload `next dev` bikin klien baru tiap perubahan berkas
 * sampai Neon menolak koneksi baru.
 *
 * ponytail: adapter `pg` biasa lewat connection string Neon yang *pooled* —
 * bukan @prisma/adapter-neon. Semua kueri kita jalan di runtime Node, jadi
 * driver serverless-nya tidak menambah apa pun selain satu dependensi lagi.
 */
const global_ = globalThis as unknown as { prisma?: PrismaClient };

function buatKlien() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL belum diset di environment");

  return new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
}

export const db = global_.prisma ?? buatKlien();

if (process.env.NODE_ENV !== "production") global_.prisma = db;
