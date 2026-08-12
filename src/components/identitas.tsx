/**
 * Identitas wajib untuk setiap pengaduan. Server tetap memvalidasi kedua isian
 * agar permintaan tanpa JavaScript/HTML validation tidak dapat melewatinya.
 */
export function Identitas({ kotak, label }: { kotak: string; label: string }) {
  return (
    <fieldset className="mt-4 rounded-xl border border-garis bg-krem/60 p-4 md:p-5">
      <legend className="px-1 text-[12px] font-bold tracking-[.08em] text-emas-tua">
        IDENTITAS PELAPOR
      </legend>
      <p className="mb-4 text-[12.5px] leading-relaxed text-redup">
        Identitas diperlukan agar perangkat dapat menghubungi Anda bila membutuhkan informasi tambahan.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="nama" className={label}>
            Nama lengkap <span className="text-bata">*</span>
          </label>
          <input id="nama" name="nama" required autoComplete="name" className={kotak} placeholder="Nama lengkap" />
        </div>
        <div>
          <label htmlFor="kontak" className={label}>
            Nomor HP/WhatsApp <span className="text-bata">*</span>
          </label>
          <input
            id="kontak"
            name="kontak"
            required
            inputMode="tel"
            autoComplete="tel"
            className={kotak}
            placeholder="08xx-xxxx-xxxx"
          />
        </div>
      </div>
    </fieldset>
  );
}
