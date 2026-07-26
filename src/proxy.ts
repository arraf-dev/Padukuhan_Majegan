import { NextResponse, type NextRequest } from "next/server";

// Disalin, bukan diimpor dari `lib/sesi`: modul itu menarik `node:crypto` &
// `next/headers` yang tidak ada di runtime Edge.
const NAMA_COOKIE = "sesi_majegan";

/**
 * AUTH-2 — pagar depan panel admin. (Next 16 menamai berkas ini `proxy`,
 * pengganti `middleware` yang sudah usang.)
 *
 * ponytail: sengaja cuma memeriksa cookie-nya ada, tanpa verifikasi tanda tangan.
 * Berkas ini jalan di runtime Edge (tanpa `node:crypto`), dan menaruh keputusan
 * keamanan hanya di sini pernah jadi lubang di Next.js sendiri (CVE-2025-29927).
 * Verifikasi yang mengikat ada di `wajibMasuk()` — dipanggil tiap halaman admin,
 * yang memang butuh isi sesinya untuk render.
 */
export default function proxy(req: NextRequest) {
  if (req.cookies.has(NAMA_COOKIE)) return;

  const tujuan = new URL("/admin/masuk", req.url);
  return NextResponse.redirect(tujuan);
}

// Semua di bawah /admin kecuali halaman masuk itu sendiri.
export const config = { matcher: ["/admin", "/admin/((?!masuk).*)"] };
