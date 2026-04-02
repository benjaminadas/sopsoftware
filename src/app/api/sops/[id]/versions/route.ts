import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonToText } from "@/lib/tiptap";
import { createVersionSchema } from "@/lib/validations";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const doc = await prisma.document.findUnique({ where: { id } });
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const versions = await prisma.docVersion.findMany({
    where: { documentId: id },
    orderBy: { version: "desc" },
    select: {
      id: true,
      documentId: true,
      version: true,
      versionName: true,
      changeNote: true,
      createdAt: true,
      createdBy: true,
    },
  });

  return NextResponse.json(versions);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const parsed = createVersionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { content, versionName, changeNote, createdBy } = parsed.data;

  const doc = await prisma.document.findUnique({ where: { id } });
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const newVersionNumber = doc.currentVersion + 1;
  const contentText = jsonToText(content);
  const autoVersionName = versionName || `v${newVersionNumber}.0`;

  const [version] = await prisma.$transaction([
    prisma.docVersion.create({
      data: {
        documentId: id,
        version: newVersionNumber,
        versionName: autoVersionName,
        content,
        contentText,
        changeNote,
        createdBy,
      },
    }),
    prisma.document.update({
      where: { id },
      data: { currentVersion: newVersionNumber },
    }),
  ]);

  return NextResponse.json(version, { status: 201 });
}
