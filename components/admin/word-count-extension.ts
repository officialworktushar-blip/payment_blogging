import { Extension } from "@tiptap/core";
import type { Editor } from "@tiptap/react";

export interface WordCountStorage {
  words: number;
  characters: number;
}

export type WordCountOptions = Record<string, unknown>;

function refreshStorage(storage: WordCountStorage, text: string): void {
  const trimmed = text.trim();
  storage.words = trimmed.length > 0 ? trimmed.split(/\s+/).length : 0;
  storage.characters = text.length;
}

export const WordCount = Extension.create<WordCountOptions, WordCountStorage>({
  name: "wordCount",

  addStorage() {
    return {
      words: 0,
      characters: 0,
    };
  },

  onCreate() {
    refreshStorage(this.storage, this.editor.getText());
  },

  onUpdate() {
    refreshStorage(this.storage, this.editor.getText());
  },
});

export function getWordCountStorage(editor: Editor): WordCountStorage | undefined {
  const storageMap = editor.storage as unknown as Record<string, WordCountStorage | undefined>;
  return storageMap.wordCount;
}
