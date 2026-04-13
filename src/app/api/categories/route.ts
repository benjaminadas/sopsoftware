import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: {
      subfolders: {
        orderBy: { order: "asc" },
        select: { id: true, name: true, slug: true, description: true, group: true, order: true },
      },
    },
  });
  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { name, slug, description, icon } = body;
  if (!name || !slug) return NextResponse.json({ error: "name and slug required" }, { status: 400 });

  const maxOrder = await prisma.category.aggregate({ _max: { order: true } });
  const order = (maxOrder._max.order ?? -1) + 1;

  const cat = await prisma.category.create({ data: { name, slug, description, icon, order } });
  return NextResponse.json(cat, { status: 201 });
}
