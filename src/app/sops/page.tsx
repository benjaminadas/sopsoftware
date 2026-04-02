import Link from "next/link";
import { PlusCircle, Search, Folder } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { DocCard } from "@/components/sops/DocCard";
import { DOC_TYPES, DOC_TYPE_LABELS } from "@/lib/validations";
import { PLATFORMS } from "@/lib/validations";
import { DocumentWithMeta } from "@/types";

interface PageProps {
  searchParams: Promise<{
    q?: string;
    docType?: string;
    platform?: string;
    projectId?: string;
  }>;
}

export default async function SopsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = params.q || "";
  const docType = params.docType || "";
  const platform = params.platform || "";
  const projectId = params.projectId || "";

  const where: Record<string, unknown> = {};
  if (docType && docType !== "ALL") where.docType = docType;
  if (platform && platform !== "ALL") where.platform = platform;
  if (projectId) where.projectId = projectId;
  if (q) {
    where.OR = [
      { name: { contains: q } },
      { description: { contains: q } },
      { docId: { contains: q } },
      { owner: { contains: q } },
    ];
  }

  const [documents, projects] = await Promise.all([
    prisma.document.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      include: {
        tags: { include: { tag: true } },
        project: true,
        _count: { select: { versions: true } },
      },
    }),
    prisma.project.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { documents: true } } },
    }),
  ]);

  const activeProject = projectId ? projects.find((p) => p.id === projectId) : null;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {activeProject ? activeProject.name : "All Documents"}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {documents.length} document{documents.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/sops/new"
          className="flex items-center gap-2 bg-gray-900 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          <PlusCircle className="h-4 w-4" />
          New Document
        </Link>
      </div>

      <div className="flex gap-6">
        {/* Sidebar: Projects */}
        <aside className="w-56 shrink-0">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Projects</p>
          <ul className="space-y-1">
            <li>
              <Link
                href="/sops"
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                  !projectId ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Folder className="h-4 w-4" />
                  All
                </span>
                <span className="text-xs opacity-60">{documents.length}</span>
              </Link>
            </li>
            {projects.map((project) => (
              <li key={project.id}>
                <Link
                  href={`/sops?projectId=${project.id}`}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                    projectId === project.id
                      ? "bg-gray-900 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <Folder className="h-4 w-4 shrink-0" />
                    <span className="truncate">{project.name}</span>
                  </span>
                  <span className="text-xs opacity-60">{project._count.documents}</span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Filters */}
          <div className="flex items-center gap-3 mb-5 flex-wrap">
            {/* Search */}
            <form method="get" className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                name="q"
                defaultValue={q}
                placeholder="Search..."
                className="pl-9 pr-3 h-9 w-56 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
              {projectId && <input type="hidden" name="projectId" value={projectId} />}
            </form>

            {/* Doc type filter */}
            <div className="flex items-center gap-1 flex-wrap">
              <Link
                href={`/sops?${new URLSearchParams({ ...(q && { q }), ...(projectId && { projectId }) }).toString()}`}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  !docType ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                All Types
              </Link>
              {DOC_TYPES.map((type) => (
                <Link
                  key={type}
                  href={`/sops?${new URLSearchParams({ docType: type, ...(q && { q }), ...(projectId && { projectId }) }).toString()}`}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    docType === type
                      ? "bg-gray-900 text-white"
                      : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {DOC_TYPE_LABELS[type]}
                </Link>
              ))}
            </div>
          </div>

          {/* Document grid */}
          {documents.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg mb-2">No documents found</p>
              <p className="text-gray-400 text-sm mb-6">
                {q ? `No results for "${q}"` : "Create your first document to get started"}
              </p>
              <Link
                href="/sops/new"
                className="inline-flex items-center gap-2 bg-gray-900 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-700"
              >
                <PlusCircle className="h-4 w-4" />
                New Document
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {documents.map((doc) => (
                <DocCard key={doc.id} doc={doc as DocumentWithMeta} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
