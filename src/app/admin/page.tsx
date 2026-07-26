import Link from "next/link";
import { aksiCepatAdmin } from "@/content/majegan";
import { Hitung } from "@/components/gerak";
import { Ikon } from "@/components/ikon";
import { LencanaStatus } from "@/components/potongan";
import { db } from "@/lib/db";
import { tanggalLengkap } from "@/lib/tanggal";
import { keluar } from "@/app/admin/aksi";
import { Kerangka } from "@/app/admin/kerangka";
import { wajibMasuk } from "@/lib/sesi";

export default async function Dashboard() {
  const { nama, peran } = await wajibMasuk();
  const terbatas = peran === "admin";

  // ADM-8 — semua angka di bawah ini dihitung dari DB, bukan lagi dari
  // `ringkasanAdmin` di majegan.ts.
  const [terbit, draf, menunggu, diproses, terbaru] = await Promise.all([
    db.berita.count({ where: { status: "terbit" } }),
    db.berita.count({ where: { status: "draft" } }),
    db.pengaduan.count({ where: { status: "TERKIRIM" } }),
    db.pengaduan.count({ where: { status: "DIPROSES" } }),
    db.pengaduan.findMany({
      orderBy: { dibuatPada: "desc" },
      take: 5,
      select: { id: true, kodeTiket: true, isi: true, status: true },
    }),
  ]);

  const ringkasan = [
    { label: "BERITA TERBIT", angka: terbit, catatan: "tampil di halaman publik" },
    { label: "DRAF BERITA", angka: draf, catatan: "belum ditayangkan" },
    {
      label: "PENGADUAN BARU",
      angka: menunggu,
      catatan: diproses > 0 ? `${diproses} sedang diproses` : "belum ditinjau",
      sorot: true,
      bata: menunggu > 0,
    },
  ];

  return (
    <Kerangka peran={peran} nama={nama}>
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
            {tanggalLengkap(new Date())} ·{" "}
            {menunggu === 0 ? "tidak ada pengaduan baru" : `${menunggu} pengaduan menunggu tanggapan`}
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
        {ringkasan.map((r) => (
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
            <Link
              href="/admin/pengaduan"
              className="text-[12.5px] font-semibold text-daun hover:text-hutan"
            >
              semua →
            </Link>
          </div>

          {terbaru.length === 0 ? (
            <p className="py-6 text-center text-[13px] text-redup">Belum ada pengaduan masuk.</p>
          ) : (
            <ul className="flex flex-col">
              {terbaru.map((p, i) => (
                <li
                  key={p.id}
                  className={`flex flex-wrap items-center gap-x-3.5 gap-y-1.5 py-3.5 ${
                    i < terbaru.length - 1 ? "border-b border-dashed border-garis" : ""
                  }`}
                >
                  <Link
                    href={`/admin/pengaduan/${p.id}`}
                    className="flex-none font-mono text-[13px] font-bold text-hutan hover:underline"
                  >
                    {p.kodeTiket}
                  </Link>
                  <span className="min-w-40 flex-1 truncate text-[13px] text-teks">{p.isi}</span>
                  <LencanaStatus status={p.status} />
                </li>
              ))}
            </ul>
          )}
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
    </Kerangka>
  );
}
