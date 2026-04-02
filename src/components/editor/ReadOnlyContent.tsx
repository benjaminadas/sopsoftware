"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import { Table, TableRow, TableCell, TableHeader } from "@tiptap/extension-table";
import { TaskList } from "@tiptap/extension-task-list";
import { TaskItem } from "@tiptap/extension-task-item";
import Link from "@tiptap/extension-link";

interface ReadOnlyContentProps {
  content: string;
}

export function ReadOnlyContent({ content }: ReadOnlyContentProps) {
  const parsedContent = (() => {
    try { return JSON.parse(content); } catch { return content; }
  })();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Table,
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem,
      Link,
    ],
    content: parsedContent,
    editable: false,
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <div className="doc-content">
      <EditorContent editor={editor} />
    </div>
  );
}
