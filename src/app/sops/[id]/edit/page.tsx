"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, GitBranch } from "lucide-react";
import { RichTextEditor } from "@/components/editor/RichTextEditor";

interface DocData {
  id: string;
  name: string;
  docId: string;
  currentVersion: number;
  versions: Array<{
    version: number;
    versionName: string | null;
    content: string;
  }>;
}

export default function EditDocPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [doc, setDoc] = useState<DocData | null>(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [changeNote, setChangeNote] = useState("");
  const [versionName, setVersionName] = useState("");

  useEffect(() => {
    fetch(`/api/sops/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setDoc(data);
        const current = data.versions?.[0];
        if (current) {
          setContent(current.content);
          const nextV = data.currentVersion + 1;
          setVersionName(`v${nextV}.0`);
        }
        setLoading(false);
      });
  }, [id]);

  const handleContentChange = useCallback((json: string) => {
    setContent(json);
  }, []);

  async function handleSaveVersion() {
    setSaving(true);
    try {
      const res = await fetch(`/api/sops/${id}/versions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          versionName,
          changeNote: changeNote || undefined,
          createdBy: doc?.name || "Admin",
        }),
      });

      if (!res.ok) {
        alert("Failed to save version");
        return;
      }

      router.push(`/sops/${id}`);
      router.refresh();
    } finally {
      setSaving(false);
      setShowSaveDialog(false);
    }
  }

  // Cmd+S shortcut
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        setShowSaveDialog(true);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!doc) return <div>Document not found</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center gap-4">
          <Link href={`/sops/${id}`} className="text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium text-gray-900 truncate">{doc.name}</span>
            <span className="text-xs text-gray-400">{doc.docId} · Currently at v{doc.currentVersion}</span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-gray-400 hidden sm:block">⌘S to save</span>
            <button
              onClick={() => setShowSaveDialog(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Save className="h-4 w-4" />
              Save as New Version
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6">
        <RichTextEditor
          content={content}
          onChange={handleContentChange}
          placeholder="Write your document content here..."
        />
      </div>

      {/* Save version dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <div className="flex items-center gap-2 mb-4">
              <GitBranch className="h-5 w-5 text-gray-500" />
              <h2 className="text-lg font-semibold text-gray-900">Save New Version</h2>
            </div>

            <p className="text-sm text-gray-500 mb-4">
              This will create a new version of <strong>{doc.name}</strong>. The previous version will remain in history.
            </p>

            <div className="space-y-3 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Version Name</label>
                <input
                  value={versionName}
                  onChange={(e) => setVersionName(e.target.value)}
                  placeholder="e.g. v4.0"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">What changed? (optional)</label>
                <textarea
                  value={changeNote}
                  onChange={(e) => setChangeNote(e.target.value)}
                  placeholder="e.g. Updated Trojan Horse Copy, new VSL script format"
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="flex-1 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveVersion}
                disabled={saving}
                className="flex-1 py-2 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Version"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
