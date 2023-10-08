import React from "react";
import { Link } from "react-router-dom";
import { TimerStatus } from "../types/time";
import { Actions, usePomodoro } from "./context/PomodoroContext";
import { Messages } from "../types/messages";

const buttonStatusText = {
  focusing: "Pause",
  paused: "Continue focusing",
  resting: "Continue focusing",
  default: "Start focusing",
};

const handleTimer = (action: TimerStatus) => {
  switch (action) {
    case TimerStatus.DEFAULT:
      return TimerStatus.FOCUSING;
    case TimerStatus.FOCUSING:
      return TimerStatus.PAUSED;
    case TimerStatus.PAUSED:
      return TimerStatus.FOCUSING;
    case TimerStatus.RESTING:
      return TimerStatus.FOCUSING;
  }
};

export default function TimerButtons() {
  const { pomodoro, updatePomodoro } = usePomodoro();

  const handlePomodoroState = () => {
    chrome.runtime.sendMessage(
      { type: Messages.TIMER_STATUS, status: handleTimer(pomodoro.status) },
      (statusResponse: TimerStatus) => {
        updatePomodoro({ type: Actions.STATUS, payload: statusResponse });
      }
    );
  };

  return (
    <div className="timer__btn-group">
      <button
        type="button"
        className={`timer__button timer__button--${pomodoro.status}`}
        onClick={handlePomodoroState}
      >
        {buttonStatusText[pomodoro.status]}
      </button>
      {pomodoro.status !== TimerStatus.DEFAULT && (
        <div className="timer__btns">
          {pomodoro.status !== TimerStatus.RESTING && (
            <Link to="/start-short-break" className="timer__link">
              Start short break
            </Link>
          )}
          {/* <Link to="/long-break" className="timer__link">
            Start long break
          </Link> */}
        </div>
      )}
    </div>
  );
}
