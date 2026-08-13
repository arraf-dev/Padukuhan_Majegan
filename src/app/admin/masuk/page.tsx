import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { peranPengguna } from "@/content/majegan";
import { CentangBulat, Ikon, Logo } from "@/components/ikon";
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

          {galat && (
            <p
              role="alert"
              className="mb-5 w-full rounded-[10px] border border-bata/35 bg-bata/10 px-4 py-3 text-[12.5px] leading-relaxed text-bata"
            >
              Email atau kata sandi salah. Coba lagi, atau hubungi Pak Dukuh bila lupa sandi.
            </p>
          )}

          <form action={masuk} className="w-full">
            <label htmlFor="email" className={label}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="username"
              className={`${kotak} mb-3.5`}
              placeholder="nama@pandowoharjo.desa.id"
            />
            <label htmlFor="sandi" className={label}>
              Kata sandi
            </label>
            <input
              id="sandi"
              name="sandi"
              type="password"
              required
              autoComplete="current-password"
              className={kotak}
              placeholder="••••••••"
            />
            <button
              type="submit"
              className="mt-5 flex min-h-11 w-full items-center justify-center rounded-[10px] bg-hutan px-4 py-3.5 text-[14.5px] font-extrabold text-krem hover:bg-daun"
            >
              Masuk
            </button>
          </form>

          <p className="mt-4.5 rounded-[10px] border border-emas-garis bg-emas-muda px-4 py-3 text-xs leading-relaxed text-emas-teks">
            Warga <strong>tidak memerlukan akun</strong> — semua halaman publik terbuka dan
            pengaduan bisa dikirim tanpa login.
          </p>
        </div>
      </div>
    </div>
  );
}
