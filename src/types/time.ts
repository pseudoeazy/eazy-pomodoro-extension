export enum TimerStatus {
  DEFAULT = "default",
  RESTING = "resting",
  FOCUSING = "focusing",
  PAUSED = "paused",
}

export type Time = {
  hours: number;
  minutes: number;
  remainingSeconds: number;
};

export type UpdateTime = () => void;
