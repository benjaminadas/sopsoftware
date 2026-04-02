import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateDocumentSchema } from "@/lib/validations";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const document = await prisma.document.findUnique({
    where: { id },
    include: {
      tags: { include: { tag: true } },
      project: true,
      versions: { orderBy: { version: "desc" }, take: 1 },
      _count: { select: { versions: true } },
    },
  });

  if (!document) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(document);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const parsed = updateDocumentSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { tagIds, ...rest } = parsed.data;

  const document = await prisma.document.update({
    where: { id },
    data: {
      ...rest,
      ...(tagIds !== undefined && {
        tags: {
          deleteMany: {},
          create: tagIds.map((tagId) => ({ tagId })),
        },
      }),
    },
    include: {
      tags: { include: { tag: true } },
      project: true,
      _count: { select: { versions: true } },
    },
  });

  return NextResponse.json(document);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const existing = await prisma.document.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.document.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
