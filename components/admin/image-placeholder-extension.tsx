"use client";

import { Node, mergeAttributes } from "@tiptap/core";
import {
  NodeViewWrapper,
  ReactNodeViewRenderer,
  type Editor,
  type NodeViewProps,
} from "@tiptap/react";
import { ImagePlus, Trash2 } from "lucide-react";
import { useState } from "react";
import { uploadImage } from "@/lib/uploadImage";

export interface PlaceholderStorage {
  pending: Record<string, boolean>;
}

export function getPlaceholderStorage(editor: Editor): PlaceholderStorage | undefined {
  const storageMap = editor.storage as unknown as Record<string, PlaceholderStorage | undefined>;
  return storageMap.imagePlaceholder;
}

export function createPlaceholderDataId(): string {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `ph-${random}`;
}

function PlaceholderView({ node, editor, getPos, deleteNode }: NodeViewProps) {
  const dataId = typeof node.attrs.dataId === "string" ? node.attrs.dataId : "";
  const description = typeof node.attrs.description === "string" ? node.attrs.description : "Image";
  const [error, setError] = useState("");
  const storage = getPlaceholderStorage(editor);
  const pending = dataId ? storage?.pending[dataId] === true : false;

  function setPending(value: boolean) {
    const current = getPlaceholderStorage(editor);
    if (!current || !dataId) {
      return;
    }

    if (value) {
      current.pending[dataId] = true;
    } else {
      delete current.pending[dataId];
    }

    editor.view.dispatch(editor.state.tr);
  }

  async function replaceWithImage(file: File) {
    setError("");
    setPending(true);

    try {
      const { url } = await uploadImage(file, "content");
      const position = getPos();
      if (typeof position !== "number") {
        throw new Error("Could not locate the image box.");
      }

      const nodeAtPosition = editor.state.doc.nodeAt(position);
      let from = position;
      let to = position + (nodeAtPosition?.nodeSize ?? 1);

      if (!nodeAtPosition || nodeAtPosition.type.name !== "imagePlaceholder") {
        let found = -1;
        editor.state.doc.descendants((candidate, candidatePos) => {
          if (
            candidate.type.name === "imagePlaceholder" &&
            (!dataId || candidate.attrs.dataId === dataId)
          ) {
            found = candidatePos;
            return false;
          }
          return true;
        });

        if (found < 0) {
          throw new Error("The image box could not be found.");
        }

        const foundNode = editor.state.doc.nodeAt(found);
        from = found;
        to = found + (foundNode?.nodeSize ?? 1);
      }

      editor
        .chain()
        .focus()
        .insertContentAt(
          { from, to },
          { type: "image", attrs: { src: url, alt: description } },
        )
        .run();
    } catch (caught: unknown) {
      setError(caught instanceof Error ? caught.message : "Upload failed.");
    } finally {
      setPending(false);
    }
  }

  function openPicker() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg,image/png,image/webp";
    input.onchange = () => {
      const file = input.files?.[0];
      if (file) {
        void replaceWithImage(file);
      }
    };
    input.click();
  }

  return (
    <NodeViewWrapper className="image-placeholder-wrapper">
      <div className="rounded-xl border border-dashed border-brand-300 bg-brand-50/60 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">
              Image placeholder
            </p>
            <p className="mt-1 text-sm text-slate-700">{description}</p>
          </div>
          <span data-drag-handle className="cursor-grab text-[11px] text-slate-400">
            Drag to move
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={openPicker}
            disabled={pending}
            className="inline-flex items-center gap-1.5 rounded-md border border-brand-200 bg-white px-2.5 py-1.5 text-xs font-medium text-brand-700 hover:bg-brand-50 disabled:opacity-50"
          >
            <ImagePlus aria-hidden="true" size={13} />
            {pending ? "Uploading..." : "Upload image"}
          </button>
          <button
            type="button"
            onClick={() => deleteNode()}
            disabled={pending}
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          >
            <Trash2 aria-hidden="true" size={13} />
            Delete box
          </button>
        </div>
        {error ? <p className="mt-2 text-xs text-error-dark">{error}</p> : null}
      </div>
    </NodeViewWrapper>
  );
}

export const ImagePlaceholder = Node.create({
  name: "imagePlaceholder",
  group: "block",
  atom: true,
  draggable: true,

  addStorage() {
    return { pending: {} };
  },

  addAttributes() {
    return {
      dataId: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-id"),
        renderHTML: (attributes) =>
          attributes.dataId ? { "data-id": attributes.dataId } : {},
      },
      description: {
        default: "Image",
        parseHTML: (element) => element.textContent?.trim() || "Image",
        renderHTML: () => ({}),
      },
    };
  },

  parseHTML() {
    return [{ tag: "div.image-placeholder" }];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { class: "image-placeholder" }),
      typeof node.attrs.description === "string" ? node.attrs.description : "Image",
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(PlaceholderView);
  },
});

export function ensurePlaceholderIds(editor: Editor): void {
  const missing: { pos: number; attrs: Record<string, unknown> }[] = [];

  editor.state.doc.descendants((node, pos) => {
    if (node.type.name === "imagePlaceholder" && !node.attrs.dataId) {
      missing.push({ pos, attrs: node.attrs as Record<string, unknown> });
    }
  });

  if (missing.length === 0) {
    return;
  }

  const transaction = editor.state.tr;
  missing.forEach(({ pos, attrs }) => {
    transaction.setNodeMarkup(pos, undefined, { ...attrs, dataId: createPlaceholderDataId() });
  });
  editor.view.dispatch(transaction);
}
