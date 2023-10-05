import React, { useState } from "react";
import { TimerStatus } from "../types/time";

const statusText = {
  default: "Ready?",
  focusing: "Focusing",
  resting: "Resting",
  paused: "Paused",
};

export default function Timer() {
  const [status, setStatus] = useState(TimerStatus.RESTING);
  return (
    <div className="timer">
      <div className="timer__screen">
        <div>
          <div className={`timer__ready timer__${status}`}>
            {status === TimerStatus.PAUSED && (
              <span className="timer__circle"></span>
            )}
            <strong>{statusText[status]}</strong>
          </div>
          <time className={`timer__time timer__${status}`}>00:00:00</time>
        </div>
      </div>
    </div>
  );
}
