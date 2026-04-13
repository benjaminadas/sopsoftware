"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { RichTextEditor } from "@/components/editor/RichTextEditor";

interface DocData {
  id: string;
  name: string;
  docId: string;
  currentVersion: number;
  versions: Array<{ version: number; versionName: string | null; content: string }>;
}

export default function EditDocPage() {
  const params    = useParams();
  const router    = useRouter();
  const id        = params.id as string;

  const [doc,  setDoc]  = useState<DocData | null>(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [changeNote, setChangeNote] = useState("");
  const [versionName, setVersionName] = useState("");

  useEffect(() => {
    fetch(`/api/sops/${id}`).then(r => r.json()).then(data => {
      setDoc(data);
      const cur = data.versions?.[0];
      if (cur) {
        setContent(cur.content);
        setVersionName(`v${data.currentVersion + 1}.0`);
      }
      setLoading(false);
    });
  }, [id]);

  const handleContentChange = useCallback((json: string) => setContent(json), []);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/sops/${id}/versions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, versionName, changeNote: changeNote || undefined, createdBy: "Admin" }),
      });
      if (!res.ok) { alert("Failed to save"); return; }
      router.push(`/docs/${id}`);
      router.refresh();
    } finally {
      setSaving(false);
      setShowDialog(false);
    }
  }

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key === "s") { e.preventDefault(); setShowDialog(true); } };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, []);

  if (loading) return <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)" }}>Loading…</div>;
  if (!doc) return <div style={{ padding: 32, color: "var(--muted)" }}>Document not found.</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Sticky sub-topbar */}
      <div style={{ borderBottom: "1px solid var(--border)", background: "var(--bg)", padding: "10px 24px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        <Link href={`/docs/${id}`} style={{ color: "var(--muted)", display: "flex", textDecoration: "none" }}>
          <ArrowLeft size={18} />
        </Link>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.name}</div>
          <div style={{ fontSize: 11, color: "var(--muted)" }}>{doc.docId} · v{doc.currentVersion} current</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: "var(--muted)" }}>⌘S to save</span>
          <button
            onClick={() => setShowDialog(true)}
            style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, padding: "7px 14px", borderRadius: 6, background: "var(--text)", color: "var(--bg)", border: "none", cursor: "pointer" }}
          >
            <Save size={14} /> Save New Version
          </button>
        </div>
      </div>

      {/* Editor */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px clamp(24px, 6vw, 120px)" }}>
        <RichTextEditor content={content} onChange={handleContentChange} placeholder="Write your document content here…" />
      </div>

      {/* Save dialog */}
      {showDialog && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 16 }}>
          <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 12, padding: 24, width: "100%", maxWidth: 420, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, margin: "0 0 6px", color: "var(--text)" }}>Save New Version</h2>
            <p style={{ fontSize: 13, color: "var(--muted)", margin: "0 0 18px" }}>
              Creates a new version of <strong style={{ color: "var(--text)" }}>{doc.name}</strong>. Previous version stays in history.
            </p>

            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text)", marginBottom: 5 }}>Version name</label>
              <input
                value={versionName}
                onChange={e => setVersionName(e.target.value)}
                placeholder="e.g. v4.0"
                style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--card)", color: "var(--text)", fontSize: 13, boxSizing: "border-box", outline: "none" }}
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text)", marginBottom: 5 }}>What changed? (optional)</label>
              <textarea
                value={changeNote}
                onChange={e => setChangeNote(e.target.value)}
                placeholder="e.g. Updated VSL script, new Trojan Horse copy"
                rows={3}
                style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--card)", color: "var(--text)", fontSize: 13, boxSizing: "border-box", outline: "none", resize: "none" }}
              />
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setShowDialog(false)} style={{ flex: 1, padding: "9px", borderRadius: 6, border: "1px solid var(--border)", background: "none", color: "var(--muted)", fontSize: 13, cursor: "pointer" }}>
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving} style={{ flex: 1, padding: "9px", borderRadius: 6, background: "var(--text)", color: "var(--bg)", fontSize: 13, fontWeight: 600, border: "none", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.6 : 1 }}>
                {saving ? "Saving…" : "Save Version"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
