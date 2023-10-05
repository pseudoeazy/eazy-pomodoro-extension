import { Note } from "../types/note";

export interface LocalStorage {
  notes?: Note[];
}

export function saveNotes(notes: Note[]): Promise<void> {
  const values: LocalStorage = { notes };
  return new Promise((resolve) => {
    chrome.storage.sync.set(values, () => {
      resolve();
    });
  });
}

export function getNotes(): Promise<Note[]> {
  return new Promise((resolve) => {
    chrome.storage.sync.get(["notes"], (results: LocalStorage) => {
      resolve(results.notes);
    });
  });
}
