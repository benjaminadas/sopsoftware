import Link from "next/link";
import { LayoutTemplate, PlusCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { DOC_TYPE_LABELS } from "@/lib/validations";
import { DOC_TYPE_COLORS, DOC_TYPE_ICONS } from "@/types";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default async function TemplatesPage() {
  const templates = await prisma.template.findMany({ orderBy: { updatedAt: "desc" } });

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Templates</h1>
          <p className="text-sm text-gray-500 mt-0.5">Reusable starting points for new documents</p>
        </div>
      </div>

      {templates.length === 0 ? (
        <div className="text-center py-20">
          <LayoutTemplate className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400">No templates yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{DOC_TYPE_ICONS[template.docType] || "📄"}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 text-sm">{template.name}</h3>
                    <span className={cn("text-xs px-2 py-0.5 rounded-full", DOC_TYPE_COLORS[template.docType] || "bg-gray-100 text-gray-600")}>
                      {DOC_TYPE_LABELS[template.docType as keyof typeof DOC_TYPE_LABELS] || template.docType}
                    </span>
                  </div>
                  {template.description && (
                    <p className="text-xs text-gray-500 line-clamp-2">{template.description}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">Updated {formatDate(template.updatedAt)}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2">
                <Link
                  href={`/sops/new?templateDocType=${template.docType}`}
                  className="flex-1 text-center py-1.5 text-xs font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Use Template
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
