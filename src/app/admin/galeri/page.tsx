import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAdminAlbums } from "@/lib/galeri";
import { wajibMasuk } from "@/lib/sesi";
import { Kerangka } from "@/app/admin/kerangka";
import { KopHalaman, kartu, kartuPutus, tombol } from "@/components/primitif";
import { tanggalPendekTahun } from "@/lib/tanggal";
import { hapusAlbum, ubahStatusAlbum } from "@/app/admin/galeri/aksi";

export const metadata: Metadata = { title: "Kelola Galeri" };
export const dynamic = "force-dynamic";

export default async function KelolaGaleri({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; tersimpan?: string; terhapus?: string; galat?: string; berkas?: string; konfirmasi?: string }>;
}) {
  const { nama, peran } = await wajibMasuk();
  const { q, status, tersimpan, terhapus, galat, berkas, konfirmasi } = await searchParams;
  const semua = await getAdminAlbums();
  const cari = q?.trim().toLowerCase() ?? "";
  const daftar = semua.filter((album) => {
    const cocokCari = !cari || `${album.judul} ${album.deskripsi} ${album.kategori}`.toLowerCase().includes(cari);
    const cocokStatus = status === "draft" || status === "terbit" ? album.status === status : true;
    return cocokCari && cocokStatus;
  });
  const pesan = terhapus
    ? `Album dihapus${berkas ? "; sebagian file Blob perlu dibersihkan manual." : "."}`
    : tersimpan
      ? `Album tersimpan sebagai ${tersimpan === "terbit" ? "terbit" : "draft"}.`
      : galat === "foto"
        ? "Album harus memiliki minimal satu foto sebelum diterbitkan."
        : galat
          ? "Perubahan album belum dapat diproses."
          : undefined;

  return (
    <Kerangka peran={peran} nama={nama}>
      <KopHalaman
        judul="Kelola Galeri"
        keterangan={`${semua.length} album · ${semua.filter((album) => album.status === "draft").length} masih draft`}
        aksi={
          <Link href="/admin/galeri/baru" className={tombol("primer")}>
            <span className="text-base leading-none">+</span> Tambah Album
          </Link>
        }
      />

      {pesan && (
        <p role={galat ? "alert" : "status"} className={`mb-5 rounded-xl px-4 py-3 text-[13px] font-semibold ${galat ? "border border-bata/35 bg-bata/10 text-bata" : "border border-emas-garis bg-emas-muda text-emas-teks"}`}>
          {pesan}
        </p>
      )}

      <form className="mb-5 flex flex-col gap-2.5 sm:flex-row">
        <label htmlFor="cari-galeri" className="sr-only">Cari album</label>
        <input id="cari-galeri" name="q" defaultValue={q} placeholder="Cari judul, kategori, atau deskripsi…" className="min-h-11 min-w-0 flex-1 rounded-[10px] border border-garis bg-kertas px-3.5 text-[13.5px] text-tinta focus:border-daun focus:outline-none" />
        <label htmlFor="status-galeri" className="sr-only">Filter status</label>
        <select id="status-galeri" name="status" defaultValue={status ?? ""} className="min-h-11 rounded-[10px] border border-garis bg-kertas px-3.5 text-[13px] font-semibold text-teks">
          <option value="">Semua status</option>
          <option value="terbit">Terbit</option>
          <option value="draft">Draft</option>
        </select>
        <button type="submit" className={`${tombol("sekunder")} min-h-11`}>Cari</button>
      </form>

      {daftar.length === 0 ? (
        <p className={kartuPutus}>
          {cari || status ? "Album tidak ditemukan pada filter ini." : <>Belum ada album. Mulai dari tombol <strong>Tambah Album</strong> di atas.</>}
        </p>
      ) : (
        <ul className="flex flex-col gap-3 xl:grid xl:grid-cols-2 xl:items-start xl:gap-4">
          {daftar.map((album) => {
            const draft = album.status === "draft";
            return (
              <li key={album.id} className={`${kartu()} min-w-0 p-3.5 md:p-4`}>
                <div className="flex min-w-0 gap-3.5 md:gap-4">
                  <div className="relative size-24 flex-none overflow-hidden rounded-xl bg-foto sm:size-28">
                    {album.coverUrl ? (
                      <Image
                        src={album.coverUrl}
                        alt={`Sampul album ${album.judul}`}
                        fill
                        sizes="112px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="foto size-full" aria-hidden="true" />
                    )}
                    <span className="absolute right-1.5 bottom-1.5 rounded-full bg-hutan/90 px-2 py-1 text-[10px] font-bold text-krem">
                      {album.jumlahFoto} foto
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold ${draft ? "border border-garis-tebal text-samar" : "bg-daun text-krem"}`}>
                        {draft ? "DRAFT" : "TERBIT"}
                      </span>
                      <span className="text-[11px] font-semibold text-emas-tua">{album.kategori}</span>
                    </div>
                    <h2 className="mt-2 line-clamp-2 font-serif text-[17px] leading-snug font-semibold text-tinta">{album.judul}</h2>
                    <p className="mt-1 text-[11.5px] text-samar">{tanggalPendekTahun(album.tanggalKegiatan)}</p>
                    <p className="mt-2 line-clamp-2 text-[12px] leading-relaxed text-teks">{album.deskripsi}</p>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-garis pt-3">
                  {!draft && <Link href={`/galeri/${album.slug}`} className={tombol("sekunder", "kecil")}>Lihat</Link>}
                  <Link href={`/admin/galeri/${album.id}`} className={`${tombol("sekunder", "kecil")} border-daun`}>Sunting</Link>
                  <form action={ubahStatusAlbum}>
                    <input type="hidden" name="id" value={album.id} />
                    <input type="hidden" name="status" value={draft ? "terbit" : "draft"} />
                    <button type="submit" className="min-h-9 rounded-[10px] border border-garis-tebal px-3.5 text-[12px] font-semibold text-teks hover:border-daun hover:bg-emas-lembut">
                      {draft ? "Terbitkan" : "Jadikan Draft"}
                    </button>
                  </form>
                  <a
                    href={konfirmasi === album.id ? "/admin/galeri" : `/admin/galeri?konfirmasi=${album.id}`}
                    className="min-h-9 rounded-[10px] px-3 py-2 text-[12px] font-semibold text-redup hover:text-bata"
                  >
                    {konfirmasi === album.id ? "Batal" : "Hapus"}
                  </a>
                </div>
                {konfirmasi === album.id && (
                  <form action={hapusAlbum} className="mt-3 flex flex-wrap items-center gap-3 rounded-xl border border-bata/35 bg-bata/10 px-4 py-3">
                    <input type="hidden" name="id" value={album.id} />
                    <span className="flex-1 text-[12.5px] leading-relaxed text-bata">Hapus <strong>{album.judul}</strong> beserta seluruh fotonya?</span>
                    <button type="submit" className="min-h-10 rounded-[10px] bg-bata px-4 py-2 text-xs font-bold text-krem hover:opacity-90">Ya, hapus</button>
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
