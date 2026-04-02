"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw } from "lucide-react";

interface RestoreVersionButtonProps {
  docId: string;
  version: number;
  versionName: string | null;
}

export function RestoreVersionButton({ docId, version, versionName }: RestoreVersionButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleRestore() {
    if (!confirm(`Branch from ${versionName || `v${version}`}? This will create a new version based on this one.`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/sops/${docId}/versions/${version}/restore`, { method: "POST" });
      if (!res.ok) {
        alert("Failed to restore version");
        return;
      }
      router.push(`/sops/${docId}/edit`);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleRestore}
      disabled={loading}
      title={`Branch from ${versionName || `v${version}`}`}
      className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
    >
      <RotateCcw className="h-3.5 w-3.5" />
      Branch from here
    </button>
  );
}
