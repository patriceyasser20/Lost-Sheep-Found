import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

export default async function ProductPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="section" style={{ minHeight: "80vh" }}>
      <Link href="/" className="text-link"><ArrowLeft size={15} /> Back home</Link>
      <div style={{ maxWidth: 720, margin: "90px auto", textAlign: "center" }}>
        <Sparkles size={24} style={{ color: "var(--gold)" }} />
        <p className="eyebrow" style={{ marginTop: 20 }}>Product {id}</p>
        <h1 style={{ fontSize: "clamp(50px, 7vw, 80px)" }}>A meaningful piece,<br /><em>coming together.</em></h1>
        <p className="hero-text" style={{ margin: "30px auto" }}>
          This product route is ready for the Supabase catalog and customization builder.
        </p>
      </div>
    </main>
  );
}