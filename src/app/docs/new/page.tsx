"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { DOC_TYPES, DOC_TYPE_LABELS } from "@/lib/validations";
import { TEMPLATE_BY_TYPE } from "@/lib/templates";

type Subfolder = { id: string; name: string; slug: string; category: { id: string; name: string; slug: string } };

function NewDocPageInner() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const preSubId     = searchParams.get("subfolderID") || "";

  const [step, setStep]     = useState<"meta" | "content">("meta");
  const [docType, setDocType] = useState("SOP");
  const [content, setContent] = useState(() => TEMPLATE_BY_TYPE["SOP"]);
  const [saving,  setSaving]  = useState(false);
  const [subfolders, setSubfolders] = useState<Subfolder[]>([]);

  const [form, setForm] = useState({
    name: "", description: "", owner: "Ben Adams",
    funnelStage: "General", department: "", channel: "", platform: "",
    versionName: "v1.0", changeNote: "", subfolderID: preSubId,
  });

  useEffect(() => {
    // Fetch all subfolders for the picker
    fetch("/api/categories").then(r => r.json()).then((cats: Array<{ id: string; name: string; slug: string; subfolders: Subfolder[] }>) => {
      const all: Subfolder[] = cats.flatMap(cat =>
        cat.subfolders.map(sf => ({ ...sf, category: { id: cat.id, name: cat.name, slug: cat.slug } }))
      );
      setSubfolders(all);
    });
  }, []);

  const handleContentChange = useCallback((json: string) => setContent(json), []);

  function setF(k: string, v: string) { setForm(prev => ({ ...prev, [k]: v })); }

  async function handleSave() {
    if (!form.name.trim()) { alert("Document name is required"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/sops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name, description: form.description,
          docType, owner: form.owner, funnelStage: form.funnelStage,
          department: form.department || undefined, channel: form.channel || undefined,
          platform: form.platform || undefined,
          versionName: form.versionName, changeNote: form.changeNote || undefined,
          content, subfolderID: form.subfolderID || undefined,
        }),
      });
      if (!res.ok) { alert("Failed to create document"); return; }
      const data = await res.json();
      router.push(`/docs/${data.id}`);
    } finally {
      setSaving(false);
    }
  }

  const inp = (label: string, key: string, opts?: { placeholder?: string; required?: boolean }) => (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text)", marginBottom: 5 }}>{label}{opts?.required && <span style={{ color: "red" }}> *</span>}</label>
      <input
        value={form[key as keyof typeof form] as string}
        onChange={e => setF(key, e.target.value)}
        placeholder={opts?.placeholder}
        style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--card)", color: "var(--text)", fontSize: 13, boxSizing: "border-box", outline: "none" }}
      />
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Topbar */}
      <div style={{ borderBottom: "1px solid var(--border)", background: "var(--bg)", padding: "10px 24px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        <Link href="/" style={{ color: "var(--muted)", display: "flex", textDecoration: "none" }}><ArrowLeft size={18} /></Link>
        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>New Document</span>

        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          {step === "content" && (
            <button onClick={() => setStep("meta")} style={{ fontSize: 13, padding: "7px 14px", borderRadius: 6, border: "1px solid var(--border)", background: "none", color: "var(--muted)", cursor: "pointer" }}>
              ← Back
            </button>
          )}
          {step === "meta" ? (
            <button onClick={() => { if (!form.name.trim()) { alert("Enter a name first"); return; } setStep("content"); }} style={{ fontSize: 13, fontWeight: 600, padding: "7px 14px", borderRadius: 6, background: "var(--text)", color: "var(--bg)", border: "none", cursor: "pointer" }}>
              Continue →
            </button>
          ) : (
            <button onClick={handleSave} disabled={saving} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, padding: "7px 14px", borderRadius: 6, background: "var(--accent)", color: "#fff", border: "none", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}>
              <Save size={13} /> {saving ? "Saving…" : "Save Document"}
            </button>
          )}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {step === "meta" ? (
          <div style={{ maxWidth: 560, margin: "0 auto", padding: "32px 24px" }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 24px", color: "var(--text)" }}>Document Details</h2>

            {/* Doc type */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text)", marginBottom: 8 }}>Document Type</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {DOC_TYPES.map(t => (
                  <button key={t} onClick={() => { setDocType(t); setContent(TEMPLATE_BY_TYPE[t] || TEMPLATE_BY_TYPE["SOP"]); }}
                    style={{ padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, border: "1px solid var(--border)", cursor: "pointer", background: docType === t ? "var(--text)" : "var(--card)", color: docType === t ? "var(--bg)" : "var(--muted)" }}>
                    {DOC_TYPE_LABELS[t as keyof typeof DOC_TYPE_LABELS]}
                  </button>
                ))}
              </div>
            </div>

            {inp("Document Name", "name", { required: true, placeholder: "e.g. FB Outreach Account Setup SOP" })}
            {inp("Description", "description", { placeholder: "Brief summary of this document" })}
            {inp("Owner", "owner", { placeholder: "e.g. Ben Adams" })}
            {inp("Version Name", "versionName", { placeholder: "e.g. v1.0" })}

            {/* Subfolder picker */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text)", marginBottom: 5 }}>Folder (optional)</label>
              <select
                value={form.subfolderID}
                onChange={e => setF("subfolderID", e.target.value)}
                style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--card)", color: "var(--text)", fontSize: 13, boxSizing: "border-box", outline: "none" }}
              >
                <option value="">— No folder —</option>
                {subfolders.map(sf => (
                  <option key={sf.id} value={sf.id}>{sf.category.name} › {sf.name}</option>
                ))}
              </select>
            </div>

            {inp("Funnel Stage", "funnelStage", { placeholder: "e.g. Setup & Infrastructure" })}
            {inp("Channel", "channel", { placeholder: "e.g. Facebook DM" })}
            {inp("Platform", "platform", { placeholder: "e.g. FB, IG" })}
            {inp("Department", "department", { placeholder: "e.g. Systems / Operations" })}
          </div>
        ) : (
          <div style={{ padding: "24px clamp(24px, 6vw, 80px)" }}>
            <div style={{ marginBottom: 16, padding: "10px 14px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 12, color: "var(--muted)" }}>
              <strong style={{ color: "var(--text)" }}>{form.name}</strong> · {DOC_TYPE_LABELS[docType as keyof typeof DOC_TYPE_LABELS]} · {form.owner || "—"}
            </div>
            <RichTextEditor content={content} onChange={handleContentChange} placeholder="Write your document content here…" />
          </div>
        )}
      </div>
    </div>
  );
}

export default function NewDocPage() {
  return (
    <Suspense fallback={<div style={{ padding: 32, color: "var(--muted)" }}>Loading…</div>}>
      <NewDocPageInner />
    </Suspense>
  );
}
