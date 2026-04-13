import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ChevronRight, Folder } from "lucide-react";

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const cat = await prisma.category.findUnique({ where: { slug } });
  return { title: cat ? `${cat.name} — E&C Docs` : "Not Found" };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  const cat = await prisma.category.findUnique({
    where: { slug },
    include: {
      subfolders: {
        orderBy: { order: "asc" },
        include: { _count: { select: { documents: true } } },
      },
    },
  });

  if (!cat) notFound();

  // Group subfolders by their `group` field
  const groups = new Map<string, typeof cat.subfolders>();
  for (const sf of cat.subfolders) {
    const g = sf.group || cat.name;
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g)!.push(sf);
  }
  const groupEntries = Array.from(groups.entries());

  return (
    <div style={{ display: "flex", minHeight: "100%" }}>
      {/* Main content */}
      <div style={{ flex: 1, padding: "28px 30px 48px 0", marginLeft: "clamp(24px, 6vw, 120px)", maxWidth: 860, minWidth: 0 }}>

        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--muted)", marginBottom: 14 }}>
          <Link href="/" className="bc-link">E&amp;C Docs</Link>
          <span style={{ opacity: 0.4 }}>›</span>
          <span>{cat.name}</span>
        </div>

        {/* Title */}
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: "0 0 10px", color: "var(--text)", letterSpacing: "-0.3px" }}>{cat.name}</h1>

        {/* Description box */}
        {cat.description && (
          <div style={{
            background: "var(--card)", border: "1px solid var(--border)",
            borderRadius: 6, padding: "11px 14px",
            fontSize: 13, color: "var(--muted)", marginBottom: 16, lineHeight: 1.5,
          }}>
            {cat.description}
          </div>
        )}

        <div style={{ height: 1, background: "var(--border)", marginBottom: 28 }} />

        {/* Sections */}
        {groupEntries.map(([groupName, subs]) => (
          <div key={groupName} id={`sec-${groupName.toLowerCase().replace(/\s+/g, "-")}`} style={{ marginBottom: 36 }}>
            <div style={{ fontWeight: 700, fontSize: 17, color: "var(--text)", marginBottom: 4 }}>{groupName}</div>
            <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 14 }}>
              {subs.length} folder{subs.length !== 1 ? "s" : ""} · click a card to open
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 10 }}>
              {subs.map(sf => (
                <Link
                  key={sf.id}
                  href={`/folder/${cat.slug}/${sf.slug}`}
                  className="hover-card"
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 14px", borderRadius: 8 }}
                >
                  <Folder size={15} style={{ color: "var(--muted)", flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text)" }}>{sf.name}</div>
                    {sf.description && (
                      <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {sf.description}
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: 12, color: "var(--accent)", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 3 }}>
                    Open folder <ChevronRight size={12} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {cat.subfolders.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px 0", color: "var(--muted)", fontSize: 14 }}>
            No folders yet in this category.
          </div>
        )}
      </div>

      {/* TOC */}
      {groupEntries.length > 1 && (
        <div style={{ width: 200, minWidth: 180, padding: "28px 14px 28px 16px", flexShrink: 0 }}>
          <div style={{ position: "sticky", top: 28 }}>
            <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, padding: "14px 16px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "var(--muted)", textTransform: "uppercase", marginBottom: 10 }}>
                On This Page
              </div>
              {groupEntries.map(([groupName]) => (
                <a key={groupName} href={`#sec-${groupName.toLowerCase().replace(/\s+/g, "-")}`} className="toc-link">
                  {groupName}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
