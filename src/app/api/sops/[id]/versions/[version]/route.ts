import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; version: string }> }
) {
  const { id, version } = await params;
  const versionNum = parseInt(version);
  if (isNaN(versionNum)) return NextResponse.json({ error: "Invalid version" }, { status: 400 });

  const docVersion = await prisma.docVersion.findUnique({
    where: { documentId_version: { documentId: id, version: versionNum } },
  });

  if (!docVersion) return NextResponse.json({ error: "Version not found" }, { status: 404 });
  return NextResponse.json(docVersion);
}
