"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  ChevronRight, Settings, Calendar, Film, TrendingUp, Box, Users, Lock, FileText, Home
} from "lucide-react";

type Subfolder = { id: string; name: string; slug: string; description: string | null; group: string | null; order: number };
type Category  = { id: string; name: string; slug: string; description: string | null; icon: string | null; order: number; subfolders: Subfolder[] };

const ICONS: Record<string, React.ReactNode> = {
  Calendar:   <Calendar   size={15} />,
  Film:       <Film       size={15} />,
  TrendingUp: <TrendingUp size={15} />,
  Box:        <Box        size={15} />,
  Users:      <Users      size={15} />,
  Lock:       <Lock       size={15} />,
  FileText:   <FileText   size={15} />,
};

export function Sidebar() {
  const pathname  = usePathname();
  const router    = useRouter();
  const [cats, setCats]   = useState<Category[]>([]);
  const [open, setOpen]   = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch("/api/categories").then(r => r.json()).then((data: Category[]) => {
      setCats(data);
      // auto-expand category that matches current path
      const match = data.find(c => pathname.startsWith(`/folder/${c.slug}`));
      if (match) setOpen(prev => ({ ...prev, [match.id]: true }));
    });
  }, [pathname]);

  const toggleCat = (id: string) => setOpen(prev => ({ ...prev, [id]: !prev[id] }));

  const isActiveSub = (catSlug: string, subSlug: string) =>
    pathname === `/folder/${catSlug}/${subSlug}`;

  const isActiveCat = (catSlug: string) =>
    pathname === `/folder/${catSlug}`;

  return (
    <aside style={{
      width: 220,
      minWidth: 220,
      background: "#13131a",
      display: "flex",
      flexDirection: "column",
      height: "100%",
      flexShrink: 0,
      borderRight: "1px solid #1e1e2a",
    }}>
      {/* Logo */}
      <div
        onClick={() => router.push("/")}
        style={{ padding: "16px 16px 14px", cursor: "pointer", borderBottom: "1px solid #1e1e2a" }}
      >
        <span style={{ fontWeight: 800, fontSize: 15, color: "#ffffff", letterSpacing: "-0.3px" }}>E&amp;C</span>
        <span style={{ fontWeight: 400, fontSize: 15, color: "#555566", marginLeft: 4 }}>Docs</span>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
        {cats.map(cat => {
          const isOpen   = !!open[cat.id];
          const isCatAct = isActiveCat(cat.slug);
          return (
            <div key={cat.id}>
              {/* Category row */}
              <div
                style={{ display: "flex", alignItems: "center", padding: "0 8px" }}
              >
                <button
                  onClick={() => toggleCat(cat.id)}
                  style={{
                    background: "none", border: "none", cursor: "pointer", padding: "2px 4px 2px 2px",
                    color: "#555566", display: "flex", alignItems: "center", flexShrink: 0,
                    transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                    transition: "transform 0.15s",
                  }}
                  aria-label="expand"
                >
                  <ChevronRight size={13} />
                </button>

                <Link
                  href={`/folder/${cat.slug}`}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    padding: "6px 6px",
                    borderRadius: 5,
                    fontSize: 13,
                    fontWeight: 500,
                    color: isCatAct ? "#ffffff" : "#bbbbcc",
                    background: isCatAct ? "#1e1e2e" : "transparent",
                    textDecoration: "none",
                    transition: "background 0.1s, color 0.1s",
                  }}
                  onMouseEnter={e => { if (!isCatAct) (e.currentTarget as HTMLElement).style.color = "#ffffff"; }}
                  onMouseLeave={e => { if (!isCatAct) (e.currentTarget as HTMLElement).style.color = "#bbbbcc"; }}
                >
                  <span style={{ color: "#555566", display: "flex", flexShrink: 0 }}>
                    {ICONS[cat.icon || "FileText"] || <FileText size={15} />}
                  </span>
                  <span style={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{cat.name}</span>
                </Link>
              </div>

              {/* Subfolders */}
              {isOpen && cat.subfolders.map(sub => {
                const isAct = isActiveSub(cat.slug, sub.slug);
                return (
                  <Link
                    key={sub.id}
                    href={`/folder/${cat.slug}/${sub.slug}`}
                    style={{
                      display: "block",
                      padding: "4px 8px 4px 38px",
                      fontSize: 12,
                      fontWeight: isAct ? 600 : 400,
                      color: isAct ? "#ffffff" : "#888899",
                      textDecoration: "none",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      borderRadius: 4,
                      margin: "0 4px",
                      background: isAct ? "#1e1e2e" : "transparent",
                      transition: "color 0.1s, background 0.1s",
                    }}
                    onMouseEnter={e => { if (!isAct) { (e.currentTarget as HTMLElement).style.color = "#ddddee"; } }}
                    onMouseLeave={e => { if (!isAct) { (e.currentTarget as HTMLElement).style.color = "#888899"; } }}
                  >
                    {sub.name}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: "10px 14px", borderTop: "1px solid #1e1e2a", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12, color: "#555566" }}>Support</span>
        <Link
          href="/settings"
          style={{ color: "#555566", display: "flex", textDecoration: "none" }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "#aaaaaa")}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "#555566")}
        >
          <Settings size={15} />
        </Link>
      </div>
    </aside>
  );
}
