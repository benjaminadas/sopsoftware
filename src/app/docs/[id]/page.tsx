import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ReadOnlyContent } from "@/components/editor/ReadOnlyContent";
import { DOC_TYPE_LABELS } from "@/lib/validations";
import { formatDate } from "@/lib/utils";
import { Edit, History } from "lucide-react";
import { DeleteDocButton } from "@/components/sops/DeleteDocButton";

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const doc = await prisma.document.findUnique({ where: { id }, select: { name: true } });
  return { title: doc ? `${doc.name} — E&C Docs` : "Not Found" };
}

export default async function DocPage({ params }: Props) {
  const { id } = await params;

  const doc = await prisma.document.findUnique({
    where: { id },
    include: {
      tags: { include: { tag: true } },
      subfolder: { include: { category: true } },
      project: true,
      versions: { orderBy: { version: "desc" }, take: 1 },
      _count: { select: { versions: true } },
    },
  });

  if (!doc) notFound();

  const ver = doc.versions[0];

  return (
    <div style={{ display: "flex", minHeight: "100%" }}>
      {/* Main content */}
      <div style={{ flex: 1, padding: "28px 30px 48px 0", marginLeft: "clamp(24px, 6vw, 120px)", maxWidth: 800, minWidth: 0 }}>

        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--muted)", marginBottom: 14, flexWrap: "wrap" }}>
          <Link href="/" className="bc-link">E&amp;C Docs</Link>
          {doc.subfolder && (
            <>
              <span style={{ opacity: 0.4 }}>›</span>
              <Link href={`/folder/${doc.subfolder.category.slug}`} className="bc-link">{doc.subfolder.category.name}</Link>
              <span style={{ opacity: 0.4 }}>›</span>
              <Link href={`/folder/${doc.subfolder.category.slug}/${doc.subfolder.slug}`} className="bc-link">{doc.subfolder.name}</Link>
            </>
          )}
          <span style={{ opacity: 0.4 }}>›</span>
          <span style={{ color: "var(--text)" }}>{doc.name}</span>
        </div>

        {/* Doc ID row + actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
          <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, background: "var(--card)", border: "1px solid var(--border)", padding: "2px 8px", borderRadius: 4, color: "var(--muted)" }}>
            {doc.docId}
          </span>
          {doc.owner && <span style={{ fontSize: 12, color: "var(--muted)" }}>· {doc.owner}</span>}
          {ver && (
            <span style={{ fontSize: 12, fontWeight: 600, background: "var(--accent-muted)", color: "var(--accent)", padding: "2px 8px", borderRadius: 12 }}>
              {ver.versionName || `v${ver.version}`}
            </span>
          )}
          <span style={{ fontSize: 12, color: "var(--muted)" }}>
            {DOC_TYPE_LABELS[doc.docType as keyof typeof DOC_TYPE_LABELS] || doc.docType}
          </span>

          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
            <Link href={`/sops/${id}/versions`}
              style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, padding: "5px 10px", borderRadius: 6, border: "1px solid var(--border)", color: "var(--muted)", textDecoration: "none" }}>
              <History size={13} /> History ({doc._count.versions})
            </Link>
            <Link href={`/docs/${id}/edit`}
              style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, padding: "5px 10px", borderRadius: 6, background: "var(--text)", color: "var(--bg)", textDecoration: "none", fontWeight: 600 }}>
              <Edit size={13} /> Edit
            </Link>
            <DeleteDocButton docId={id} docName={doc.name} />
          </div>
        </div>

        {/* Title */}
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 6px", color: "var(--text)", letterSpacing: "-0.4px" }}>{doc.name}</h1>
        {doc.description && (
          <p style={{ fontSize: 13, color: "var(--muted)", margin: "0 0 16px", lineHeight: 1.5 }}>{doc.description}</p>
        )}

        {/* Metadata */}
        {(doc.funnelStage || doc.channel || doc.department || doc.platform) && (
          <div style={{
            display: "flex", flexWrap: "wrap", gap: 16, padding: "12px 14px",
            borderRadius: 6, background: "var(--card)", border: "1px solid var(--border)",
            marginBottom: 20, fontSize: 12,
          }}>
            {doc.funnelStage && <span><span style={{ color: "var(--muted)" }}>Stage: </span><span style={{ color: "var(--text)" }}>{doc.funnelStage}</span></span>}
            {doc.channel    && <span><span style={{ color: "var(--muted)" }}>Channel: </span><span style={{ color: "var(--text)" }}>{doc.channel}</span></span>}
            {doc.department && <span><span style={{ color: "var(--muted)" }}>Dept: </span><span style={{ color: "var(--text)" }}>{doc.department}</span></span>}
            {doc.platform   && <span><span style={{ color: "var(--muted)" }}>Platform: </span><span style={{ color: "var(--text)" }}>{doc.platform}</span></span>}
            <span><span style={{ color: "var(--muted)" }}>Updated: </span><span style={{ color: "var(--text)" }}>{formatDate(doc.updatedAt)}</span></span>
          </div>
        )}

        {/* Tags */}
        {doc.tags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
            {doc.tags.map(({ tag }) => (
              <span key={tag.id} style={{ fontSize: 11, background: "var(--card)", border: "1px solid var(--border)", color: "var(--muted)", padding: "2px 8px", borderRadius: 12 }}>
                {tag.name}
              </span>
            ))}
          </div>
        )}

        <div style={{ height: 1, background: "var(--border)", marginBottom: 28 }} />

        {/* Content */}
        {ver ? (
          <div className="doc-content">
            {ver.changeNote && (
              <div style={{ marginBottom: 20, padding: "8px 12px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 12, color: "var(--muted)" }}>
                <strong style={{ color: "var(--text)" }}>{ver.versionName || `v${ver.version}`}:</strong> {ver.changeNote}
              </div>
            )}
            <ReadOnlyContent content={ver.content} />
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "48px", color: "var(--muted)", fontSize: 13, border: "1px dashed var(--border)", borderRadius: 8 }}>
            No content yet.{" "}
            <Link href={`/docs/${id}/edit`} style={{ color: "var(--accent)" }}>Click Edit to add content.</Link>
          </div>
        )}
      </div>

      {/* Right panel */}
      <div style={{ width: 200, minWidth: 160, padding: "28px 14px 28px 16px", flexShrink: 0 }}>
        <div style={{ position: "sticky", top: 28 }}>
          <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, padding: "14px 16px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "var(--muted)", textTransform: "uppercase", marginBottom: 12 }}>
              Document Info
            </div>
            <div style={{ fontSize: 12, lineHeight: 1.9, color: "var(--muted)" }}>
              <div><strong style={{ color: "var(--text)", fontWeight: 600 }}>ID</strong><br />{doc.docId}</div>
              {doc.owner && <div style={{ marginTop: 8 }}><strong style={{ color: "var(--text)", fontWeight: 600 }}>Owner</strong><br />{doc.owner}</div>}
              {ver && <div style={{ marginTop: 8 }}><strong style={{ color: "var(--text)", fontWeight: 600 }}>Version</strong><br />{ver.versionName || `v${ver.version}`}</div>}
              <div style={{ marginTop: 8 }}><strong style={{ color: "var(--text)", fontWeight: 600 }}>Updated</strong><br />{formatDate(doc.updatedAt)}</div>
              <div style={{ marginTop: 8 }}><strong style={{ color: "var(--text)", fontWeight: 600 }}>Type</strong><br />{DOC_TYPE_LABELS[doc.docType as keyof typeof DOC_TYPE_LABELS] || doc.docType}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
