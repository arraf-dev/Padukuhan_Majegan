import Link from "next/link";
import { isian, label, tombol } from "@/components/primitif";
import { IsianBerkas } from "@/components/isian-berkas";
import { simpanLayanan } from "@/app/admin/layanan/aksi";
import type { LayananForm } from "@/lib/layanan";

/**
 * Satu form dipakai "Layanan Baru" maupun sunting, dibedakan prop `awal` —
 * persis cara `<Komposer>` dipakai `berita/baru` dan `berita/[id]`.
 */

export function BorangLayanan({ awal, galat }: { awal?: LayananForm; galat?: string }) {
  return (
    <form action={simpanLayanan} className="flex max-w-3xl flex-col gap-4 lg:max-w-4xl lg:gap-5">
      {awal && <input type="hidden" name="id" value={awal.id} />}

      {galat && (
        <p
          role="alert"
          className="rounded-xl border border-bata/35 bg-bata/10 px-4 py-3 text-[13px] font-semibold text-bata"
        >
          {galat === "berkas"
            ? "Templat harus berformat PDF, JPG, PNG, atau WEBP dengan ukuran maksimal 4 MB."
            : "Nama, deskripsi, dan minimal satu persyaratan wajib diisi."}
        </p>
      )}

      <div>
        <label className={label} htmlFor="nama">
          NAMA LAYANAN
        </label>
        <input
          id="nama"
          name="nama"
          defaultValue={awal?.nama}
          placeholder="Surat Pengantar Domisili"
          className={isian}
        />
        {awal && (
          <p className="mt-1.5 text-[11.5px] text-samar">
            Alamat halaman tetap <code>/layanan/{awal.slug}</code> meski nama diubah — tautan yang
            sudah tersebar tidak mati.
          </p>
        )}
      </div>

      <div>
        <label className={label} htmlFor="deskripsi">
          DESKRIPSI
        </label>
        <textarea
          id="deskripsi"
          name="deskripsi"
          rows={4}
          defaultValue={awal?.deskripsi}
          className={`${isian} leading-relaxed`}
        />
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="min-w-44 flex-1">
          <label className={label} htmlFor="estimasiWaktu">
            ESTIMASI WAKTU
          </label>
          <input
            id="estimasiWaktu"
            name="estimasiWaktu"
            defaultValue={awal?.estimasiWaktu}
            placeholder="± 1 hari kerja"
            className={isian}
          />
        </div>
        <div className="min-w-32 flex-1">
          <label className={label} htmlFor="biaya">
            BIAYA
          </label>
          <input
            id="biaya"
            name="biaya"
            defaultValue={awal?.biaya}
            placeholder="GRATIS"
            className={isian}
          />
        </div>
        <div className="w-24">
          <label className={label} htmlFor="urutan">
            URUTAN
          </label>
          <input
            id="urutan"
            name="urutan"
            type="number"
            defaultValue={awal?.urutan ?? 0}
            className={isian}
          />
        </div>
      </div>

      <div>
        <label className={label} htmlFor="persyaratan">
          PERSYARATAN · satu baris satu syarat · <code>**tebal**</code> untuk menyorot
        </label>
        <textarea
          id="persyaratan"
          name="persyaratan"
          rows={5}
          defaultValue={awal?.persyaratan}
          placeholder={"Fotokopi **KTP** pemohon (1 lembar)\nFotokopi **Kartu Keluarga** (1 lembar)"}
          className={`${isian} leading-relaxed`}
        />
      </div>

      <div>
        <label className={label} htmlFor="alur">
          ALUR PENGURUSAN · satu baris satu langkah, dipisah tanda <code>|</code>
        </label>
        <textarea
          id="alur"
          name="alur"
          rows={5}
          defaultValue={awal?.alur}
          placeholder={"Siapkan berkas persyaratan | Lengkapi berkas di rumah\nDatang ke Balai Dusun | Serahkan ke perangkat dusun"}
          className={`${isian} leading-relaxed`}
        />
        <p className="mt-1.5 text-[11.5px] text-samar">
          Teks sebelum <code>|</code> jadi judul langkah, sesudahnya jadi keterangan. Baris tanpa{" "}
          <code>|</code> tetap sah.
        </p>
      </div>

      <div>
        <span className={label}>BERKAS TEMPLAT · opsional</span>
        {awal?.fileTemplat && <input type="hidden" name="fileTemplat" value={awal.fileTemplat} />}
        <IsianBerkas name="templatBerkas" jenis="dokumen" awal={awal?.fileTemplat} />
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <button type="submit" className={`${tombol("primer")} min-h-11`}>
          Simpan Layanan
        </button>
        <Link
          href="/admin/layanan"
          className="px-2 text-[13px] font-semibold text-redup transition-colors duration-200 ease-out hover:text-hutan"
        >
          Batal
        </Link>
      </div>
    </form>
  );
}
