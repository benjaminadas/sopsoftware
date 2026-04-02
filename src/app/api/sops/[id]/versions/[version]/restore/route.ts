import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonToText } from "@/lib/tiptap";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; version: string }> }
) {
  const { id, version } = await params;
  const versionNum = parseInt(version);
  if (isNaN(versionNum)) return NextResponse.json({ error: "Invalid version" }, { status: 400 });

  const doc = await prisma.document.findUnique({ where: { id } });
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const oldVersion = await prisma.docVersion.findUnique({
    where: { documentId_version: { documentId: id, version: versionNum } },
  });
  if (!oldVersion) return NextResponse.json({ error: "Version not found" }, { status: 404 });

  const newVersionNumber = doc.currentVersion + 1;
  const autoVersionName = `v${newVersionNumber}.0`;

  const [newVersion] = await prisma.$transaction([
    prisma.docVersion.create({
      data: {
        documentId: id,
        version: newVersionNumber,
        versionName: autoVersionName,
        content: oldVersion.content,
        contentText: jsonToText(oldVersion.content),
        changeNote: `Restored from ${oldVersion.versionName || `version ${versionNum}`}`,
        createdBy: "Admin",
      },
    }),
    prisma.document.update({
      where: { id },
      data: { currentVersion: newVersionNumber },
    }),
  ]);

  return NextResponse.json(newVersion, { status: 201 });
}
