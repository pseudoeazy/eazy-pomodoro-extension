import React, { useState, useEffect } from "react";
import { TimerStatus } from "../types/time";
import { usePomodoro } from "./context/PomodoroContext";

const statusText = {
  default: "Ready?",
  focusing: "Focusing",
  resting: "Resting",
  paused: "Paused",
};

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
  const [time, setTime] = useState("00:00:00");

  function updateTimer() {
    chrome.storage.local.get(["timer", "focus"], (result) => {
      setTime(formatTime(result.timer));
    });
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
