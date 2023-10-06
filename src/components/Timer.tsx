import React, { useState, useEffect } from "react";
import { TimerStatus } from "../types/time";
import { usePomodoro } from "./context/PomodoroContext";

const statusText = {
  default: "Ready?",
  focusing: "Focusing",
  resting: "Resting",
  paused: "Paused",
};

export default function Timer() {
  const { pomodoro } = usePomodoro();
  const [minutes, setMinutes] = useState("00");
  const [seconds, setSeconds] = useState("00");

  function updateTimer() {
    chrome.storage.local.get(["timer", "focus"], (result) => {
      // result.timer = 60 * 24 + 55;
      const focusTimer = Number(result.focus.focusTimer);
      const mins = `${focusTimer - Math.ceil(result.timer / 60)}`.padStart(
        2,
        "0"
      );
      let secs = "00";
      if (result.timer % 60 !== 0) {
        secs = `${60 - (result.timer % 60)}`.padStart(2, "0");
      }
      setMinutes(mins);
      setSeconds(secs);
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
            00:{minutes}:{seconds}
          </time>
        </div>
      </div>
    </div>
  );
}
