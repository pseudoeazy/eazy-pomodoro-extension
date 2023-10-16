import React, { useState, useEffect } from "react";
import { TimerStatus } from "../types/time";
import { usePomodoro } from "./context/PomodoroContext";

const statusText = {
  default: "Ready?",
  focusing: "Focusing",
  resting: "Resting",
  paused: "Paused",
};

function getTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return { hours, minutes, remainingSeconds };
}

function progressStatus(seconds: number, initialTime: number): number {
  const { hours, minutes, remainingSeconds } = getTime(seconds);
  const elapsedTime = hours + minutes + remainingSeconds;
  return (elapsedTime / initialTime) * 100;
}
function formatTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(remainingSeconds).padStart(2, "0")}`;
}

export default function Timer() {
  const { pomodoro } = usePomodoro();
  const [time, setTime] = useState<string>("00:00:00");

  function updateTimer() {
    if (pomodoro.status === TimerStatus.RESTING) {
      chrome.storage.local.get(["sBTimer"], (result) => {
        setTime(formatTime(result.sBTimer));
      });
    } else {
      chrome.storage.local.get(["timer"], (result) => {
        setTime(formatTime(result.timer));
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
  );
}
