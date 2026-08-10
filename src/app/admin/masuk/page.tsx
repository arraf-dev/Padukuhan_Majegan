import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { peranPengguna } from "@/content/majegan";
import { CentangBulat, Ikon, Logo } from "@/components/ikon";
import { isianTebal, labelBorang } from "@/components/primitif";
import { masuk } from "@/app/admin/aksi";
import { sesiSaatIni } from "@/lib/sesi";

export const metadata: Metadata = { title: "Masuk" };

export default async function Masuk({
  searchParams,
}: {
  searchParams: Promise<{ galat?: string }>;
}) {
  if (await sesiSaatIni()) redirect("/admin");
  const { galat } = await searchParams;

  return (
    <div className="wadah flex flex-wrap items-start justify-center gap-9 px-4 py-8 md:px-12 md:py-12 lg:gap-12 lg:px-16 lg:py-16">
      <div className="w-full max-w-[430px] overflow-hidden rounded-xl border border-garis-tebal bg-krem shadow-[0_2px_14px_rgba(33,50,40,.10)] lg:max-w-[480px] lg:rounded-2xl">
        <div className="flex flex-col items-center px-6 py-8 md:px-8 lg:px-10 lg:py-10">
          <Logo ukuran={52} />
          <h1 className="mt-3.5 mb-1 font-serif text-xl font-semibold text-hutan md:text-2xl lg:text-[28px]">
            Masuk Panel Padukuhan
          </h1>
          <p className="mb-5 text-[12.5px] text-samar">Khusus SuperAdmin &amp; Admin</p>

          {galat && (
            <p
              role="alert"
              className="mb-5 w-full rounded-xl border border-bata/35 bg-bata/10 px-4 py-3 text-[12.5px] leading-relaxed text-bata"
            >
              Email atau kata sandi salah. Coba lagi, atau hubungi Pak Dukuh bila lupa sandi.
            </p>
          )}

          <form action={masuk} className="w-full">
            <label htmlFor="email" className={labelBorang}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="username"
              className={`${isianTebal} mb-3.5`}
              placeholder="nama@pandowoharjo.desa.id"
            />
            <label htmlFor="sandi" className={labelBorang}>
              Kata sandi
            </label>
            <input
              id="sandi"
              name="sandi"
              type="password"
              required
              autoComplete="current-password"
              className={isianTebal}
              placeholder="••••••••"
            />
            {/* Hijau, bukan ragam `primer` emas: tombol ini berdiri sendiri di
                kartu krem, dan hijau pekat memberi kontras paling tegas di sana. */}
            <button
              type="submit"
              className="mt-5 flex min-h-11 w-full items-center justify-center rounded-[10px] bg-hutan px-4 py-3.5 text-[14.5px] font-extrabold text-krem transition-colors duration-200 ease-out hover:bg-daun"
            >
              Masuk
            </button>
          </form>

          <p className="mt-4.5 rounded-xl border border-emas-garis bg-emas-muda px-4 py-3 text-xs leading-relaxed text-emas-teks">
            Warga <strong>tidak memerlukan akun</strong> — semua halaman publik terbuka dan
            pengaduan bisa dikirim tanpa login.
          </p>
        </div>
      </div>

      <section className="w-full max-w-[800px] rounded-xl border border-garis-tebal bg-kertas px-6 py-6 shadow-[0_2px_14px_rgba(33,50,40,.10)] md:px-8 lg:rounded-2xl lg:px-10 lg:py-9">
        <h2 className="mb-1 font-serif text-xl font-semibold text-hutan lg:text-[24px]">3 Peran Pengguna</h2>
        <p className="mb-5 text-[13px] text-redup lg:mb-7 lg:text-[14.5px]">
          Hanya SuperAdmin &amp; Admin yang punya akun; warga mengakses tanpa login.
        </p>
        <div className="grid gap-3.5 md:grid-cols-3 lg:gap-4.5">
          {peranPengguna.map((p) => (
            <div
              key={p.nama}
              className={`rounded-xl px-4.5 pt-4.5 pb-5 lg:px-5 lg:pt-5 lg:pb-6 ${
                // Sama persis dengan kartu tersorot di Dashboard — satu pola "ditekankan".
                p.sorot
                  ? "border border-emas shadow-[0_3px_10px_rgba(214,180,92,.2)]"
                  : "border border-garis"
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
