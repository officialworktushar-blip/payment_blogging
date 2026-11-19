"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapImage from "@tiptap/extension-image";
import TiptapLink from "@tiptap/extension-link";
import {
  Bold,
  Code2,
  Heading1,
  Heading2,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Undo2,
} from "lucide-react";
import { getWordCountStorage, WordCount } from "@/components/admin/word-count-extension";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

interface ToolButtonProps {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}

function ToolButton({ label, active = false, disabled = false, onClick, children }: ToolButtonProps) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={`flex h-8 w-8 items-center justify-center rounded-md border text-sm motion-reduce:transition-none ${
        active
          ? "border-brand-300 bg-brand-50 text-brand-700"
          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
      } disabled:cursor-not-allowed disabled:opacity-40`}
    >
      {children}
    </button>
  );
}

function readWordCount(editor: Editor): number {
  const storage = getWordCountStorage(editor);
  return storage?.words ?? 0;
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const [words, setWords] = useState(0);
  const [, setTick] = useState(0);
  const [notice, setNotice] = useState("");

  const syncCount = useCallback((editor: Editor) => {
    setWords(readWordCount(editor));
  }, []);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TiptapImage.configure({ inline: false, allowBase64: false }),
      TiptapLink.configure({
        openOnClick: false,
        autolink: true,
        protocols: ["http", "https", "mailto"],
      }),
      WordCount,
    ],
    content: value,
    onCreate: ({ editor: current }) => {
      syncCount(current);
    },
    onUpdate: ({ editor: current }) => {
      onChange(current.getHTML());
      syncCount(current);
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    const refresh = () => setTick((current) => current + 1);
    editor.on("selectionUpdate", refresh);
    editor.on("transaction", refresh);

    return () => {
      editor.off("selectionUpdate", refresh);
      editor.off("transaction", refresh);
    };
  }, [editor]);

  if (!editor) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
        Loading editor...
      </div>
    );
  }

  function setLink() {
    const current = window.prompt("Link URL (https://example.com)", "https://example.com");
    if (current === null) {
      return;
    }

    const trimmed = current.trim();
    if (trimmed.length === 0) {
      editor.chain().focus().unsetLink().run();
      return;
    }

    if (!/^(https?:\/\/|mailto:)/i.test(trimmed)) {
      setNotice("Links must start with https://, http:// or mailto:.");
      return;
    }

    setNotice("");
    editor.chain().focus().setLink({ href: trimmed }).run();
  }

  function addImage() {
    const current = window.prompt("Image URL (https://...)");
    if (current === null) {
      return;
    }

    const trimmed = current.trim();
    if (trimmed.length === 0) {
      return;
    }

    if (!/^https:\/\//i.test(trimmed)) {
      setNotice("Images must use an https:// URL.");
      return;
    }

    setNotice("");
    editor.chain().focus().setImage({ src: trimmed, alt: "Article illustration" }).run();
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 bg-slate-50 p-2">
        <ToolButton
          label="Bold"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold aria-hidden="true" size={16} />
        </ToolButton>
        <ToolButton
          label="Italic"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic aria-hidden="true" size={16} />
        </ToolButton>
        <ToolButton
          label="Heading 1"
          active={editor.isActive("heading", { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          <Heading1 aria-hidden="true" size={16} />
        </ToolButton>
        <ToolButton
          label="Heading 2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 aria-hidden="true" size={16} />
        </ToolButton>
        <ToolButton
          label="Bullet list"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List aria-hidden="true" size={16} />
        </ToolButton>
        <ToolButton
          label="Numbered list"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered aria-hidden="true" size={16} />
        </ToolButton>
        <ToolButton
          label="Quote"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote aria-hidden="true" size={16} />
        </ToolButton>
        <ToolButton
          label="Inline code"
          active={editor.isActive("code")}
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          <Code2 aria-hidden="true" size={16} />
        </ToolButton>
        <ToolButton label="Add or edit link" onClick={setLink}>
          <Link2 aria-hidden="true" size={16} />
        </ToolButton>
        <ToolButton label="Add image" onClick={addImage}>
          <ImagePlus aria-hidden="true" size={16} />
        </ToolButton>
        <span className="mx-1 h-6 w-px bg-slate-200" aria-hidden="true" />
        <ToolButton
          label="Undo"
          disabled={!editor.can().undo()}
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo2 aria-hidden="true" size={16} />
        </ToolButton>
        <ToolButton
          label="Redo"
          disabled={!editor.can().redo()}
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo2 aria-hidden="true" size={16} />
        </ToolButton>
      </div>

      <EditorContent
        editor={editor}
        className="article-content min-h-[280px] px-4 py-4 text-sm leading-7 text-slate-800"
      />

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-500">
        <span>
          {words} words | {""}
          {getWordCountStorage(editor)?.characters ?? 0} characters
        </span>
        <span>Use fictional examples such as 4111 xxxx xxxx 1111 and user@example.</span>
      </div>

      {notice ? <p className="border-t border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-800">{notice}</p> : null}
    </div>
  );
}
