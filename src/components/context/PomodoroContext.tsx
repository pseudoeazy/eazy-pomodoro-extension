import React, { createContext, useContext, useReducer } from "react";
import { TimerStatus } from "../../types/time";
import { Note } from "../../types/note";

export interface PomodoroAppState {
  status: TimerStatus;
  notes: Note[];
}

export enum Actions {
  STATUS = "STATUS",
  NOTES = "NOTES",
}

export type PomodoroAction =
  | { type: Actions.STATUS; payload: TimerStatus }
  | { type: Actions.NOTES; payload: Note[] };

interface PomodoroApp {
  pomodoro: PomodoroAppState;
  updatePomodoro: React.Dispatch<PomodoroAction>;
}

export const PomodoroContext = createContext<PomodoroApp | null>(null);

export const usePomodoro = () => {
  const context = useContext(PomodoroContext);
  if (!context) {
    throw new Error("PomodoroContext must be used within a PomodoroProvider");
  }
  return context;
};
