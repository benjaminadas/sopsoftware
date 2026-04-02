"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { DOC_TYPES, DOC_TYPE_LABELS, PLATFORMS } from "@/lib/validations";
import { DOC_TYPE_COLORS, DOC_TYPE_ICONS } from "@/types";
import { TEMPLATE_BY_TYPE } from "@/lib/templates";
import { cn } from "@/lib/utils";

const FUNNEL_STAGE_SUGGESTIONS = [
  "Setup & Infrastructure",
  "Global – Messaging & Booking",
  "Knowledge Base – Outreach",
  "Warm-up & Account Reputation",
  "Lead Gen & Targeting",
  "Messaging & Deliverability",
  "Conversion",
  "Onboarding",
  "Scaling & Ops",
  "General",
];

export default function NewDocumentPage() {
  const router = useRouter();
  const [step, setStep] = useState<"type" | "meta" | "content">("type");
  const [docType, setDocType] = useState("SOP");
  const [content, setContent] = useState(() => TEMPLATE_BY_TYPE["SOP"]);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    funnelStage: "General",
    owner: "Ben Adams",
    department: "",
    channel: "",
    platform: "FB",
    versionName: "v1.0",
    changeNote: "Initial version",
    projectId: "",
  });

  function selectDocType(type: string) {
    setDocType(type);
    setContent(TEMPLATE_BY_TYPE[type] || TEMPLATE_BY_TYPE["SOP"]);
    setStep("meta");
  }

  function handleFormChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  const handleContentChange = useCallback((json: string) => {
    setContent(json);
  }, []);

  async function handleSave() {
    if (!form.name.trim()) {
      alert("Please enter a document name.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/sops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          docType,
          content,
          tagIds: [],
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert("Error creating document: " + JSON.stringify(err));
        return;
      }

      const doc = await res.json();
      router.push(`/sops/${doc.id}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/sops" className="text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>New Document</span>
            {step !== "type" && (
              <>
                <span>/</span>
                <span className="text-gray-900 font-medium">{DOC_TYPE_LABELS[docType as keyof typeof DOC_TYPE_LABELS]}</span>
              </>
            )}
          </div>

          {/* Steps */}
          <div className="ml-auto flex items-center gap-2">
            {["type", "meta", "content"].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={cn(
                  "h-6 w-6 rounded-full flex items-center justify-center text-xs font-semibold",
                  step === s ? "bg-gray-900 text-white" :
                  ["type", "meta", "content"].indexOf(step) > i ? "bg-green-500 text-white" :
                  "bg-gray-200 text-gray-500"
                )}>
                  {i + 1}
                </div>
                {i < 2 && <div className="w-6 h-px bg-gray-200" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step 1: Choose document type */}
      {step === "type" && (
        <div className="max-w-3xl mx-auto px-6 py-12">
          <div className="text-center mb-10">
            <Sparkles className="h-10 w-10 text-gray-400 mx-auto mb-3" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">What are you creating?</h1>
            <p className="text-gray-500">Choose a document type to get the right template</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DOC_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => selectDocType(type)}
                className="text-left border border-gray-200 rounded-xl p-5 hover:border-gray-900 hover:shadow-sm bg-white transition-all group"
              >
                <div className="text-3xl mb-3">{DOC_TYPE_ICONS[type]}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{DOC_TYPE_LABELS[type as keyof typeof DOC_TYPE_LABELS]}</h3>
                <p className="text-sm text-gray-500">
                  {type === "SOP" && "Purpose, Scope, Roles, Tools, Definitions, Procedure – everything structured"}
                  {type === "GLOBAL_VARS" && "Outreach scripts: Trojan Horse Copy, VSL, Calendly Message, and more"}
                  {type === "LEARNINGS" && "Inbox, hypotheses, experiment log, change log – single source of truth"}
                  {type === "METRICS" && "Key metrics, weekly tracking, and performance data"}
                  {type === "TEMPLATE_DOC" && "A blank, reusable document template"}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Document metadata */}
      {step === "meta" && (
        <div className="max-w-2xl mx-auto px-6 py-10">
          <h1 className="text-xl font-bold text-gray-900 mb-6">Document Details</h1>

          <div className="space-y-4 bg-white border border-gray-200 rounded-xl p-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Document Name *</label>
              <input
                value={form.name}
                onChange={(e) => handleFormChange("name", e.target.value)}
                placeholder={
                  docType === "SOP" ? "e.g. Instagram Account Environment & Profile Setup" :
                  docType === "GLOBAL_VARS" ? "e.g. v3.0 FB Outreach System Global Variables" :
                  docType === "LEARNINGS" ? "e.g. Outreach Learnings & Hypotheses (FB)" :
                  "Document name"
                }
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => handleFormChange("description", e.target.value)}
                placeholder="Brief description of what this document covers..."
                rows={2}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                <select
                  value={form.platform}
                  onChange={(e) => handleFormChange("platform", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                  {PLATFORMS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Version Name</label>
                <input
                  value={form.versionName}
                  onChange={(e) => handleFormChange("versionName", e.target.value)}
                  placeholder="v1.0"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Funnel Stage</label>
              <input
                value={form.funnelStage}
                onChange={(e) => handleFormChange("funnelStage", e.target.value)}
                placeholder="e.g. Global – Messaging & Booking"
                list="funnel-stages"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
              <datalist id="funnel-stages">
                {FUNNEL_STAGE_SUGGESTIONS.map((s) => <option key={s} value={s} />)}
              </datalist>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Owner *</label>
                <input
                  value={form.owner}
                  onChange={(e) => handleFormChange("owner", e.target.value)}
                  placeholder="e.g. Ben Adams"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Channel</label>
                <input
                  value={form.channel}
                  onChange={(e) => handleFormChange("channel", e.target.value)}
                  placeholder="e.g. Facebook DM"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
            </div>

            {docType === "SOP" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <input
                  value={form.department}
                  onChange={(e) => handleFormChange("department", e.target.value)}
                  placeholder="e.g. Systems / Operations"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setStep("type")}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={() => {
                if (!form.name.trim()) {
                  alert("Please enter a document name.");
                  return;
                }
                setStep("content");
              }}
              className="flex-1 py-2 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-700"
            >
              Continue to Content →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Content editor */}
      {step === "content" && (
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-lg font-bold text-gray-900">{form.name}</h1>
              <p className="text-xs text-gray-500">
                {DOC_TYPE_LABELS[docType as keyof typeof DOC_TYPE_LABELS]} · {form.platform} · {form.funnelStage}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setStep("meta")}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
              >
                {saving ? "Creating..." : "Create Document"}
              </button>
            </div>
          </div>

          <RichTextEditor
            content={content}
            onChange={handleContentChange}
            placeholder="Write your document content here..."
          />
        </div>
      )}
    </div>
  );
}
