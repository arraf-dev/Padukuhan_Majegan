import type { SVGProps } from "react";

/**
 * Ikon garis dari mockup. Dua warna: garis hijau (`stroke`) dengan aksen emas —
 * dipertahankan supaya konsisten dengan Spec.
 */

type Props = SVGProps<SVGSVGElement> & { ukuran?: number };

const svg = (
  { ukuran = 20, ...rest }: Props,
  viewBox: string,
  isi: React.ReactNode,
) => (
  <svg width={ukuran} height={ukuran} viewBox={viewBox} aria-hidden="true" {...rest}>
    {isi}
  </svg>
);

export const Logo = ({ ukuran = 42, ...rest }: Props) =>
  svg(
    { ukuran, ...rest },
    "0 0 42 42",
    <>
      <rect width="42" height="42" rx="10" fill="#0A2E1E" />
      <path
        d="M8 24 L21 12 L34 24"
        fill="none"
        stroke="#D6B45C"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M13 29 H29" stroke="#D6B45C" strokeWidth="2.6" strokeLinecap="round" />
    </>,
  );

/** Garis atap joglo kecil — pembatas judul section. */
export const Atap = ({ ukuran = 30, ...rest }: Props) => (
  <svg width={ukuran} height={(ukuran / 30) * 12} viewBox="0 0 30 12" aria-hidden="true" {...rest}>
    <path
      d="M2 11 L15 2 L28 11"
      fill="none"
      stroke="#D6B45C"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const gambar: Record<string, { viewBox: string; isi: React.ReactNode }> = {
  rumah: {
    viewBox: "0 0 22 22",
    isi: (
      <>
        <path
          d="M3.5 10.5 L11 4 L18.5 10.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6 10 V18 H16 V10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    ),
  },
  surat: {
    viewBox: "0 0 20 20",
    isi: (
      <>
        <rect x="4" y="2.5" width="12" height="15" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M7.5 7 H12.5 M7.5 10.5 H12.5 M7.5 14 H10.5" stroke="#D6B45C" strokeWidth="1.6" strokeLinecap="round" />
      </>
    ),
  },
  obrolan: {
    viewBox: "0 0 20 20",
    isi: (
      <>
        <path
          d="M3 4.5 C3 3.7 3.7 3 4.5 3 H15.5 C16.3 3 17 3.7 17 4.5 V12 C17 12.8 16.3 13.5 15.5 13.5 H8 L4.5 17 V13.5 H4.5 C3.7 13.5 3 12.8 3 12 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <circle cx="10" cy="8.2" r="1.4" fill="#D6B45C" />
      </>
    ),
  },
  berita: {
    viewBox: "0 0 20 20",
    isi: (
      <>
        <rect x="3" y="3.5" width="14" height="13" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M6.5 7.5 H13.5 M6.5 10.5 H13.5 M6.5 13.5 H10" stroke="#D6B45C" strokeWidth="1.6" strokeLinecap="round" />
      </>
    ),
  },
  warga: {
    viewBox: "0 0 20 20",
    isi: (
      <>
        <circle cx="10" cy="7" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M4 17 C5 14 7.3 12.6 10 12.6 C12.7 12.6 15 14 16 17"
          fill="none"
          stroke="#D6B45C"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </>
    ),
  },
  kisi: {
    viewBox: "0 0 22 22",
    isi: (
      <>
        <rect x="3.5" y="3.5" width="6.5" height="6.5" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.9" />
        <rect x="12" y="3.5" width="6.5" height="6.5" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.9" />
        <rect x="3.5" y="12" width="6.5" height="6.5" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.9" />
        <rect x="12" y="12" width="6.5" height="6.5" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.9" />
      </>
    ),
  },
  batang: {
    viewBox: "0 0 22 22",
    isi: <path d="M4 18 V10 M9.5 18 V5 M15 18 V12 M20 18 V8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />,
  },
  cari: {
    viewBox: "0 0 14 14",
    isi: (
      <>
        <circle cx="6" cy="6" r="4.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M9.4 9.4 L13 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </>
    ),
  },
  gembok: {
    viewBox: "0 0 18 18",
    isi: (
      <>
        <rect x="3.5" y="7.5" width="11" height="8" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M6 7.5 V5.5 C6 3.8 7.3 2.5 9 2.5 C10.7 2.5 12 3.8 12 5.5 V7.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
      </>
    ),
  },
  pin: {
    viewBox: "0 0 16 16",
    isi: (
      <>
        <path
          d="M8 1.5 C5.2 1.5 3 3.7 3 6.5 C3 10 8 14.5 8 14.5 C8 14.5 13 10 13 6.5 C13 3.7 10.8 1.5 8 1.5 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle cx="8" cy="6.5" r="1.8" fill="#D6B45C" />
      </>
    ),
  },
  hati: {
    viewBox: "0 0 24 24",
    isi: (
      <path
        d="M12 20.5 C7 16.5 3.5 13.3 3.5 9.6 C3.5 7 5.5 5 8 5 C9.6 5 11.1 5.8 12 7.1 C12.9 5.8 14.4 5 16 5 C18.5 5 20.5 7 20.5 9.6 C20.5 13.3 17 16.5 12 20.5 Z"
        fill="#B0532E"
        stroke="#B0532E"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    ),
  },
  balon: {
    viewBox: "0 0 24 24",
    isi: (
      <path
        d="M21 11.5 C21 16 17 19.5 12 19.5 C10.8 19.5 9.6 19.3 8.5 18.9 L3.5 20.5 L5.2 16.6 C3.8 15.2 3 13.4 3 11.5 C3 7 7 3.5 12 3.5 C17 3.5 21 7 21 11.5 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    ),
  },
  kirim: {
    viewBox: "0 0 24 24",
    isi: (
      <path
        d="M21 3 L10 14 M21 3 L14.5 21 L10 14 L3 9.5 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    ),
  },
  foto: {
    viewBox: "0 0 26 26",
    isi: (
      <>
        <rect x="2.5" y="5" width="21" height="16" rx="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="9" cy="11" r="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M5 19 L11 13.5 L15 17 L18 14.5 L21 17.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    ),
  },
  berkas: {
    viewBox: "0 0 26 26",
    isi: (
      <>
        <rect x="4" y="2.5" width="18" height="21" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <path d="M9 8 H17 M9 12 H17 M9 16 H13.5" stroke="#D6B45C" strokeWidth="1.7" strokeLinecap="round" />
      </>
    ),
  },
  kembali: {
    viewBox: "0 0 20 20",
    isi: (
      <path
        d="M12.5 4 L6.5 10 L12.5 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
};

export type NamaIkon = keyof typeof gambar;

export function Ikon({ nama, ...rest }: Props & { nama: NamaIkon }) {
  const { viewBox, isi } = gambar[nama];
  return svg(rest, viewBox, isi);
}

/** Centang dalam kotak — dipakai di daftar persyaratan layanan. */
export const CentangKotak = ({ ukuran = 18, ...rest }: Props) =>
  svg(
    { ukuran, ...rest },
    "0 0 18 18",
    <>
      <rect x="1.5" y="1.5" width="15" height="15" rx="4" fill="#2A5B3C" />
      <path
        d="M5 9.2 L7.8 12 L13 6.5"
        fill="none"
        stroke="#F7F3E8"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>,
  );

/** Centang dalam lingkaran — dipakai di matriks peran & checklist komposer. */
export const CentangBulat = ({ ukuran = 15, ...rest }: Props) =>
  svg(
    { ukuran, ...rest },
    "0 0 18 18",
    <>
      <circle cx="9" cy="9" r="7.5" fill="#2A5B3C" />
      <path
        d="M5.5 9.3 L8 11.8 L12.5 6.8"
        fill="none"
        stroke="#F7F3E8"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>,
  );
