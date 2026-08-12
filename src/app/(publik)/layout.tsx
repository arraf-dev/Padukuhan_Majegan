import { Footer, Header, NavBawah } from "@/components/situs";
import { StatusDataDemo } from "@/components/status-data";

export default function LayoutPublik({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <StatusDataDemo />
      {/* pb-24 memberi ruang untuk navigasi bawah di mobile */}
      <main className="pb-24 md:pb-0">{children}</main>
      <Footer />
      <NavBawah />
    </>
  );
}
