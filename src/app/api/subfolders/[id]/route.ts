import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { name, description } = body;
  if (!name?.trim()) return NextResponse.json({ error: "Name required" }, { status: 400 });
  const updated = await prisma.subfolder.update({
    where: { id },
    data: { name: name.trim(), description: description?.trim() || null },
  });
  return NextResponse.json(updated);
}
