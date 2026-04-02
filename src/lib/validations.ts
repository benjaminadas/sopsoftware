import { z } from "zod";

export const DOC_TYPES = [
  "SOP",
  "GLOBAL_VARS",
  "LEARNINGS",
  "METRICS",
  "TEMPLATE_DOC",
] as const;

export type DocType = (typeof DOC_TYPES)[number];

export const DOC_TYPE_LABELS: Record<DocType, string> = {
  SOP: "Standard Operating Procedure",
  GLOBAL_VARS: "Global Variables / System",
  LEARNINGS: "Learnings & Hypotheses",
  METRICS: "Metrics Doc",
  TEMPLATE_DOC: "Template Document",
};

export const PLATFORMS = ["FB", "IG", "General", "Other"] as const;
export type Platform = (typeof PLATFORMS)[number];

export const createDocumentSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  description: z.string().max(500).optional(),
  docType: z.enum(DOC_TYPES).default("SOP"),
  funnelStage: z.string().max(100).default("General"),
  owner: z.string().min(1, "Owner is required").max(100),
  department: z.string().max(100).optional(),
  channel: z.string().max(100).optional(),
  platform: z.string().max(20).optional(),
  content: z.string().min(1, "Content is required"),
  versionName: z.string().max(20).optional(),
  changeNote: z.string().max(300).optional(),
  projectId: z.string().optional(),
  tagIds: z.array(z.string()).default([]),
});

export const updateDocumentSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(500).optional().nullable(),
  funnelStage: z.string().max(100).optional(),
  owner: z.string().min(1).max(100).optional(),
  department: z.string().max(100).optional().nullable(),
  channel: z.string().max(100).optional().nullable(),
  platform: z.string().max(20).optional().nullable(),
  projectId: z.string().optional().nullable(),
  tagIds: z.array(z.string()).optional(),
});

export const createVersionSchema = z.object({
  content: z.string().min(1, "Content is required"),
  versionName: z.string().max(20).optional(),
  changeNote: z.string().max(300).optional(),
  createdBy: z.string().max(100).default("Admin"),
});

export const createTemplateSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(500).optional(),
  docType: z.enum(DOC_TYPES).default("SOP"),
  content: z.string().min(1),
});

export const createProjectSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(500).optional(),
  platform: z.string().max(20).optional(),
});

export const createTagSchema = z.object({
  name: z.string().min(1).max(50),
});
