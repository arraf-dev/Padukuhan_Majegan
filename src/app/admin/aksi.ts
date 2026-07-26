"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { periksaKataSandi } from "@/lib/auth";
import { buatSesi, hapusSesi } from "@/lib/sesi";

/** AUTH-1 — dipasang langsung ke <form action={masuk}>. */
export async function masuk(data: FormData) {
  const email = String(data.get("email") ?? "").trim().toLowerCase();
  const sandi = String(data.get("sandi") ?? "");

  const pengguna = email && sandi ? await db.pengguna.findUnique({ where: { email } }) : null;

  // Pesan galat sama untuk email tidak dikenal maupun sandi salah — jangan
  // beri tahu penebak bahwa emailnya sudah benar.
  if (!pengguna || !pengguna.aktif || !periksaKataSandi(sandi, pengguna.sandiHash)) {
    redirect("/admin/masuk?galat=1");
  }

  await buatSesi({ id: pengguna.id, nama: pengguna.nama, peran: pengguna.peran });
  redirect("/admin");
}

export async function keluar() {
  await hapusSesi();
  redirect("/admin/masuk");
}
