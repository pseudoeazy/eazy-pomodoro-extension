import { saveNotes } from "../utils/storage";

// TODO: background script
chrome.runtime.onInstalled.addListener(() => {
  // TODO: on installed function
  saveNotes([
    {
      id: Date.now(),
      title: "hello title",
      description: "hello description",
      isChecked: false,
    },
  ]);
});
