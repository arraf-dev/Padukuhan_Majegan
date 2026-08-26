import Link from "next/link";
import { Hitung } from "@/components/gerak";
import { Ikon } from "@/components/ikon";
import { LencanaBaca } from "@/components/potongan";
import { KopHalaman, kartu, kartuPutus, tombol } from "@/components/primitif";
import { db } from "@/lib/db";
import { tanggalLengkap } from "@/lib/tanggal";
import { Kerangka } from "@/app/admin/kerangka";
import { wajibMasuk } from "@/lib/sesi";

const aksiCepatAdmin = [
  { label: "Perbarui profil padukuhan", href: "/admin/profil" },
  { label: "Kelola daftar layanan", href: "/admin/layanan" },
  { label: "Kelola akun admin", href: "/admin/akun" },
  { label: "Perbarui statistik penduduk", href: "/admin/statistik" },
];

export default async function Dashboard() {
  const { nama, peran } = await wajibMasuk();
  const terbatas = peran === "admin";

  // ADM-8 — semua angka di bawah ini dihitung dari DB, bukan lagi dari
  // `ringkasanAdmin` di majegan.ts.
  const [terbit, draf, belumDibaca, sudahDibaca, terbaru] = await Promise.all([
    db.berita.count({ where: { status: "terbit" } }),
    db.berita.count({ where: { status: "draft" } }),
    db.pengaduan.count({ where: { dibacaPada: null } }),
    db.pengaduan.count({ where: { dibacaPada: { not: null } } }),
    db.pengaduan.findMany({
      orderBy: { dibuatPada: "desc" },
      take: 5,
      select: { id: true, kategori: true, isi: true, dibacaPada: true },
    }),
  ]);

  const ringkasan = [
    { label: "BERITA TERBIT", angka: terbit, catatan: "tampil di halaman publik" },
    { label: "DRAF BERITA", angka: draf, catatan: "belum ditayangkan" },
    {
      label: "PENGADUAN BARU",
      angka: belumDibaca,
      catatan: `${sudahDibaca} sudah dibaca`,
      sorot: true,
      bata: belumDibaca > 0,
    },
  ];

  return (
    <Kerangka peran={peran} nama={nama}>
      {terbatas && (
        <p className="mb-5 flex items-center gap-2.5 rounded-xl border border-emas-garis bg-emas-muda px-4 py-3 text-[12.5px] text-emas-teks">
          <Ikon nama="gembok" ukuran={14} className="flex-none" />
          <span>
            Anda masuk sebagai <strong>Admin</strong>
            {" — akses terbatas ke modul Berita & Pengaduan. Modul lain dikelola SuperAdmin (Dukuh)."}
          </span>
        </p>
      )}

      <KopHalaman
        judul={`Selamat datang, ${nama}`}
        keterangan={`${tanggalLengkap(new Date())} · ${
          belumDibaca === 0 ? "semua pengaduan sudah dibaca" : `${belumDibaca} pengaduan belum dibaca`
        }`}
        aksi={
          <Link href="/admin/berita/baru" className={tombol("primer")}>
            <span className="text-base leading-none">+</span> Tulis Berita
          </Link>
        }
      />

      <dl className="mb-5 grid gap-4 md:grid-cols-3 lg:mb-6 lg:gap-5">
        {ringkasan.map((r) => (
          <div
            key={r.label}
            data-reveal
            className={`${kartu()} px-5 py-4.5 lg:px-7 lg:py-6 ${
              r.sorot ? "border-emas shadow-[0_3px_10px_rgba(214,180,92,.2)]" : ""
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
              className={`mt-1.5 font-serif text-[32px] font-bold lg:text-[38px] ${r.bata ? "text-bata" : "text-hutan"}`}
            >
              <Hitung ke={r.angka} />
            </dd>
            <p className="text-xs text-samar">{r.catatan}</p>
          </div>
        ))}
      </dl>

      <div
        className={`grid gap-4 lg:gap-6 ${
          terbatas ? "" : "md:grid-cols-[1.5fr_1fr] lg:grid-cols-[1.6fr_1fr]"
        }`}
      >
        <section data-reveal className={`${kartu()} min-w-0 px-6 py-5 lg:px-8 lg:py-7`}>
          <div className="mb-1.5 flex items-baseline justify-between">
            <h2 className="font-serif text-base font-semibold text-hutan lg:text-[19px]">Pengaduan terbaru</h2>
            <Link href="/admin/pengaduan" className={`${tombol("teks")} text-[12.5px]`}>
              semua →
            </Link>
          </div>

          {terbaru.length === 0 ? (
            <p className={`${kartuPutus} mt-2`}>Belum ada pengaduan masuk.</p>
          ) : (
            <ul className="flex flex-col">
              {terbaru.map((p, i) => (
                <li
                  key={p.id}
                  className={`flex flex-wrap items-center gap-x-3.5 gap-y-1.5 py-3.5 lg:py-4 ${
                    i < terbaru.length - 1 ? "border-b border-dashed border-garis" : ""
                  }`}
                >
                  <Link
                    href={`/admin/pengaduan/${p.id}`}
                    className="flex-none font-mono text-[13px] font-bold text-hutan transition-colors duration-200 ease-out hover:text-daun hover:underline"
                  >
                    {p.kategori}
                  </Link>
                  {/* basis penuh di layar sempit agar teks turun ke baris sendiri
                      dan `truncate` tidak memaksa grid melebar melewati viewport. */}
                  <span className="min-w-0 flex-1 basis-full truncate text-[13px] text-teks sm:basis-auto lg:text-sm">{p.isi}</span>
                  <LencanaBaca dibaca={p.dibacaPada !== null} />
                </li>
              ))}
            </ul>
          )}
        </section>

        {!terbatas && (
          <section data-reveal className={`${kartu()} min-w-0 px-6 py-5 lg:px-8 lg:py-7`}>
            <h2 className="mb-3 font-serif text-base font-semibold text-hutan lg:mb-4 lg:text-[19px]">Aksi cepat</h2>
            <div className="flex flex-col gap-2.5 lg:gap-3">
              {aksiCepatAdmin.map((a) => (
                <Link
                  key={a.href}
                  href={a.href}
                  className="flex items-center justify-between rounded-[10px] border border-garis px-4 py-3 text-[13.5px] font-semibold text-tinta transition-colors hover:border-daun hover:bg-emas-lembut lg:px-5 lg:py-3.5 lg:text-sm"
                >
                  {a.label} <span className="text-emas-tua">→</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

    </Kerangka>
  );
}
