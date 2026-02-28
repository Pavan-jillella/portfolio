"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";

interface TipTapEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  editable?: boolean;
}

export function TipTapEditor({ content, onChange, placeholder = "Start writing...", editable = true }: TipTapEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  const btnClass = (active: boolean) =>
    `p-1.5 rounded-lg text-xs transition-all ${
      active ? "bg-blue-500/20 text-blue-400" : "text-white/40 hover:text-white hover:bg-white/[0.06]"
    }`;

  function setLink() {
    const url = window.prompt("Enter URL:");
    if (url && editor) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
  }

  return (
    <div className="border border-white/[0.08] rounded-xl overflow-hidden">
      <style>{`
        .ProseMirror { min-height: 200px; outline: none; padding: 1rem; color: rgba(255,255,255,0.8); font-size: 0.875rem; line-height: 1.6; }
        .ProseMirror p.is-editor-empty:first-child::before { content: attr(data-placeholder); float: left; color: rgba(255,255,255,0.2); pointer-events: none; height: 0; }
        .ProseMirror h1 { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem; color: white; }
        .ProseMirror h2 { font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem; color: white; }
        .ProseMirror ul, .ProseMirror ol { padding-left: 1.5rem; }
        .ProseMirror li { margin-bottom: 0.25rem; }
        .ProseMirror code { background: rgba(255,255,255,0.06); padding: 0.15rem 0.4rem; border-radius: 0.25rem; font-family: var(--font-mono); font-size: 0.8rem; }
        .ProseMirror pre { background: rgba(255,255,255,0.04); padding: 1rem; border-radius: 0.5rem; overflow-x: auto; margin: 0.5rem 0; }
        .ProseMirror pre code { background: none; padding: 0; }
        .ProseMirror a { color: #60a5fa; text-decoration: underline; }
        .ProseMirror blockquote { border-left: 3px solid rgba(255,255,255,0.1); padding-left: 1rem; color: rgba(255,255,255,0.5); }
      `}</style>

      {/* Toolbar */}
      {editable && (
        <div className="flex items-center gap-1 px-3 py-2 border-b border-white/[0.08] bg-white/[0.02]">
          <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btnClass(editor.isActive("bold"))}>
            <strong>B</strong>
          </button>
          <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btnClass(editor.isActive("italic"))}>
            <em>I</em>
          </button>
          <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={btnClass(editor.isActive("heading", { level: 1 }))}>
            H1
          </button>
          <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btnClass(editor.isActive("heading", { level: 2 }))}>
            H2
          </button>
          <span className="w-px h-4 bg-white/10 mx-1" />
          <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnClass(editor.isActive("bulletList"))}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btnClass(editor.isActive("orderedList"))}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
          </button>
          <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={btnClass(editor.isActive("codeBlock"))}>
            {"</>"}
          </button>
          <button type="button" onClick={setLink} className={btnClass(editor.isActive("link"))}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
          </button>
        </div>
      )}

      <EditorContent editor={editor} />
    </div>
  );
}
