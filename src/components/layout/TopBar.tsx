"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";

export function TopBar() {
  const router = useRouter();
  const { theme, toggle } = useTheme();
  const [query, setQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <header style={{
      height: 52,
      borderBottom: "1px solid var(--border)",
      background: "var(--bg)",
      display: "flex",
      alignItems: "center",
      padding: "0 24px",
      gap: 12,
      flexShrink: 0,
      zIndex: 10,
    }}>
      {/* Search */}
      <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: 520 }}>
        <div style={{ position: "relative" }}>
          <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--muted)", pointerEvents: "none" }} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search docs..."
            style={{
              width: "100%",
              height: 34,
              paddingLeft: 32,
              paddingRight: 40,
              borderRadius: 6,
              border: "1px solid var(--border)",
              background: "var(--card)",
              color: "var(--text)",
              fontSize: 13,
              outline: "none",
              boxSizing: "border-box",
            }}
          />
          <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", fontSize: 11, color: "var(--muted)", pointerEvents: "none" }}>
            ⌘K
          </span>
        </div>
      </form>

      {/* Theme toggle */}
      <button
        onClick={toggle}
        style={{
          background: "none",
          border: "1px solid var(--border)",
          borderRadius: 6,
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "var(--muted)",
          flexShrink: 0,
        }}
        title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      >
        {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
      </button>
    </header>
  );
}
