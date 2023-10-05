import React, { useState } from "react";
import { Link } from "react-router-dom";
import { TimerStatus } from "../types/time";

const buttonStatusText = {
  focusing: "Pause",
  paused: "Continue focusing",
  resting: "Continue focusing",
  default: "Start focusing",
};

export default function TimerButtons() {
  const [status, setStatus] = useState(TimerStatus.RESTING);
  return (
    <div className="timer__btn-group">
      <button
        type="button"
        className={`timer__button timer__button--${status}`}
      >
        {buttonStatusText[status]}
      </button>
      {status !== TimerStatus.DEFAULT && (
        <div className="timer__btns">
          <Link to="/start-short-break" className="timer__link">
            Start short break
          </Link>
          <Link to="/long-break" className="timer__link">
            Start long break
          </Link>
        </div>
      )}
    </div>
  );
}
