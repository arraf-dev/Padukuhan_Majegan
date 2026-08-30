import Link from "next/link";
import { isian, label, tombol } from "@/components/primitif";
import { IsianBerkas } from "@/components/isian-berkas";
import { simpanLayanan } from "@/app/admin/layanan/aksi";
import type { LayananForm } from "@/lib/layanan";

/** Form layanan dibagi menurut urutan kerja perangkat agar lebih mudah dipindai di ponsel. */
export function BorangLayanan({ awal, galat }: { awal?: LayananForm; galat?: string }) {
  return (
    <form action={simpanLayanan} className="flex max-w-3xl flex-col gap-4 lg:max-w-4xl lg:gap-5">
      {awal && <input type="hidden" name="id" value={awal.id} />}
      {galat && <p role="alert" className="rounded-xl border border-bata/35 bg-bata/10 px-4 py-3 text-[13px] font-semibold text-bata">{galat === "berkas" ? "Templat harus berformat PDF, JPG, PNG, atau WEBP dengan ukuran maksimal 4 MB." : galat === "panjang" ? "Nama maks. 200, deskripsi maks. 2.000 karakter, 50 persyaratan & 30 alur." : "Nama, deskripsi, dan minimal satu persyaratan wajib diisi."}</p>}

      <fieldset className="rounded-xl border border-garis bg-kertas p-4 lg:p-5">
        <legend className="px-1 text-[11px] font-bold tracking-[.1em] text-emas-tua">INFORMASI DASAR</legend>
        <div><label className={label} htmlFor="nama">NAMA LAYANAN</label><input id="nama" name="nama" defaultValue={awal?.nama} placeholder="Surat Pengantar Domisili" className={isian} />{awal && <p className="mt-1.5 text-[11.5px] text-samar">Alamat halaman tetap <code>/layanan/{awal.slug}</code> meski nama diubah.</p>}</div>
        <div className="mt-4"><label className={label} htmlFor="deskripsi">DESKRIPSI</label><textarea id="deskripsi" name="deskripsi" rows={4} defaultValue={awal?.deskripsi} className={`${isian} leading-relaxed`} /></div>
        <div className="mt-4 flex flex-wrap gap-4"><div className="min-w-44 flex-1"><label className={label} htmlFor="biaya">BIAYA</label><input id="biaya" name="biaya" defaultValue={awal?.biaya} placeholder="GRATIS" className={isian} /></div><div className="w-24"><label className={label} htmlFor="urutan">URUTAN</label><input id="urutan" name="urutan" type="number" defaultValue={awal?.urutan ?? 0} className={isian} /></div></div>
      </fieldset>

      <fieldset className="rounded-xl border border-garis bg-kertas p-4 lg:p-5">
        <legend className="px-1 text-[11px] font-bold tracking-[.1em] text-emas-tua">PERSYARATAN</legend>
        <label className={label} htmlFor="persyaratan">SATU BARIS SATU SYARAT · <code>**tebal**</code> UNTUK MENYOROT</label>
        <textarea id="persyaratan" name="persyaratan" rows={5} defaultValue={awal?.persyaratan} placeholder={"Fotokopi **KTP** pemohon (1 lembar)\nFotokopi **Kartu Keluarga** (1 lembar)"} className={`${isian} leading-relaxed`} />
      </fieldset>

      <fieldset className="rounded-xl border border-garis bg-kertas p-4 lg:p-5">
        <legend className="px-1 text-[11px] font-bold tracking-[.1em] text-emas-tua">ALUR PENGURUSAN</legend>
        <label className={label} htmlFor="alur">SATU BARIS SATU LANGKAH · PISAHKAN JUDUL DAN DETAIL DENGAN <code>|</code></label>
        <textarea id="alur" name="alur" rows={5} defaultValue={awal?.alur} placeholder={"Siapkan berkas persyaratan | Lengkapi berkas di rumah\nDatang ke Balai Dusun | Serahkan ke perangkat dusun"} className={`${isian} leading-relaxed`} />
        <p className="mt-1.5 text-[11.5px] text-samar">Baris tanpa <code>|</code> tetap sah dan akan dipakai sebagai judul langkah.</p>
      </fieldset>

      <fieldset className="rounded-xl border border-garis bg-kertas p-4 lg:p-5">
        <legend className="px-1 text-[11px] font-bold tracking-[.1em] text-emas-tua">DOKUMEN TEMPLAT</legend>
        <span className={label}>BERKAS TEMPLAT · OPSIONAL</span>
        {awal?.fileTemplat && <input type="hidden" name="fileTemplat" value={awal.fileTemplat} />}
        <IsianBerkas name="templatBerkas" jenis="dokumen" awal={awal?.fileTemplat} />
      </fieldset>

      <div className="flex flex-wrap items-center gap-3 pt-1"><button type="submit" className={`${tombol("primer")} min-h-11`}>Simpan Layanan</button><Link href="/admin/layanan" className="px-2 text-[13px] font-semibold text-redup transition-colors hover:text-hutan">Batal</Link></div>
    </form>
  );
}
