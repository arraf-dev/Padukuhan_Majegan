import type { Metadata } from "next";
import Link from "next/link";
import { peranPengguna } from "@/content/majegan";
import { CentangBulat, Ikon, Logo } from "@/components/ikon";

export const metadata: Metadata = { title: "Masuk" };

export default function Masuk() {
  const kotak =
    "w-full rounded-[9px] border-[1.5px] border-garis-tebal bg-kertas px-3.5 py-3 text-sm text-tinta placeholder:text-samar focus:border-daun";
  const label = "mb-1.5 block text-[12.5px] font-bold text-tinta";

  return (
    <div className="flex flex-wrap items-start justify-center gap-9 px-4 py-8 md:px-12 md:py-12">
      <div className="w-full max-w-[430px] overflow-hidden rounded-xl border border-[#D9D2BC] bg-krem shadow-[0_2px_14px_rgba(33,50,40,.10)]">
        <div className="flex flex-col items-center px-6 py-8 md:px-8.5">
          <Logo ukuran={52} />
          <h1 className="mt-3.5 mb-1 font-serif text-xl font-semibold text-hutan">
            Masuk Panel Padukuhan
          </h1>
          <p className="mb-5.5 text-[12.5px] text-samar">Khusus SuperAdmin &amp; Admin</p>

          {/* ponytail: autentikasi (AUTH-1/AUTH-2) belum terpasang — form ini
              belum memeriksa apa pun. Panel /admin masih terbuka; jangan isi
              data asli sebelum login jalan. */}
          <p
            role="note"
            className="mb-5 w-full rounded-[10px] border border-bata/35 bg-bata/10 px-4 py-3 text-[12px] leading-relaxed text-bata"
          >
            <strong>Login belum aktif.</strong> Panel admin masih terbuka tanpa kata sandi
            (AUTH-1/AUTH-2 menyusul) — jangan memuat data warga yang sebenarnya dulu.
          </p>

          <form className="w-full">
            <label htmlFor="pengguna" className={label}>
              Nama pengguna
            </label>
            <input
              id="pengguna"
              name="pengguna"
              autoComplete="username"
              className={`${kotak} mb-3.5`}
              placeholder="mis. rina.putri"
            />
            <label htmlFor="sandi" className={label}>
              Kata sandi
            </label>
            <input
              id="sandi"
              name="sandi"
              type="password"
              autoComplete="current-password"
              className={kotak}
              placeholder="••••••••"
            />
            <Link
              href="/admin"
              className="mt-5 flex min-h-11 items-center justify-center rounded-[10px] bg-hutan px-4 py-3.5 text-[14.5px] font-extrabold text-krem hover:bg-daun"
            >
              Masuk
            </Link>
          </form>

          <p className="mt-4.5 rounded-[10px] border border-emas-garis bg-emas-muda px-4 py-3 text-xs leading-relaxed text-emas-teks">
            Warga <strong>tidak memerlukan akun</strong> — semua halaman publik terbuka dan
            pengaduan bisa dikirim tanpa login.
          </p>
        </div>
      </div>

      <section className="w-full max-w-[800px] rounded-xl border border-[#D9D2BC] bg-kertas px-6 py-6 shadow-[0_2px_14px_rgba(33,50,40,.10)] md:px-7.5">
        <h2 className="mb-1 font-serif text-xl font-semibold text-hutan">3 Peran Pengguna</h2>
        <p className="mb-5 text-[13px] text-samar">
          Hanya SuperAdmin &amp; Admin yang punya akun; warga mengakses tanpa login.
        </p>
        <div className="grid gap-3.5 md:grid-cols-3">
          {peranPengguna.map((p) => (
            <div
              key={p.nama}
              className={`rounded-xl px-4.5 pt-4.5 pb-5 ${
                p.sorot ? "border-[1.5px] border-emas bg-[#FFFDF4]" : "border border-garis"
              }`}
            >
              <div
                className={`mb-1 text-[11px] font-extrabold tracking-[.1em] ${
                  p.sorot || p.tanda === "LOGIN" ? "text-emas-tua" : "text-redup"
                }`}
              >
                {p.tanda}
              </div>
              <div className="mb-3.5 font-serif text-[17px] font-semibold text-hutan">
                {p.nama}
                {p.catatan && (
                  <span className="ml-1.5 font-sans text-[11.5px] font-medium text-samar">
                    {p.catatan}
                  </span>
                )}
              </div>
              <ul className="flex flex-col gap-2.5 text-[12.5px] leading-snug">
                {p.hak.map((h) => (
                  <li
                    key={h.teks}
                    className={`flex gap-2 ${h.bisa ? "text-teks" : "text-pucat"}`}
                  >
                    {h.bisa ? (
                      <CentangBulat className="mt-px flex-none" />
                    ) : (
                      <Ikon nama="gembok" ukuran={15} className="mt-px flex-none" />
                    )}
                    {h.teks}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
