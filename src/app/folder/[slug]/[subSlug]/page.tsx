export const dynamic = "force-dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ChevronRight, FileText } from "lucide-react";
import { DOC_TYPE_LABELS } from "@/lib/validations";
import { EditFolderButton } from "@/components/sops/EditFolderButton";

interface Props { params: Promise<{ slug: string; subSlug: string }> }

export async function generateMetadata({ params }: Props) {
  const { slug, subSlug } = await params;
  const sf = await prisma.subfolder.findFirst({ where: { slug: subSlug, category: { slug } }, include: { category: true } });
  return { title: sf ? `${sf.name} — E&C Docs` : "Not Found" };
}

export default async function SubfolderPage({ params }: Props) {
  const { slug, subSlug } = await params;

  const sf = await prisma.subfolder.findFirst({
    where: { slug: subSlug, category: { slug } },
    include: {
      category: true,
      documents: {
        orderBy: { updatedAt: "desc" },
        include: {
          versions: { orderBy: { version: "desc" }, take: 1, select: { versionName: true, version: true } },
        },
      },
    },
  });

  if (!sf) notFound();

  return (
    <div style={{ display: "flex", minHeight: "100%" }}>
      {/* Main content */}
      <div style={{ flex: 1, padding: "28px 30px 48px 0", marginLeft: "clamp(24px, 6vw, 120px)", maxWidth: 860, minWidth: 0 }}>

        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--muted)", marginBottom: 14 }}>
          <Link href="/" className="bc-link">E&amp;C Docs</Link>
          <span style={{ opacity: 0.4 }}>›</span>
          <Link href={`/folder/${slug}`} className="bc-link">{sf.category.name}</Link>
          <span style={{ opacity: 0.4 }}>›</span>
          <span>{sf.name}</span>
        </div>

        {/* Title row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, gap: 12 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, color: "var(--text)", letterSpacing: "-0.3px" }}>{sf.name}</h1>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <EditFolderButton subfolderId={sf.id} initialName={sf.name} initialDescription={sf.description} />
            <Link
              href={`/docs/new?subfolderID=${sf.id}`}
              style={{
                fontSize: 12, fontWeight: 600, padding: "6px 12px",
                borderRadius: 6, border: "1px solid var(--border)",
                background: "var(--text)", color: "var(--bg)",
                textDecoration: "none", whiteSpace: "nowrap",
                display: "flex", alignItems: "center", gap: 5,
              }}
            >
              + New doc
            </Link>
          </div>
        </div>

        {/* Description box */}
        {sf.description && (
          <div style={{
            background: "var(--card)", border: "1px solid var(--border)",
            borderRadius: 6, padding: "11px 14px",
            fontSize: 13, color: "var(--muted)", marginBottom: 16,
          }}>
            {sf.description}
          </div>
        )}

        <div style={{ height: 1, background: "var(--border)", marginBottom: 24 }} />

        {/* Documents */}
        <div id="sec-documents">
          <div style={{ fontWeight: 700, fontSize: 17, color: "var(--text)", marginBottom: 4 }}>Documents</div>
          <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 14 }}>
            SOPs, guides, and resources for {sf.name}.
          </div>

          {sf.documents.length === 0 ? (
            <div style={{
              border: "1px dashed var(--border)", borderRadius: 8,
              padding: "40px 24px", textAlign: "center",
              color: "var(--muted)", fontSize: 13,
            }}>
              No documents yet.{" "}
              <Link href={`/docs/new?subfolderID=${sf.id}`} style={{ color: "var(--accent)" }}>Create the first one.</Link>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 10 }}>
              {sf.documents.map(doc => {
                const ver = doc.versions[0];
                return (
                  <Link
                    key={doc.id}
                    href={`/docs/${doc.id}`}
                    className="hover-card"
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 14px", borderRadius: 8 }}
                  >
                    <FileText size={15} style={{ color: "var(--muted)", flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {doc.name}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>
                        {DOC_TYPE_LABELS[doc.docType as keyof typeof DOC_TYPE_LABELS] || doc.docType}
                        {ver && ` · ${ver.versionName || `v${ver.version}`}`}
                        {doc.owner && ` · ${doc.owner}`}
                      </div>
                    </div>
                    <span style={{ fontSize: 11, color: "var(--accent)", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 2 }}>
                      View doc <ChevronRight size={11} />
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* TOC */}
      <div style={{ width: 200, minWidth: 160, padding: "28px 14px 28px 16px", flexShrink: 0 }}>
        <div style={{ position: "sticky", top: 28 }}>
          <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, padding: "14px 16px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "var(--muted)", textTransform: "uppercase", marginBottom: 10 }}>
              On This Page
            </div>
            <a href="#sec-documents" style={{ display: "block", fontSize: 12, color: "var(--text)", fontWeight: 600, textDecoration: "none", padding: "3px 0" }}>
              Documents ({sf.documents.length})
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
