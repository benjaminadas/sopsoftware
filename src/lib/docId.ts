import { prisma } from "./prisma";

// Generate a structured doc ID like SOP-SYS-IG-002 or SYS-VARS-FB-003-FB
export async function generateDocId(prefix: string): Promise<string> {
  const counter = await prisma.$transaction(async (tx) => {
    const existing = await tx.counter.findUnique({ where: { id: prefix } });
    if (!existing) {
      return tx.counter.create({ data: { id: prefix, value: 1 } });
    }
    return tx.counter.update({
      where: { id: prefix },
      data: { value: { increment: 1 } },
    });
  });

  return `${prefix}-${String(counter.value).padStart(3, "0")}`;
}

// Build a doc ID prefix from type + platform, e.g. SOP-SYS-IG or SYS-VARS-FB
export function buildDocIdPrefix(docType: string, platform?: string): string {
  const typeCode: Record<string, string> = {
    SOP: "SOP-SYS",
    GLOBAL_VARS: "SYS-VARS",
    LEARNINGS: "SYS-LEARN",
    METRICS: "SYS-MET",
    TEMPLATE_DOC: "SYS-TPL",
  };

  const platformCode = platform ? `-${platform.toUpperCase()}` : "";
  const base = typeCode[docType] || "DOC";
  return `${base}${platformCode}`;
}
