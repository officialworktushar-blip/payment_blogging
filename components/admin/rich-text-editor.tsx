"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapImage from "@tiptap/extension-image";
import TiptapLink from "@tiptap/extension-link";
import {
  Bold,
  Code2,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Undo2,
  Upload,
} from "lucide-react";
import { getWordCountStorage, WordCount } from "@/components/admin/word-count-extension";
import {
  createPlaceholderDataId,
  ensurePlaceholderIds,
  getPlaceholderStorage,
  ImagePlaceholder,
} from "@/components/admin/image-placeholder-extension";
import { uploadImage } from "@/lib/uploadImage";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  onUploadingChange?: (uploading: boolean) => void;
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
  return getWordCountStorage(editor)?.words ?? 0;
}

function hasPendingPlaceholderUploads(editor: Editor | null): boolean {
  if (!editor) {
    return false;
  }

  const pending = getPlaceholderStorage(editor)?.pending ?? {};
  return Object.values(pending).some(Boolean);
}

export function RichTextEditor({ value, onChange, onUploadingChange }: RichTextEditorProps) {
  const editorRef = useRef<Editor | null>(null);
  const [words, setWords] = useState(0);
  const [, setTick] = useState(0);
  const [notice, setNotice] = useState("");
  const [localUploading, setLocalUploading] = useState(0);

  const syncCount = useCallback((current: Editor) => {
    setWords(readWordCount(current));
  }, []);

  const uploadAndInsert = useCallback(async (file: File) => {
    const current = editorRef.current;
    if (!current) {
      return;
    }

    setNotice("");
    setLocalUploading((count) => count + 1);

    try {
      const { url } = await uploadImage(file, "content");
      current.chain().focus().setImage({ src: url, alt: "Article illustration" }).run();
    } catch (caught: unknown) {
      setNotice(caught instanceof Error ? caught.message : "Upload failed.");
    } finally {
      setLocalUploading((count) => count - 1);
    }
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
      ImagePlaceholder,
      WordCount,
    ],
    content: value,
    editorProps: {
      handlePaste: (_view, event) => {
        const file = Array.from(event.clipboardData?.items ?? [])
          .find((item) => item.type.startsWith("image/"))
          ?.getAsFile();

        if (!file) {
          return false;
        }

        event.preventDefault();
        void uploadAndInsert(file);
        return true;
      },
      handleDrop: (_view, event) => {
        const file = Array.from(event.dataTransfer?.files ?? []).find((item) =>
          item.type.startsWith("image/"),
        );

        if (!file) {
          return false;
        }

        event.preventDefault();
        void uploadAndInsert(file);
        return true;
      },
    },
    onCreate: ({ editor: current }) => {
      editorRef.current = current;
      ensurePlaceholderIds(current);
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
      editorRef.current = null;
    };
  }, [editor]);

  const busy = localUploading > 0 || hasPendingPlaceholderUploads(editor);

  useEffect(() => {
    onUploadingChange?.(busy);
  }, [busy, onUploadingChange]);

  function setLink() {
    if (!editor) {
      return;
    }

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

  function openImagePicker() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg,image/png,image/webp";
    input.onchange = () => {
      const file = input.files?.[0];
      if (file) {
        void uploadAndInsert(file);
      }
    };
    input.click();
  }

  function addImageBox() {
    if (!editor) {
      return;
    }

    const answer = window.prompt(
      "What image or mockup is needed?",
      "Describe the diagram or screenshot",
    );
    if (answer === null) {
      return;
    }

    const description = answer.trim() || "Image or mockup";
    editor
      .chain()
      .focus()
      .insertContent({
        type: "imagePlaceholder",
        attrs: { dataId: createPlaceholderDataId(), description },
      })
      .run();
  }

  if (!editor) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
        Loading editor...
      </div>
    );
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
          label="Heading 2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 aria-hidden="true" size={16} />
        </ToolButton>
        <ToolButton
          label="Heading 3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading3 aria-hidden="true" size={16} />
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
          label="Code block"
          active={editor.isActive("codeBlock")}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          <Code2 aria-hidden="true" size={16} />
        </ToolButton>
        <ToolButton label="Add or edit link" onClick={setLink}>
          <Link2 aria-hidden="true" size={16} />
        </ToolButton>
        <ToolButton label="Upload image" disabled={busy} onClick={openImagePicker}>
          <Upload aria-hidden="true" size={16} />
        </ToolButton>
        <ToolButton label="Add image box" disabled={busy} onClick={addImageBox}>
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
          {words} words | {getWordCountStorage(editor)?.characters ?? 0} characters
        </span>
        <span>Use fictional examples such as 4111 xxxx xxxx 1111 and user@example.</span>
      </div>

      {notice ? (
        <p className="border-t border-error/30 bg-error-light px-4 py-2 text-xs text-error-dark">
          {notice}
        </p>
      ) : null}
    </div>
  );
}
