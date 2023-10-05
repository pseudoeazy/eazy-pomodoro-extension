import React, { useState } from "react";
import { TimerStatus } from "../types/time";

export default function ProgressBar() {
  const [status, setStatus] = useState(TimerStatus.DEFAULT);
  return (
    <div className="progress-bar">
      <div className="progress-bar__container">
        <div className="progress-bar__step"></div>
        <div className="progress-bar__step"></div>
        <div className="progress-bar__step"></div>
        <div className="progress-bar__step"></div>
      </div>
    </div>
  );
}
