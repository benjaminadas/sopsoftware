export const dynamic = "force-dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, User, GitBranch } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ReadOnlyContent } from "@/components/editor/ReadOnlyContent";
import { formatDateTime } from "@/lib/utils";
import { RestoreVersionButton } from "@/components/sops/RestoreVersionButton";

interface PageProps {
  params: Promise<{ id: string; version: string }>;
}

export default async function VersionDetailPage({ params }: PageProps) {
  const { id, version } = await params;
  const versionNum = parseInt(version);
  if (isNaN(versionNum)) notFound();

  const doc = await prisma.document.findUnique({ where: { id } });
  if (!doc) notFound();

  const docVersion = await prisma.docVersion.findUnique({
    where: { documentId_version: { documentId: id, version: versionNum } },
  });
  if (!docVersion) notFound();

  const isCurrent = doc.currentVersion === versionNum;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center gap-4">
          <Link href={`/sops/${id}/versions`} className="text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <span className="text-sm font-medium text-gray-900">{doc.name}</span>
            <p className="text-xs text-gray-400">{docVersion.versionName || `v${versionNum}`}</p>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {isCurrent ? (
              <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                Current Version
              </span>
            ) : (
              <RestoreVersionButton docId={id} version={versionNum} versionName={docVersion.versionName} />
            )}
            {isCurrent && (
              <Link
                href={`/sops/${id}/edit`}
                className="px-3 py-1.5 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-700"
              >
                Edit
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Version info card */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <GitBranch className="h-4 w-4 text-gray-500" />
              <span className="font-semibold text-gray-900">{docVersion.versionName || `v${versionNum}`}</span>
            </div>
            {isCurrent && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">Current</span>
            )}
            {!isCurrent && (
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-medium">Historical</span>
            )}
            <div className="flex items-center gap-1 text-xs text-gray-400 ml-auto">
              <Clock className="h-3.5 w-3.5" />
              {formatDateTime(docVersion.createdAt)}
              <User className="h-3.5 w-3.5 ml-2" />
              {docVersion.createdBy}
            </div>
          </div>
          {docVersion.changeNote && (
            <p className="mt-2 text-sm text-gray-600">{docVersion.changeNote}</p>
          )}
          {!isCurrent && (
            <p className="mt-3 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              You are viewing a historical version. Use &ldquo;Branch from here&rdquo; to create a new version based on this content.
            </p>
          )}
        </div>

        {/* Content */}
        <div className="bg-white border border-gray-200 rounded-xl p-8">
          <ReadOnlyContent content={docVersion.content} />
        </div>
      </div>
    </div>
  );
}
