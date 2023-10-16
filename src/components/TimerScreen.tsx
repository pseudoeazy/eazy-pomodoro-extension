import React, { useState, useEffect } from "react";
import { TimerStatus } from "../types/time";
import { usePomodoro } from "./context/PomodoroContext";
import ProgressBar from "./ProgressBar";

const statusText = {
  default: "Ready?",
  focusing: "Focusing",
  resting: "Resting",
  paused: "Paused",
};

type Time = {
  hours: number;
  minutes: number;
  remainingSeconds: number;
};

function getTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return { hours, minutes, remainingSeconds };
}

function progressTime(time: Time, initialTime: number): number {
  const { hours, minutes, remainingSeconds } = time;
  const remainingTime = hours * 3600 + minutes * 60 + remainingSeconds;
  const elapsedTime = initialTime - remainingTime;
  const progress = (elapsedTime / initialTime) * 100;

  return Math.floor(progress);
}

function formatTime(time: Time) {
  const { hours, minutes, remainingSeconds } = time;
  return `
  ${String(hours).padStart(2, "0")}:
  ${String(minutes).padStart(2, "0")}:
  ${String(remainingSeconds).padStart(2, "0")}
  `;
}

export default function TimerScreen() {
  const { pomodoro } = usePomodoro();
  const [time, setTime] = useState<string>("00:00:00");
  const [progress, setProgress] = useState<number>(0);
  const [targetTime, setTargetTime] = useState<number>(0);

  function updateTimer() {
    if (pomodoro.status === TimerStatus.RESTING) {
      chrome.storage.local.get(["sBTimer"], (result) => {
        const currentTime = getTime(result.sBTimer);
        setTime(formatTime(currentTime));
      });
    } else {
      chrome.storage.local.get(["timer", "focus"], (result) => {
        const currentTime = getTime(result.timer);

        setTime(formatTime(currentTime));
        const initialTime = result.focus.focusTimer * 60;
        setProgress(progressTime(currentTime, initialTime));
        setTargetTime(initialTime);
      });
    }
  }

  useEffect(() => {
    updateTimer();
    const intervalId = setInterval(updateTimer, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <>
      <ProgressBar progress={progress} targetTime={targetTime} />
      <div className="timer">
        <div className="timer__screen">
          <div>
            <div className={`timer__ready timer__${pomodoro.status}`}>
              {pomodoro.status === TimerStatus.PAUSED && (
                <span className="timer__circle"></span>
              )}
              <strong>{statusText[pomodoro.status]}</strong>
            </div>
            <time className={`timer__time timer__${pomodoro.status}`}>
              {time}
            </time>
          </div>
        </div>
      </div>
    </>
  );
}
