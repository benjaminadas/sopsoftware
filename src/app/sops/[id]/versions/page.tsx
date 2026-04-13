export const dynamic = "force-dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, GitBranch, Clock, User, Eye, RotateCcw } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/utils";
import { RestoreVersionButton } from "@/components/sops/RestoreVersionButton";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function VersionHistoryPage({ params }: PageProps) {
  const { id } = await params;

  const doc = await prisma.document.findUnique({ where: { id } });
  if (!doc) notFound();

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-3xl mx-auto px-6 py-3 flex items-center gap-4">
          <Link href={`/sops/${id}`} className="text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <span className="text-sm font-medium text-gray-900">{doc.name}</span>
            <p className="text-xs text-gray-400">Version History</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Version History
          </h1>
          <span className="text-sm text-gray-500">{versions.length} versions</span>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200" />

          <div className="space-y-4">
            {versions.map((version, index) => {
              const isCurrent = version.version === doc.currentVersion;
              return (
                <div key={version.id} className="relative pl-12">
                  {/* Dot */}
                  <div className={`absolute left-0 top-4 h-8 w-8 rounded-full flex items-center justify-center border-2 ${
                    isCurrent ? "bg-gray-900 border-gray-900 text-white" : "bg-white border-gray-300 text-gray-500"
                  }`}>
                    <span className="text-xs font-bold">{version.versionName?.replace("v", "") || version.version}</span>
                  </div>

                  <div className={`bg-white border rounded-xl p-4 ${isCurrent ? "border-gray-900 shadow-sm" : "border-gray-200"}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-semibold text-gray-900">
                            {version.versionName || `v${version.version}`}
                          </span>
                          {isCurrent && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">
                              Current
                            </span>
                          )}
                          {index === 0 && !isCurrent && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium">
                              Latest
                            </span>
                          )}
                        </div>

                        {version.changeNote && (
                          <p className="text-sm text-gray-600 mb-2">{version.changeNote}</p>
                        )}

                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDateTime(version.createdAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {version.createdBy}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Link
                          href={`/sops/${id}/versions/${version.version}`}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </Link>
                        {!isCurrent && (
                          <RestoreVersionButton docId={id} version={version.version} versionName={version.versionName} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
