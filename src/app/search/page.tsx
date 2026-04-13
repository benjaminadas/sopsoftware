import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { FileText, ChevronRight } from "lucide-react";
import { DOC_TYPE_LABELS } from "@/lib/validations";

interface Props { searchParams: Promise<{ q?: string }> }

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = (q || "").trim();

  const docs = query
    ? await prisma.document.findMany({
        where: {
          OR: [
            { name:        { contains: query } },
            { description: { contains: query } },
            { docId:       { contains: query } },
            { owner:       { contains: query } },
            { funnelStage: { contains: query } },
          ],
        },
        orderBy: { updatedAt: "desc" },
        take: 40,
        include: {
          subfolder: { include: { category: true } },
          versions: { orderBy: { version: "desc" }, take: 1, select: { versionName: true, version: true } },
        },
      })
    : [];

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "32px 24px" }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", margin: "0 0 4px" }}>
        {query ? `Results for "${query}"` : "Search"}
      </h1>
      <p style={{ fontSize: 13, color: "var(--muted)", margin: "0 0 28px" }}>
        {query ? `${docs.length} document${docs.length !== 1 ? "s" : ""} found` : "Enter a search term above."}
      </p>

      {docs.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {docs.map(doc => {
            const ver = doc.versions[0];
            return (
              <Link
                key={doc.id}
                href={`/docs/${doc.id}`}
                className="hover-card"
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", borderRadius: 8 }}
              >
                <FileText size={15} style={{ color: "var(--muted)", flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text)" }}>{doc.name}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>
                    {doc.subfolder ? `${doc.subfolder.category.name} › ${doc.subfolder.name} · ` : ""}
                    {DOC_TYPE_LABELS[doc.docType as keyof typeof DOC_TYPE_LABELS] || doc.docType}
                    {ver && ` · ${ver.versionName || `v${ver.version}`}`}
                  </div>
                </div>
                <ChevronRight size={14} style={{ color: "var(--muted)", flexShrink: 0 }} />
              </Link>
            );
          })}
        </div>
      )}

      {query && docs.length === 0 && (
        <div style={{ textAlign: "center", padding: "48px", border: "1px dashed var(--border)", borderRadius: 8, color: "var(--muted)" }}>
          No documents found for &ldquo;{query}&rdquo;
        </div>
      )}
    </div>
  );
}
