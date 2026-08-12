"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { emailSah, hashKataSandi, periksaKataSandi, periksaSandiBaru } from "@/lib/auth";
import { db } from "@/lib/db";
import { wajibMasuk, wajibSuperadmin } from "@/lib/sesi";

const teks = (fd: FormData, nama: string) => String(fd.get(nama) ?? "").trim();

const kembali = (galat?: string) => `/admin/akun${galat ? `?galat=${galat}` : "?tersimpan=1"}`;

/**
 * Berapa superadmin aktif yang tersisa selain `kecuali`.
 *
 * Dipakai sebagai penjaga sebelum menonaktifkan, menurunkan peran, atau
 * menghapus akun: tanpa ini panel bisa terkunci permanen dan hanya bisa
 * dipulihkan lewat konsol database.
 */
async function superadminLain(kecuali: string) {
  return db.pengguna.count({
    where: { peran: "superadmin", aktif: true, id: { not: kecuali } },
  });
}

/** AUTH-3 — tambah admin baru. */
export async function tambahPengguna(data: FormData) {
  await wajibSuperadmin();

  const nama = teks(data, "nama");
  const email = teks(data, "email").toLowerCase();
  const jabatan = teks(data, "jabatan") || null;
  const sandi = String(data.get("sandi") ?? "");
  const peran = teks(data, "peran") === "superadmin" ? ("superadmin" as const) : ("admin" as const);

  if (!nama || !emailSah(email)) redirect(kembali("lengkapi"));
  if (periksaSandiBaru(sandi)) redirect(kembali("sandi-pendek"));

  const ada = await db.pengguna.findUnique({ where: { email }, select: { id: true } });
  if (ada) redirect(kembali("email-dipakai"));

  await db.pengguna.create({
    data: { nama, email, jabatan, peran, sandiHash: hashKataSandi(sandi) },
  });

  revalidatePath("/admin/akun");
  redirect(kembali());
}

/** AUTH-3 — ubah peran & status aktif akun yang sudah ada. */
export async function simpanPengguna(data: FormData) {
  const saya = await wajibSuperadmin();

  const id = teks(data, "id");
  const nama = teks(data, "nama");
  const jabatan = teks(data, "jabatan") || null;
  const peran = teks(data, "peran") === "superadmin" ? ("superadmin" as const) : ("admin" as const);
  const aktif = data.get("aktif") === "on";

  if (!id || !nama) redirect(kembali("lengkapi"));

  // Superadmin terakhir tidak boleh diturunkan perannya atau dinonaktifkan.
  const turun = peran !== "superadmin" || !aktif;
  if (turun && (await superadminLain(id)) === 0) redirect(kembali("superadmin-terakhir"));

  // Menonaktifkan diri sendiri berarti langsung terkunci di luar panel.
  if (id === saya.id && !aktif) redirect(kembali("diri-sendiri"));

  await db.pengguna.update({ where: { id }, data: { nama, jabatan, peran, aktif } });

  revalidatePath("/admin/akun");
  redirect(kembali());
}

/**
 * AUTH-3 — hapus akun.
 *
 * Akun yang pernah menulis berita dinonaktifkan saja, tidak dihapus: relasi
 * `penulis` memang `onDelete: SetNull` sehingga beritanya selamat, tapi nama
 * penulisnya ikut hilang dari arsip. `aktif: false` lebih jujur.
 */
export async function hapusPengguna(data: FormData) {
  const saya = await wajibSuperadmin();

  const id = teks(data, "id");
  if (!id) redirect("/admin/akun");
  if (id === saya.id) redirect(kembali("diri-sendiri"));
  if ((await superadminLain(id)) === 0) redirect(kembali("superadmin-terakhir"));

  const tulisan = await db.berita.count({ where: { penulisId: id } });
  if (tulisan > 0) {
    await db.pengguna.update({ where: { id }, data: { aktif: false } });
    revalidatePath("/admin/akun");
    redirect("/admin/akun?tersimpan=dinonaktifkan");
  }

  await db.pengguna.delete({ where: { id } });

  revalidatePath("/admin/akun");
  redirect("/admin/akun?terhapus=1");
}

/** AUTH-4 — ganti sandi sendiri. Terbuka untuk peran `admin` juga. */
export async function gantiSandi(data: FormData) {
  const saya = await wajibMasuk();

  const lama = String(data.get("lama") ?? "");
  const baru = String(data.get("baru") ?? "");
  const ulangi = String(data.get("ulangi") ?? "");

  const galat = periksaSandiBaru(baru);
  if (galat) redirect("/admin/akun?galat=sandi-pendek");
  if (baru !== ulangi) redirect("/admin/akun?galat=tidak-cocok");

  const akun = await db.pengguna.findUnique({
    where: { id: saya.id },
    select: { sandiHash: true },
  });
  if (!akun || !periksaKataSandi(lama, akun.sandiHash)) redirect("/admin/akun?galat=sandi-lama");

  await db.pengguna.update({ where: { id: saya.id }, data: { sandiHash: hashKataSandi(baru) } });

  revalidatePath("/admin/akun");
  redirect("/admin/akun?tersimpan=sandi-sendiri");
}

/** AUTH-3 — superadmin menyetel ulang sandi akun lain (lupa sandi). */
export async function setelSandi(data: FormData) {
  await wajibSuperadmin();

  const id = teks(data, "id");
  const sandi = String(data.get("sandi") ?? "");

  if (!id) redirect("/admin/akun");
  if (periksaSandiBaru(sandi)) redirect(kembali("sandi-pendek"));

  await db.pengguna.update({ where: { id }, data: { sandiHash: hashKataSandi(sandi) } });

  revalidatePath("/admin/akun");
  redirect("/admin/akun?tersimpan=sandi");
}
