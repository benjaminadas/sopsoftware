import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Edit, Clock, GitBranch, User, FileText, Folder, History } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ReadOnlyContent } from "@/components/editor/ReadOnlyContent";
import { DOC_TYPE_LABELS, PLATFORMS } from "@/lib/validations";
import { DOC_TYPE_COLORS, DOC_TYPE_ICONS, PLATFORM_COLORS } from "@/types";
import { formatDate, formatDateTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { DeleteDocButton } from "@/components/sops/DeleteDocButton";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DocDetailPage({ params }: PageProps) {
  const { id } = await params;

  const doc = await prisma.document.findUnique({
    where: { id },
    include: {
      tags: { include: { tag: true } },
      project: true,
      versions: { orderBy: { version: "desc" }, take: 1 },
      _count: { select: { versions: true } },
    },
  });

  if (!doc) notFound();

  const currentVersion = doc.versions[0];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center gap-4">
          <Link href="/sops" className="text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>

          {doc.project && (
            <>
              <Link
                href={`/sops?projectId=${doc.project.id}`}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
              >
                <Folder className="h-4 w-4" />
                {doc.project.name}
              </Link>
              <span className="text-gray-300">/</span>
            </>
          )}

          <span className="text-sm font-medium text-gray-900 truncate">{doc.name}</span>

          <div className="ml-auto flex items-center gap-2">
            <Link
              href={`/sops/${id}/versions`}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <History className="h-4 w-4" />
              History ({doc._count.versions})
            </Link>
            <Link
              href={`/sops/${id}/edit`}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Link>
            <DeleteDocButton docId={id} docName={doc.name} />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Doc header card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-sm font-bold bg-gray-100 px-3 py-1 rounded text-gray-700">
                {doc.docId}
              </span>
              {doc.platform && (
                <span className={cn("text-xs font-bold px-2.5 py-1 rounded", PLATFORM_COLORS[doc.platform] || "bg-gray-200 text-gray-700")}>
                  {doc.platform}
                </span>
              )}
              <span className={cn("text-xs font-medium px-2.5 py-1 rounded-full", DOC_TYPE_COLORS[doc.docType] || "bg-gray-100")}>
                {DOC_TYPE_ICONS[doc.docType]} {DOC_TYPE_LABELS[doc.docType as keyof typeof DOC_TYPE_LABELS] || doc.docType}
              </span>
              {currentVersion && (
                <span className="text-xs font-semibold bg-green-100 text-green-800 px-2.5 py-1 rounded-full">
                  {currentVersion.versionName || `v${currentVersion.version}`}
                </span>
              )}
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">{doc.name}</h1>
          {doc.description && <p className="text-gray-600 text-sm mb-4">{doc.description}</p>}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-100">
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Owner</p>
              <p className="text-sm text-gray-700 flex items-center gap-1"><User className="h-3.5 w-3.5" />{doc.owner}</p>
            </div>
            {doc.funnelStage && (
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Funnel Stage</p>
                <p className="text-sm text-gray-700">{doc.funnelStage}</p>
              </div>
            )}
            {doc.channel && (
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Channel</p>
                <p className="text-sm text-gray-700">{doc.channel}</p>
              </div>
            )}
            {doc.department && (
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Department</p>
                <p className="text-sm text-gray-700">{doc.department}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Date Created</p>
              <p className="text-sm text-gray-700 flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{formatDate(doc.createdAt)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Last Updated</p>
              <p className="text-sm text-gray-700">{formatDate(doc.updatedAt)}</p>
            </div>
          </div>

          {doc.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-gray-100">
              {doc.tags.map(({ tag }) => (
                <span key={tag.id} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Document content */}
        {currentVersion ? (
          <div className="bg-white border border-gray-200 rounded-xl p-8">
            {currentVersion.changeNote && (
              <div className="mb-6 pb-6 border-b border-gray-100 flex items-center gap-2 text-sm text-gray-500">
                <GitBranch className="h-4 w-4" />
                <span className="font-medium">{currentVersion.versionName || `v${currentVersion.version}`}:</span>
                <span>{currentVersion.changeNote}</span>
                <span className="ml-auto text-xs text-gray-400">{formatDateTime(currentVersion.createdAt)} by {currentVersion.createdBy}</span>
              </div>
            )}
            <ReadOnlyContent content={currentVersion.content} />
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-400">
            <FileText className="h-8 w-8 mx-auto mb-2" />
            <p>No content yet. Click Edit to add content.</p>
          </div>
        )}
      </div>
    </div>
  );
}
