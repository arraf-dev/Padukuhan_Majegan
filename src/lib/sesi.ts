import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { bacaToken, buatToken, type IsiSesi } from "./auth";

export const NAMA_COOKIE = "sesi_majegan";

/** 8 jam — sekali jam kerja; perangkat dusun tidak perlu sesi abadi. */
const UMUR_DETIK = 8 * 60 * 60;

function rahasia(): string {
  const r = process.env.RAHASIA_SESI;
  // Gagal keras: tanpa ini token bisa dipalsukan siapa saja.
  if (!r) throw new Error("RAHASIA_SESI belum diset di environment");
  return r;
}

export async function buatSesi(pengguna: Omit<IsiSesi, "exp">) {
  const token = buatToken({ ...pengguna, exp: Date.now() + UMUR_DETIK * 1000 }, rahasia());

  (await cookies()).set(NAMA_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: UMUR_DETIK,
  });
}

export async function hapusSesi() {
  (await cookies()).delete(NAMA_COOKIE);
}

export async function sesiSaatIni(): Promise<IsiSesi | null> {
  const token = (await cookies()).get(NAMA_COOKIE)?.value;
  return token ? bacaToken(token, rahasia()) : null;
}

/**
 * Verifikasi sesungguhnya (middleware hanya mengecek cookie ada atau tidak).
 * Panggil di setiap halaman & server action panel admin.
 */
export async function wajibMasuk(): Promise<IsiSesi> {
  const sesi = await sesiSaatIni();
  if (!sesi) redirect("/admin/masuk");
  return sesi;
}

/** Modul yang terkunci untuk peran `admin` pada matriks peran. */
export async function wajibSuperadmin(): Promise<IsiSesi> {
  const sesi = await wajibMasuk();
  if (sesi.peran !== "superadmin") redirect("/admin");
  return sesi;
}
