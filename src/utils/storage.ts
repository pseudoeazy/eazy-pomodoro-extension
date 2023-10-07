import { Note } from "../types/note";
import { Focus, ShortBreak } from "../types/settings";
import { TimerStatus } from "../types/time";

export interface LocalStorage {
  notes?: Note[];
  status?: TimerStatus;
  focus?: Focus;
  shortBreak?: ShortBreak;
}

export function saveFocusSettings(focus: Focus): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.set({ focus }, () => resolve());
  });
}

export function getFocusSettings(): Promise<Focus> {
  return new Promise((resolve) => {
    chrome.storage.local.get(["focus"], (result: LocalStorage) => {
      resolve(result.focus);
    });
  });
}

export function saveNotes(notes: Note[]): Promise<void> {
  const values: LocalStorage = { notes };
  return new Promise((resolve) => {
    chrome.storage.local.set(values, () => {
      resolve();
    });
  });
}

export function getNotes(): Promise<Note[]> {
  return new Promise((resolve) => {
    chrome.storage.local.get(["notes"], (results: LocalStorage) => {
      resolve(results.notes);
    });
  });
}

export function getStoredStatus(): Promise<TimerStatus> {
  return new Promise((resolve) => {
    chrome.storage.local.get(["status"], (result: LocalStorage) => {
      resolve(result.status);
    });
  });
}

export function setStoredStatus(status: TimerStatus): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.set({ status }, () => resolve());
  });
}
