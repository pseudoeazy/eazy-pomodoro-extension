import { PomodoroAppState } from "../components/context/PomodoroContext";
import { Time, TimerStatus, UpdateTime } from "../types/time";

export function updateTimer(
  pomodoro: PomodoroAppState,
  setTime: React.Dispatch<React.SetStateAction<string>>,
  setProgress: React.Dispatch<React.SetStateAction<number>>,
  setTargetTime: React.Dispatch<React.SetStateAction<number>>
) {
  let updateTime: UpdateTime;

  if (pomodoro.status === TimerStatus.RESTING) {
    updateTime = function () {
      chrome.storage.local.get(["sBTimer"], (result) => {
        const currentTime = getTime(result.sBTimer);
        setTime(formatTime(currentTime));
      });
    };
    updateTime();
    return updateTime;
  }

  updateTime = function () {
    chrome.storage.local.get(["timer", "focus"], (result) => {
      const currentTime = getTime(result.timer);

      setTime(formatTime(currentTime));
      const initialTime = result.focus.focusTimer * 60;
      setProgress(progressTime(currentTime, initialTime));
      setTargetTime(initialTime);
    });
  };

  updateTime();
  return updateTime;
}

export function getTime(seconds: number): Time {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return { hours, minutes, remainingSeconds };
}

export function progressTime(time: Time, initialTime: number): number {
  const { hours, minutes, remainingSeconds } = time;
  const remainingTime = hours * 3600 + minutes * 60 + remainingSeconds;
  const elapsedTime = initialTime - remainingTime;
  const progress = (elapsedTime / initialTime) * 100;

  return Math.floor(progress);
}

export function formatTime(time: Time) {
  const { hours, minutes, remainingSeconds } = time;
  return `
    ${String(hours).padStart(2, "0")}:
    ${String(minutes).padStart(2, "0")}:
    ${String(remainingSeconds).padStart(2, "0")}
    `;
}

export function barStopIndicator(
  range: number,
  progress: number,
  targetTime: number
) {
  const currentProgress = (progress / 100) * targetTime;
  const halfOfProgress = targetTime * range;
  //uncomment for debugging
  // console.log({ currentProgress, halfOfProgress, progress, targetTime, range });

  if (currentProgress >= halfOfProgress) return true;
  return false;
}
