import { Header, NavBawah } from "@/components/situs";
import { Footer } from "@/components/ui/footer-section";
import { modeData } from "@/lib/env";

export default function LayoutPublik({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header modeDemo={modeData() === "demo"} />
      {/* pb-24 memberi ruang untuk navigasi bawah di mobile */}
      <main className="pb-24 md:pb-0">{children}</main>
      <Footer tahun={new Date().getFullYear()} />
      <NavBawah />
    </>
  );
}
