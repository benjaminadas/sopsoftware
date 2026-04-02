"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, LayoutTemplate, PlusCircle, BookOpen, ChevronRight, Folder } from "lucide-react";
import { cn } from "@/lib/utils";
import { DOC_TYPES, DOC_TYPE_LABELS } from "@/lib/validations";

const DOC_TYPE_DOTS: Record<string, string> = {
  SOP: "bg-blue-500",
  GLOBAL_VARS: "bg-purple-500",
  LEARNINGS: "bg-green-500",
  METRICS: "bg-orange-500",
  TEMPLATE_DOC: "bg-gray-400",
};

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 border-r border-gray-200 bg-white flex flex-col h-full flex-shrink-0">
      <div className="p-5 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-gray-900" />
          <span className="font-bold text-gray-900">SOP Manager</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-5">
        <div>
          <Link
            href="/sops/new"
            className="flex items-center gap-2 w-full bg-gray-900 text-white rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            <PlusCircle className="h-4 w-4" />
            New Document
          </Link>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">Library</p>
          <ul className="space-y-0.5">
            <li>
              <Link
                href="/sops"
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                  pathname === "/sops" && !pathname.includes("?")
                    ? "bg-gray-100 text-gray-900 font-medium"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <FileText className="h-4 w-4" />
                All Documents
              </Link>
            </li>
            <li>
              <Link
                href="/templates"
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                  pathname.startsWith("/templates")
                    ? "bg-gray-100 text-gray-900 font-medium"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <LayoutTemplate className="h-4 w-4" />
                Templates
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">Doc Types</p>
          <ul className="space-y-0.5">
            {DOC_TYPES.map((type) => (
              <li key={type}>
                <Link
                  href={`/sops?docType=${type}`}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  <span className={cn("h-2 w-2 rounded-full flex-shrink-0", DOC_TYPE_DOTS[type])} />
                  <span className="truncate">{DOC_TYPE_LABELS[type as keyof typeof DOC_TYPE_LABELS]}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <p className="text-xs text-gray-400">SOP Manager v1.0</p>
      </div>
    </aside>
  );
}
