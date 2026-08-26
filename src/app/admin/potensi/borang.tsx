import Link from "next/link";
import { IsianBerkas } from "@/components/isian-berkas";
import { isian, label, tombol } from "@/components/primitif";
import { simpanPotensi } from "@/app/admin/potensi/aksi";
import type { PotensiItem } from "@/lib/potensi";

type KategoriPilihan = { id: string; kode: string; label: string };
type AlbumPilihan = {
  id: string;
  judul: string;
  status: string;
  potensiId: string | null;
  _count: { foto: number };
};

const pesanGalat: Record<string, string> = {
  isi: "Judul, ringkasan, dan deskripsi wajib diisi dengan format yang valid.",
  kategori: "Kategori Potensi tidak valid.",
  berkas: "Gambar harus berformat JPG, PNG, atau WEBP dengan ukuran maksimal 4 MB.",
  album: "Album dokumentasi sudah dipakai Potensi lain atau tidak ditemukan.",
  "tidak-ditemukan": "Data Potensi tidak ditemukan.",
};

export function BorangPotensi({
  awal,
  kategori,
  albumOptions,
  galat,
}: {
  awal?: PotensiItem;
  kategori: KategoriPilihan[];
  albumOptions: AlbumPilihan[];
  galat?: string;
}) {
  return (
    <form action={simpanPotensi} className="flex max-w-4xl flex-col gap-4 lg:gap-5">
      {awal && <input type="hidden" name="id" value={awal.id} />}
      {awal?.gambarUrl && <input type="hidden" name="gambarUrl" value={awal.gambarUrl} />}

      {galat && (
        <p role="alert" className="rounded-xl border border-bata/35 bg-bata/10 px-4 py-3 text-[13px] font-semibold text-bata">
          {pesanGalat[galat] ?? "Perubahan Potensi belum dapat diproses."}
        </p>
      )}

      <fieldset className="rounded-xl border border-garis bg-kertas p-4 lg:p-6">
        <legend className="px-1 text-[11px] font-bold tracking-[.1em] text-emas-tua">INFORMASI POTENSI</legend>

        <div>
          <label className={label} htmlFor="judul">JUDUL / NAMA USAHA</label>
          <input id="judul" name="judul" defaultValue={awal?.judul} maxLength={120} className={isian} placeholder="Nama potensi atau usaha warga" />
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className={label} htmlFor="kategoriId">KATEGORI</label>
            <select id="kategoriId" name="kategoriId" defaultValue={awal?.kategoriId ?? kategori[0]?.id} className={isian}>
              {kategori.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
            </select>
          </div>
          <div>
            <label className={label} htmlFor="status">STATUS PUBLIKASI</label>
            <select id="status" name="status" defaultValue={awal?.status ?? "draft"} className={isian}>
              <option value="draft">Draft</option>
              <option value="terbit">Terbit</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className={label} htmlFor="ringkasan">RINGKASAN</label>
          <textarea id="ringkasan" name="ringkasan" defaultValue={awal?.ringkasan} maxLength={320} rows={3} className={`${isian} leading-relaxed`} placeholder="Kalimat singkat yang tampil pada kartu." />
        </div>

        <div className="mt-4">
          <label className={label} htmlFor="deskripsi">STORYTELLING / DESKRIPSI</label>
          <textarea id="deskripsi" name="deskripsi" defaultValue={awal?.deskripsi} maxLength={3000} rows={7} className={`${isian} leading-relaxed`} placeholder="Cerita, konteks, atau informasi yang ingin dibagikan kepada warga." />
        </div>
      </fieldset>

      <fieldset className="rounded-xl border border-garis bg-kertas p-4 lg:p-6">
        <legend className="px-1 text-[11px] font-bold tracking-[.1em] text-emas-tua">MEDIA & INFORMASI TAMBAHAN</legend>

        <span className={label}>GAMBAR UTAMA · OPSIONAL</span>
        <IsianBerkas name="gambarBerkas" jenis="gambar" awal={awal?.gambarUrl ?? undefined} />

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className={label} htmlFor="subkategori">SUBKATEGORI · OPSIONAL</label>
            <input id="subkategori" name="subkategori" defaultValue={awal?.subkategori ?? ""} maxLength={100} className={isian} placeholder="Kuliner, Kerajinan, Tradisi, dan sebagainya" />
          </div>
          <div>
            <label className={label} htmlFor="produk">PRODUK / KARYA · OPSIONAL</label>
            <input id="produk" name="produk" defaultValue={awal?.produk ?? ""} maxLength={320} className={isian} placeholder="Nama produk, layanan, atau karya" />
          </div>
          <div>
            <label className={label} htmlFor="lokasi">LOKASI · OPSIONAL</label>
            <input id="lokasi" name="lokasi" defaultValue={awal?.lokasi ?? ""} maxLength={160} className={isian} placeholder="RT/RW atau lokasi kegiatan" />
          </div>
          <div>
            <label className={label} htmlFor="kontak">KONTAK · OPSIONAL</label>
            <input id="kontak" name="kontak" defaultValue={awal?.kontak ?? ""} maxLength={160} className={isian} placeholder="Nomor WhatsApp atau kontak publik" />
          </div>
        </div>

        <div className="mt-4">
          <label className={label} htmlFor="albumId">ALBUM DOKUMENTASI · OPSIONAL</label>
          <select id="albumId" name="albumId" defaultValue={awal?.albumId ?? ""} className={isian}>
            <option value="">Tidak ditautkan ke album</option>
            {albumOptions.map((album) => (
              <option key={album.id} value={album.id}>
                {album.judul} · {album._count.foto} foto · {album.status === "terbit" ? "Terbit" : "Draft"}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-[11.5px] leading-relaxed text-samar">Album dikelola dari menu Galeri dan akan tampil sebagai dokumentasi tambahan jika sudah terbit.</p>
        </div>
      </fieldset>

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <button type="submit" className={`${tombol("primer")} min-h-11`}>Simpan Potensi</button>
        <Link href="/admin/potensi" className="px-2 text-[13px] font-semibold text-redup hover:text-hutan">Batal</Link>
        <span className="text-xs text-samar">Data draft belum tampil di halaman publik.</span>
      </div>
    </form>
  );
}
