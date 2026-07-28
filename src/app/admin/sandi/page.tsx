import type { Metadata } from "next";
import { Kerangka } from "@/app/admin/kerangka";
import { gantiSandi } from "@/app/admin/akun/aksi";
import { PANJANG_SANDI_MIN } from "@/lib/auth";
import { wajibMasuk } from "@/lib/sesi";

export const metadata: Metadata = { title: "Ganti Sandi" };

const kabar: Record<string, string> = {
  "galat-sandi-lama": "Sandi lama salah.",
  "galat-sandi-pendek": `Sandi baru minimal ${PANJANG_SANDI_MIN} karakter.`,
  "galat-tidak-cocok": "Ulangan sandi tidak sama dengan sandi baru.",
};

const isian =
  "w-full rounded-[9px] border border-garis bg-krem px-3.5 py-2.5 text-[13.5px] text-tinta placeholder:text-samar focus:border-daun focus:outline-none";
const label = "mb-1.5 block text-[11px] font-bold tracking-[.08em] text-samar";

/** AUTH-4 — terbuka untuk peran `admin` juga, bukan hanya superadmin. */
export default async function GantiSandi({
  searchParams,
}: {
  searchParams: Promise<{ tersimpan?: string; galat?: string }>;
}) {
  const { nama, peran } = await wajibMasuk();
  const { tersimpan, galat } = await searchParams;

  return (
    <Kerangka peran={peran} nama={nama}>
      <h1 className="font-serif text-xl font-semibold text-hutan md:text-2xl">Ganti Sandi</h1>
      <p className="mt-1 mb-5 text-[12.5px] text-samar">
        Akun {nama} · sandi ini satu-satunya pintu masuk panel
      </p>

      {(tersimpan || galat) && (
        <p
          role="status"
          className={`mb-4 max-w-md rounded-[10px] px-4 py-3 text-[13px] font-semibold ${
            galat
              ? "border border-bata/35 bg-bata/10 text-bata"
              : "border border-emas-garis bg-emas-muda text-emas-teks"
          }`}
        >
          {galat ? kabar[`galat-${galat}`] : "Sandi berhasil diganti."}
        </p>
      )}

      <form action={gantiSandi} className="flex max-w-md flex-col gap-4">
        <div>
          <label className={label} htmlFor="lama">
            SANDI LAMA
          </label>
          <input
            id="lama"
            name="lama"
            type="password"
            autoComplete="current-password"
            className={isian}
          />
        </div>
        <div>
          <label className={label} htmlFor="baru">
            SANDI BARU
          </label>
          <input
            id="baru"
            name="baru"
            type="password"
            autoComplete="new-password"
            placeholder={`minimal ${PANJANG_SANDI_MIN} karakter`}
            className={isian}
          />
          <p className="mt-1.5 text-[11.5px] text-samar">
            Kalimat pendek yang mudah diingat lebih aman daripada satu kata bercampur simbol —
            misalnya <em>ronda malam kamis</em>.
          </p>
        </div>
        <div>
          <label className={label} htmlFor="ulangi">
            ULANGI SANDI BARU
          </label>
          <input
            id="ulangi"
            name="ulangi"
            type="password"
            autoComplete="new-password"
            className={isian}
          />
        </div>

        <button
          type="submit"
          className="inline-flex min-h-11 items-center justify-center rounded-[9px] bg-hutan px-5 py-2.5 text-[13.5px] font-bold text-krem hover:bg-daun"
        >
          Ganti Sandi
        </button>
      </form>
    </Kerangka>
  );
}
