import React, { useState, useEffect } from "react";
import { TimerStatus } from "../types/time";
import { usePomodoro } from "./context/PomodoroContext";
import ProgressBar from "./ProgressBar";
import { updateTimer } from "../utils/helpers";

const statusText = {
  default: "Ready?",
  focusing: "Focusing",
  resting: "Resting",
  paused: "Paused",
};

export default function TimerScreen() {
  const { pomodoro } = usePomodoro();
  const [time, setTime] = useState<string>("00:00:00");
  const [progress, setProgress] = useState<number>(0);
  const [targetTime, setTargetTime] = useState<number>(0);

  useEffect(() => {
    const updateTime = updateTimer(
      pomodoro,
      setTime,
      setProgress,
      setTargetTime
    );

    const intervalId = setInterval(updateTime, 1000);
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
