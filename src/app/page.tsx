export const dynamic = "force-dynamic";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Calendar, Film, TrendingUp, Box, Users, Lock, FileText, ChevronRight } from "lucide-react";

const ICONS: Record<string, React.ReactNode> = {
  Calendar:   <Calendar   size={28} strokeWidth={1.5} />,
  Film:       <Film       size={28} strokeWidth={1.5} />,
  TrendingUp: <TrendingUp size={28} strokeWidth={1.5} />,
  Box:        <Box        size={28} strokeWidth={1.5} />,
  Users:      <Users      size={28} strokeWidth={1.5} />,
  Lock:       <Lock       size={28} strokeWidth={1.5} />,
  FileText:   <FileText   size={28} strokeWidth={1.5} />,
};

export default async function HomePage() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { subfolders: true } } },
  });

  return (
    <div>
      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, #e8f0fe 0%, #f3e8ff 40%, #fce7f3 70%, #d1fae5 100%)",
        padding: "56px 48px 48px",
        textAlign: "center",
      }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, margin: "0 0 10px", color: "#111827", letterSpacing: "-0.5px" }}>
          Build with Eminence &amp; Co
        </h1>
        <p style={{ fontSize: 16, color: "#4b5563", margin: "0 0 28px" }}>
          All SOPs, guides, and documentation in one place.
        </p>
        <form action="/search" method="GET" style={{ maxWidth: 480, margin: "0 auto" }}>
          <div style={{ position: "relative" }}>
            <svg style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", pointerEvents: "none" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input
              name="q"
              placeholder="Search all docs..."
              style={{
                width: "100%", height: 44, paddingLeft: 44, paddingRight: 16,
                borderRadius: 8, border: "1px solid #d1d5db",
                background: "rgba(255,255,255,0.85)", fontSize: 14,
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)", outline: "none",
                boxSizing: "border-box", color: "#111827",
              }}
            />
          </div>
        </form>
      </div>

      {/* Categories grid */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 32px" }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 20px", color: "var(--text)", textAlign: "center" }}>
          Business Areas
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
          {categories.map(cat => (
            <Link
              key={cat.id}
              href={`/folder/${cat.slug}`}
              className="hover-card"
              style={{
                display: "flex", alignItems: "flex-start", gap: 14,
                padding: "18px", borderRadius: 10,
              }}
            >
              <span style={{ color: "var(--accent)", marginTop: 2, flexShrink: 0 }}>
                {ICONS[cat.icon || "FileText"] || <FileText size={28} strokeWidth={1.5} />}
              </span>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", marginBottom: 3 }}>{cat.name}</div>
                <div style={{ fontSize: 12, color: "var(--accent)", lineHeight: 1.4 }}>
                  {cat.description || `${cat._count.subfolders} folder${cat._count.subfolders !== 1 ? "s" : ""}`}
                </div>
              </div>
              <ChevronRight size={16} style={{ color: "var(--muted)", flexShrink: 0, marginTop: 4 }} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
