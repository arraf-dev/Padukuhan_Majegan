import type { Metadata } from "next";
import { Lora, Plus_Jakarta_Sans } from "next/font/google";
import { desa, situsUrl } from "@/content/majegan";
import { Reveal } from "@/components/gerak";
import "./globals.css";

const lora = Lora({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-lora",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  metadataBase: new URL(situsUrl),
  title: {
    default: `Website Resmi ${desa.nama}`,
    template: `%s · ${desa.nama}`,
  },
  description: `Kanal informasi dan layanan resmi warga ${desa.nama}, ${desa.kalurahan}.`,
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: desa.nama,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${lora.variable} ${jakarta.variable}`}>
      <body>
        {children}
        <Reveal />
      </body>
    </html>
  );
}
