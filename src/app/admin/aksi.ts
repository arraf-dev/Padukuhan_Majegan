"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { emailSah, hashKataSandi, periksaKataSandi } from "@/lib/auth";
import { PANJANG_SANDI_MAKS } from "@/lib/auth";
import { bersihkanGagalMasuk, catatGagalMasuk, cobaMasukDiblokir } from "@/lib/limiter";
import { buatSesi, hapusSesi } from "@/lib/sesi";

// scrypt berjalan di setiap percobaan — termasuk email tak dikenal — supaya
// penebak tidak bisa memakai waktu respons untuk menebak email yang benar.
const HASH_PALSU = hashKataSandi("penjaga-waktu");

const kunciIp = (ip: string) => `ip:${ip}`;
const kunciAlamat = (email: string) => `alamat:${email.toLowerCase()}`;

/** AUTH-1 — dipasang langsung ke <form action={masuk}>. */
export async function masuk(data: FormData) {
  const email = String(data.get("email") ?? "").trim().toLowerCase();
  const sandi = String(data.get("sandi") ?? "");

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "lokal";

  // Jendela penalti seragam untuk IP dan alamat — dua-duanya dibatasi 10
  // percobaan gagal dalam 15 menit (lihat `lib/limiter.ts`).
  if (cobaMasukDiblokir(kunciIp(ip)) || cobaMasukDiblokir(kunciAlamat(email))) {
    redirect("/admin/masuk?galat=sering");
  }

  const bentukEmailSah = emailSah(email) && email.length <= 100;

  // Sandi raksasa bisa melambatkan scrypt; tolak sebelum menghitung hash.
  // Tetap habiskan satu verifikasi dummy agar jalurnya sama dengan sandi salah.
  const sandiWajar = sandi.length > 0 && sandi.length <= PANJANG_SANDI_MAKS;

  const pengguna = bentukEmailSah
    ? await db.pengguna.findUnique({ where: { email }, select: { id: true, nama: true, peran: true, aktif: true, sandiHash: true } })
    : null;

  // Pesan galat sama untuk email tidak dikenal maupun sandi salah — jangan
  // beri tahu penebak bahwa emailnya sudah benar.
  const sah =
    sandiWajar &&
    pengguna !== null &&
    pengguna.aktif &&
    periksaKataSandi(sandi, pengguna.sandiHash);

  if (!sah) {
    if (pengguna === null && sandiWajar) periksaKataSandi(sandi, HASH_PALSU);
    catatGagalMasuk(kunciIp(ip));
    catatGagalMasuk(kunciAlamat(email));
    redirect("/admin/masuk?galat=1");
  }

  bersihkanGagalMasuk(kunciIp(ip));
  bersihkanGagalMasuk(kunciAlamat(email));

  await buatSesi({ id: pengguna.id, nama: pengguna.nama, peran: pengguna.peran });
  redirect("/admin");
}

export async function keluar() {
  await hapusSesi();
  redirect("/admin/masuk");
}
