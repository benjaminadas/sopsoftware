import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateDocId, buildDocIdPrefix } from "@/lib/docId";
import { jsonToText } from "@/lib/tiptap";
import { createDocumentSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const docType = searchParams.get("docType") || "";
  const platform = searchParams.get("platform") || "";
  const projectId = searchParams.get("projectId") || "";
  const tag = searchParams.get("tag") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "30");
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  if (docType && docType !== "ALL") where.docType = docType;
  if (platform && platform !== "ALL") where.platform = platform;
  if (projectId) where.projectId = projectId;
  if (tag) where.tags = { some: { tag: { slug: tag } } };

  if (q) {
    where.OR = [
      { name: { contains: q } },
      { description: { contains: q } },
      { docId: { contains: q } },
      { owner: { contains: q } },
      { funnelStage: { contains: q } },
    ];
  }

  const [documents, total] = await Promise.all([
    prisma.document.findMany({
      where,
      skip,
      take: limit,
      orderBy: { updatedAt: "desc" },
      include: {
        tags: { include: { tag: true } },
        project: true,
        _count: { select: { versions: true } },
      },
    }),
    prisma.document.count({ where }),
  ]);

  return NextResponse.json({ documents, total, page, limit });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = createDocumentSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const {
    name, description, docType, funnelStage, owner, department, channel,
    platform, content, versionName, changeNote, projectId, tagIds,
  } = parsed.data;

  const prefix = buildDocIdPrefix(docType, platform || undefined);
  const docId = await generateDocId(prefix);
  const contentText = jsonToText(content);

  const document = await prisma.document.create({
    data: {
      docId,
      name,
      description,
      docType,
      funnelStage,
      owner,
      department,
      channel,
      platform,
      projectId: projectId || null,
      currentVersion: 1,
      versions: {
        create: {
          version: 1,
          versionName: versionName || "v1.0",
          content,
          contentText,
          changeNote: changeNote || "Initial version",
          createdBy: owner,
        },
      },
      tags: tagIds.length > 0
        ? { create: tagIds.map((tagId) => ({ tagId })) }
        : undefined,
    },
    include: {
      versions: true,
      tags: { include: { tag: true } },
      project: true,
    },
  });

  return NextResponse.json(document, { status: 201 });
}
