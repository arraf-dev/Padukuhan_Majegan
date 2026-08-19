import { Header } from "@/components/situs";
import { Footer } from "@/components/ui/footer-section";
import { modeData } from "@/lib/env";

export default function LayoutPublik({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header modeDemo={modeData() === "demo"} />
      <main>{children}</main>
      <Footer tahun={new Date().getFullYear()} />
    </>
  );
}
