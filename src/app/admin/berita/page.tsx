import type { Metadata } from "next";
import Link from "next/link";
import { Ikon } from "@/components/ikon";
import { KopHalaman, kartu, kartuPutus, tombol } from "@/components/primitif";
import { db } from "@/lib/db";
import { wajibMasuk } from "@/lib/sesi";
import { tanggalPendekTahun } from "@/lib/tanggal";
import { Kerangka } from "@/app/admin/kerangka";
import { hapusBerita } from "@/app/admin/berita/aksi";

export const metadata: Metadata = { title: "Kelola Berita" };

const kabar: Record<string, string> = {
  terbit: "Berita ditayangkan — sudah tampil di halaman publik.",
  draft: "Tersimpan sebagai draf — belum tampil ke warga.",
  hapus: "Berita dihapus.",
};

export default async function KelolaBerita({
  searchParams,
}: {
  searchParams: Promise<{ tersimpan?: string; terhapus?: string; konfirmasi?: string }>;
}) {
  const { nama, peran } = await wajibMasuk();
  const { tersimpan, terhapus, konfirmasi } = await searchParams;

  const daftar = await db.berita.findMany({
    orderBy: [{ terbitPada: "desc" }, { dibuatPada: "desc" }],
    select: {
      id: true,
      judul: true,
      slug: true,
      status: true,
      terbitPada: true,
      dibuatPada: true,
      kategori: { select: { nama: true } },
    },
  });

  const pesan = terhapus ? kabar.hapus : tersimpan ? kabar[tersimpan] : undefined;

  return (
    <Kerangka peran={peran} nama={nama}>
      <KopHalaman
        judul="Kelola Berita"
        keterangan={`${daftar.length} berita · ${daftar.filter((b) => b.status === "draft").length} masih draf`}
        aksi={
          <Link href="/admin/berita/baru" className={tombol("primer")}>
            <span className="text-base leading-none">+</span> Tulis Berita
          </Link>
        }
      />

      {pesan && (
        <p
          role="status"
          className="mb-4 rounded-xl border border-emas-garis bg-emas-muda px-4 py-3 text-[13px] font-semibold text-emas-teks"
        >
          {pesan}
        </p>
      )}

      {daftar.length === 0 ? (
        <p className={kartuPutus}>
          Belum ada berita. Mulai dari tombol <strong>Tulis Berita</strong> di atas.
        </p>
      ) : (
        // Dua kolom mulai xl: barisnya pendek, satu kolom menyisakan ruang
        // kosong lebar. items-start agar kartu yang membuka konfirmasi hapus
        // tidak ikut meninggikan tetangganya.
        <ul className="flex flex-col gap-2.5 xl:grid xl:grid-cols-2 xl:items-start xl:gap-3">
          {daftar.map((b) => {
            const draf = b.status === "draft";
            const mintaHapus = konfirmasi === b.id;

            return (
              <li key={b.id} className={`${kartu()} px-4 py-3.5 md:px-5 lg:px-6 lg:py-4`}>
                <div className="flex flex-wrap items-center gap-x-3.5 gap-y-2">
                  <span
                    className={`flex-none rounded-full px-2.5 py-1 text-[11px] font-extrabold ${
                      draf ? "border-[1.5px] border-garis-tebal text-samar" : "bg-daun text-krem"
                    }`}
                  >
                    {draf ? "DRAF" : "TERBIT"}
                  </span>

                  <div className="min-w-48 flex-1">
                    <div className="text-[14px] font-semibold text-tinta">{b.judul}</div>
                    <div className="mt-0.5 text-[11.5px] text-samar">
                      {b.kategori.nama} · {tanggalPendekTahun((b.terbitPada ?? b.dibuatPada).toISOString())}
                    </div>
                  </div>

                  <div className="flex flex-none items-center gap-2">
                    {!draf && (
                      <Link
                        href={`/berita/${b.slug}`}
                        className={tombol("sekunder", "kecil")}
                      >
                        Lihat
                      </Link>
                    )}
                    <Link
                      href={`/admin/berita/${b.id}`}
                      className={`${tombol("sekunder", "kecil")} border-daun`}
                    >
                      <Ikon nama="berita" ukuran={13} />
                      Edit
                    </Link>
                    {/* Hapus dua langkah — tanpa dialog JS, panel konfirmasinya
                        muncul di baris ini juga. */}
                    <Link
                      href={mintaHapus ? "/admin/berita" : `/admin/berita?konfirmasi=${b.id}`}
                      className="rounded-[10px] px-3 py-2 text-xs font-semibold text-redup transition-colors duration-200 ease-out hover:text-bata"
                    >
                      {mintaHapus ? "Batal" : "Hapus"}
                    </Link>
                  </div>
                </div>

                {mintaHapus && (
                  <form
                    action={hapusBerita}
                    className="mt-3 flex flex-wrap items-center gap-3 rounded-xl border border-bata/35 bg-bata/10 px-4 py-3"
                  >
                    <input type="hidden" name="id" value={b.id} />
                    <span className="flex-1 text-[12.5px] leading-relaxed text-bata">
                      Hapus <strong>{b.judul}</strong> permanen? Tautan yang sudah tersebar akan
                      mati.
                    </span>
                    <button
                      type="submit"
                      className="min-h-10 flex-none rounded-[10px] bg-bata px-4 py-2 text-xs font-bold text-krem transition-opacity duration-200 ease-out hover:opacity-90"
                    >
                      Ya, hapus
                    </button>
                  </form>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </Kerangka>
  );
}
