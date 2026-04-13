"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";

interface Props {
  subfolderId: string;
  initialName: string;
  initialDescription: string | null;
}

export function EditFolderButton({ subfolderId, initialName, initialDescription }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription || "");
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!name.trim()) return;
    setSaving(true);
    await fetch(`/api/subfolders/${subfolderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });
    setSaving(false);
    setOpen(false);
    router.refresh();
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          display: "flex", alignItems: "center", gap: 5, fontSize: 12,
          padding: "5px 10px", borderRadius: 6, border: "1px solid var(--border)",
          background: "none", color: "var(--muted)", cursor: "pointer",
        }}
      >
        <Pencil size={12} /> Edit folder
      </button>

      {open && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 100,
          background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center",
        }} onClick={() => setOpen(false)}>
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 10,
              padding: 24, width: 440, maxWidth: "90vw",
            }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", margin: "0 0 18px" }}>Edit Folder</h3>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text)", marginBottom: 5 }}>
                Folder Name <span style={{ color: "red" }}>*</span>
              </label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--card)", color: "var(--text)", fontSize: 13, boxSizing: "border-box", outline: "none" }}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text)", marginBottom: 5 }}>
                Description
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
                style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--card)", color: "var(--text)", fontSize: 13, boxSizing: "border-box", outline: "none", resize: "vertical" }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button onClick={() => setOpen(false)} style={{ padding: "7px 14px", borderRadius: 6, border: "1px solid var(--border)", background: "none", color: "var(--muted)", cursor: "pointer", fontSize: 13 }}>
                Cancel
              </button>
              <button onClick={save} disabled={saving || !name.trim()} style={{ padding: "7px 14px", borderRadius: 6, border: "none", background: "var(--text)", color: "var(--bg)", cursor: "pointer", fontSize: 13, fontWeight: 600, opacity: saving ? 0.7 : 1 }}>
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
