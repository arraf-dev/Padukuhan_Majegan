import Link from "next/link";
import {
  aksiCepatAdmin,
  pengaduanTerbaru,
  ringkasanAdmin,
  type StatusPengaduan,
} from "@/content/majegan";
import { Hitung } from "@/components/gerak";
import { Ikon } from "@/components/ikon";
import { MenuAtas, Sidebar } from "@/components/panel";
import { tanggalLengkap } from "@/lib/tanggal";
import { keluar } from "@/app/admin/aksi";
import { wajibMasuk } from "@/lib/sesi";

const warnaStatus: Record<StatusPengaduan, string> = {
  TERKIRIM: "border-[1.5px] border-garis-tebal text-teks",
  DIPROSES: "bg-emas text-hutan",
  SELESAI: "bg-daun text-krem",
};

export default async function Dashboard() {
  const { nama, peran } = await wajibMasuk();
  const terbatas = peran === "admin";

  return (
    <div className="md:grid md:min-h-screen md:grid-cols-[230px_1fr]">
      <Sidebar peran={peran} nama={nama} />
      <MenuAtas peran={peran} />

      <div className="px-4 py-6 md:px-8.5 md:pt-7 md:pb-8.5">
        {terbatas && (
          <p className="mb-5 flex items-center gap-2.5 rounded-[10px] border border-emas-garis bg-emas-muda px-4 py-2.5 text-[12.5px] text-emas-teks">
            <Ikon nama="gembok" ukuran={14} className="flex-none" />
            <span>
              Anda masuk sebagai <strong>Admin</strong>
              {" — akses terbatas ke modul Berita & Pengaduan. Modul lain dikelola SuperAdmin (Dukuh)."}
            </span>
          </p>
        )}

        <div className="mb-5 flex flex-wrap items-center gap-4">
          <div>
            <h1 className="font-serif text-xl font-semibold text-hutan md:text-2xl">
              Selamat datang, {nama}
            </h1>
            <p className="mt-1 text-[12.5px] text-samar">
              {tanggalLengkap(new Date())} · 3 pengaduan menunggu tanggapan
            </p>
          </div>
          <span className="flex-1" />
          <Link
            href="/admin/berita/baru"
            className="inline-flex min-h-11 items-center gap-2 rounded-[9px] bg-hutan px-4.5 py-2.5 text-[13.5px] font-bold text-krem hover:bg-daun"
          >
            <span className="text-base leading-none">+</span> Tulis Berita
          </Link>
        </div>

        <dl className="mb-5 grid gap-4 md:grid-cols-3">
          {ringkasanAdmin[peran].map((r) => (
            <div
              key={r.label}
              data-reveal
              className={`rounded-xl bg-kertas px-5 py-4.5 ${
                r.sorot
                  ? "border-[1.5px] border-emas shadow-[0_3px_10px_rgba(214,180,92,.2)]"
                  : "border border-garis"
              }`}
            >
              <dt
                className={`text-[11.5px] font-bold tracking-[.08em] ${
                  r.sorot ? "text-emas-tua" : "text-redup"
                }`}
              >
                {r.label}
              </dt>
              <dd
                className={`mt-1.5 font-serif text-[32px] font-bold ${r.bata ? "text-bata" : "text-hutan"}`}
              >
                <Hitung ke={r.angka} />
              </dd>
              <p className="text-xs text-samar">{r.catatan}</p>
            </div>
          ))}
        </dl>

        <div className={`grid gap-4 ${terbatas ? "" : "md:grid-cols-[1.5fr_1fr]"}`}>
          <section data-reveal className="rounded-xl border border-garis bg-kertas px-5.5 py-5">
            <div className="mb-1.5 flex items-baseline justify-between">
              <h2 className="font-serif text-base font-semibold text-hutan">Pengaduan terbaru</h2>
              {/* ponytail: daftar penuh menunggu modul pengaduan admin (ADM-4). */}
              <span className="text-[12.5px] font-semibold text-samar">semua →</span>
            </div>
            <ul className="flex flex-col">
              {pengaduanTerbaru.map((p, i) => (
                <li
                  key={p.kode}
                  className={`flex flex-wrap items-center gap-x-3.5 gap-y-1.5 py-3.5 ${
                    i < pengaduanTerbaru.length - 1 ? "border-b border-dashed border-garis" : ""
                  }`}
                >
                  <span className="flex-none font-mono text-[13px] font-bold text-hutan">
                    {p.kode}
                  </span>
                  <span className="min-w-40 flex-1 truncate text-[13px] text-teks">{p.isi}</span>
                  {terbatas && p.status === "TERKIRIM" ? (
                    <span className="flex-none rounded-lg border-[1.5px] border-daun px-3 py-1.5 text-xs font-bold text-hutan/60">
                      Tanggapi
                    </span>
                  ) : (
                    <span
                      className={`flex-none rounded-full px-2.5 py-1 text-[11px] font-extrabold ${warnaStatus[p.status]}`}
                    >
                      {p.status}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </section>

          {!terbatas && (
            <section data-reveal className="rounded-xl border border-garis bg-kertas px-5.5 py-5">
              <h2 className="mb-3 font-serif text-base font-semibold text-hutan">Aksi cepat</h2>
              <div className="flex flex-col gap-2.5">
                {aksiCepatAdmin.map((a) => (
                  // ponytail: modul tujuan belum dibangun — tautan menunggu Minggu 2–4.
                  <span
                    key={a}
                    className="flex items-center justify-between rounded-[9px] border border-garis px-4 py-3 text-[13.5px] font-semibold text-tinta"
                  >
                    {a} <span className="text-emas-tua">→</span>
                  </span>
                ))}
              </div>
              <p className="mt-3.5 rounded-[10px] border border-emas-garis bg-emas-muda px-3.5 py-3 text-xs leading-relaxed text-emas-teks">
                Draft berita tersimpan otomatis — aman meski koneksi terputus.
              </p>
            </section>
          )}
        </div>

        <form action={keluar} className="mt-6">
          <button
            type="submit"
            className="min-h-11 rounded-[9px] border border-garis px-4 py-2.5 text-[13px] font-semibold text-tinta hover:border-bata hover:text-bata"
          >
            Keluar dari panel
          </button>
        </form>
      </div>
    </div>
  );
}
