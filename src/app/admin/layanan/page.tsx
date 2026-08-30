import type { Metadata } from "next";
import Link from "next/link";
import { Ikon } from "@/components/ikon";
import { KopHalaman, kartu, kartuPutus, tombol } from "@/components/primitif";
import { Kerangka } from "@/app/admin/kerangka";
import { hapusLayanan } from "@/app/admin/layanan/aksi";
import { daftarLayananAdmin } from "@/lib/layanan";
import { wajibSuperadmin } from "@/lib/sesi";

export const metadata: Metadata = { title: "Kelola Layanan" };
export const dynamic = "force-dynamic";

const kabar: Record<string, string> = {
  baru: "Layanan baru tersimpan — sudah tampil di halaman /layanan.",
  sunting: "Perubahan layanan tersimpan.",
  hapus: "Layanan dihapus.",
  "galat-tidak-ditemukan": "Layanan tidak ditemukan — mungkin sudah dihapus dari sesi lain.",
};

export default async function KelolaLayanan({
  searchParams,
}: {
  searchParams: Promise<{ tersimpan?: string; terhapus?: string; konfirmasi?: string; q?: string; galat?: string }>;
}) {
  const { nama, peran } = await wajibSuperadmin();
  const { tersimpan, terhapus, konfirmasi, q, galat } = await searchParams;

  const semua = await daftarLayananAdmin();
  const cari = q?.trim().toLowerCase() ?? "";
  const daftar = cari ? semua.filter((l) => `${l.namaLayanan} ${l.deskripsi}`.toLowerCase().includes(cari)) : semua;
  const pesan = terhapus ? kabar.hapus : galat ? kabar[`galat-${galat}`] : tersimpan ? kabar[tersimpan] : undefined;

  return (
    <Kerangka peran={peran} nama={nama}>
      <KopHalaman
        judul="Kelola Layanan"
        keterangan={`${semua.length} layanan · urutan menentukan susunan di halaman publik`}
        aksi={
          <Link href="/admin/layanan/baru" className={tombol("primer")}>
            <span className="text-base leading-none">+</span> Layanan Baru
          </Link>
        }
      />

      {pesan && (
        <p
          role={galat ? "alert" : "status"}
          className={`mb-4 rounded-xl border px-4 py-3 text-[13px] font-semibold ${
            galat
              ? "border-bata/35 bg-bata/10 text-bata"
              : "border-emas-garis bg-emas-muda text-emas-teks"
          }`}
        >
          {pesan}
        </p>
      )}

      <form className="mb-4 flex gap-2.5 lg:mb-5">
        <label htmlFor="cari" className="sr-only">Cari layanan</label>
        <input id="cari" name="q" defaultValue={q} placeholder="Cari layanan…" className="min-h-11 flex-1 rounded-[10px] border border-garis bg-kertas px-3.5 text-[13.5px] text-tinta focus:border-daun focus:outline-none" />
        <button type="submit" className={tombol("sekunder")}>Cari</button>
      </form>

      {daftar.length === 0 ? (
        <p className={kartuPutus}>
          {cari ? <>Layanan dengan kata kunci <strong>“{q}”</strong> tidak ditemukan.</> : <>Belum ada layanan. Mulai dari tombol <strong>Layanan Baru</strong> di atas.</>}
        </p>
      ) : (
        // Dua kolom mulai xl — sama alasannya dengan daftar berita.
        <ul className="flex flex-col gap-2.5 xl:grid xl:grid-cols-2 xl:items-start xl:gap-3">
          {daftar.map((l) => {
            const mintaHapus = konfirmasi === l.id;

            return (
              <li key={l.id} className={`${kartu()} px-4 py-3.5 md:px-5 lg:px-6 lg:py-4`}>
                <div className="flex flex-wrap items-center gap-x-3.5 gap-y-2">
                  <span className="flex size-7 flex-none items-center justify-center rounded-full bg-panel text-[11.5px] font-extrabold text-samar">
                    {l.urutan}
                  </span>

                  <div className="min-w-48 flex-1">
                    <div className="text-[14px] font-semibold text-tinta">{l.namaLayanan}</div>
                    <div className="mt-0.5 text-[11.5px] text-samar">
                      {l.persyaratan.length} syarat · {l.biaya}
                      {l.fileTemplat && " · templat tersedia"}
                    </div>
                  </div>

                  <div className="flex flex-none items-center gap-2">
                    <Link
                      href={`/layanan/${l.slug}`}
                      className={tombol("sekunder", "kecil")}
                    >
                      Lihat
                    </Link>
                    <Link
                      href={`/admin/layanan/${l.id}`}
                      className={`${tombol("sekunder", "kecil")} border-daun`}
                    >
                      <Ikon nama="surat" ukuran={13} />
                      Edit
                    </Link>
                    <Link
                      href={mintaHapus ? "/admin/layanan" : `/admin/layanan?konfirmasi=${l.id}`}
                      className="rounded-[10px] px-3 py-2 text-xs font-semibold text-redup transition-colors duration-200 ease-out hover:text-bata"
                    >
                      {mintaHapus ? "Batal" : "Hapus"}
                    </Link>
                  </div>
                </div>

                {mintaHapus && (
                  <form
                    action={hapusLayanan}
                    className="mt-3 flex flex-wrap items-center gap-3 rounded-xl border border-bata/35 bg-bata/10 px-4 py-3"
                  >
                    <input type="hidden" name="id" value={l.id} />
                    <span className="flex-1 text-[12.5px] leading-relaxed text-bata">
                      Hapus <strong>{l.namaLayanan}</strong>? Halaman{" "}
                      <code>/layanan/{l.slug}</code> akan menjadi 404.
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
