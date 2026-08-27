import { Header } from "@/components/situs";
import { Footer } from "@/components/ui/footer-section";
import { modeData } from "@/lib/env";

// Halaman publik memakai ISR. Aksi admin memanggil `revalidatePath`, jadi
// perubahan konten tampil seketika tanpa menunggu jeda revalidasi.
export const revalidate = 60;

export default function LayoutPublik({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header modeDemo={modeData() === "demo"} />
      <main>{children}</main>
      <Footer tahun={new Date().getFullYear()} />
    </>
  );
}
