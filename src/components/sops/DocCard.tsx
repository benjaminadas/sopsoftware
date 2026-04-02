import Link from "next/link";
import { FileText, Clock, User, GitBranch } from "lucide-react";
import { DocumentWithMeta, DOC_TYPE_COLORS, DOC_TYPE_ICONS, PLATFORM_COLORS } from "@/types";
import { DOC_TYPE_LABELS } from "@/lib/validations";
import { timeAgo } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface DocCardProps {
  doc: DocumentWithMeta;
}

export function DocCard({ doc }: DocCardProps) {
  return (
    <Link
      href={`/sops/${doc.id}`}
      className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-400 hover:shadow-sm transition-all group"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <span className="text-xs font-mono font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
            {doc.docId}
          </span>
          {doc.platform && (
            <span className={cn("text-xs font-semibold px-2 py-0.5 rounded", PLATFORM_COLORS[doc.platform] || "bg-gray-200 text-gray-700")}>
              {doc.platform}
            </span>
          )}
          <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", DOC_TYPE_COLORS[doc.docType] || "bg-gray-100 text-gray-600")}>
            {DOC_TYPE_ICONS[doc.docType]} {DOC_TYPE_LABELS[doc.docType as keyof typeof DOC_TYPE_LABELS] || doc.docType}
          </span>
        </div>
        <span className="text-xs text-gray-400 shrink-0">v{doc.currentVersion}</span>
      </div>

      <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1 group-hover:text-black line-clamp-2">
        {doc.name}
      </h3>

      {doc.description && (
        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{doc.description}</p>
      )}

      <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
        <span className="flex items-center gap-1">
          <User className="h-3 w-3" />
          {doc.owner}
        </span>
        <span className="flex items-center gap-1">
          <GitBranch className="h-3 w-3" />
          {doc._count.versions} version{doc._count.versions !== 1 ? "s" : ""}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {timeAgo(doc.updatedAt)}
        </span>
      </div>

      {doc.funnelStage && doc.funnelStage !== "General" && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-500">{doc.funnelStage}</span>
        </div>
      )}

      {doc.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {doc.tags.slice(0, 4).map(({ tag }) => (
            <span key={tag.id} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {tag.name}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
