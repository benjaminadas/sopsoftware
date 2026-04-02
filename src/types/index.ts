import type { Document, DocVersion, Tag, Template, Project } from "@prisma/client";

export type DocumentWithMeta = Document & {
  tags: { tag: Tag }[];
  project: Project | null;
  _count: { versions: number };
};

export type DocumentWithCurrentVersion = Document & {
  tags: { tag: Tag }[];
  project: Project | null;
  versions: DocVersion[];
  _count: { versions: number };
};

export type DocVersionSummary = Pick<
  DocVersion,
  "id" | "documentId" | "version" | "versionName" | "changeNote" | "createdAt" | "createdBy"
>;

export type { DocType, Platform } from "@/lib/validations";
export { DOC_TYPES, DOC_TYPE_LABELS, PLATFORMS } from "@/lib/validations";

export const DOC_TYPE_COLORS: Record<string, string> = {
  SOP: "bg-blue-100 text-blue-800",
  GLOBAL_VARS: "bg-purple-100 text-purple-800",
  LEARNINGS: "bg-green-100 text-green-800",
  METRICS: "bg-orange-100 text-orange-800",
  TEMPLATE_DOC: "bg-gray-100 text-gray-600",
};

export const DOC_TYPE_ICONS: Record<string, string> = {
  SOP: "📋",
  GLOBAL_VARS: "🔧",
  LEARNINGS: "🧪",
  METRICS: "📊",
  TEMPLATE_DOC: "📄",
};

export const PLATFORM_COLORS: Record<string, string> = {
  FB: "bg-blue-600 text-white",
  IG: "bg-pink-500 text-white",
  General: "bg-gray-500 text-white",
  Other: "bg-gray-400 text-white",
};
