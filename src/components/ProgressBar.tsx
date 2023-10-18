import React from "react";
import { barStopIndicator } from "../utils/helpers";

type Props = {
  targetTime: number;
  progress: number;
};

export default function ProgressBar({ progress, targetTime }: Props) {
  const primaryColor = "#d45735";

  return (
    <div className="progress-bar">
      <div
        className="progress-bar__container"
        //@ts-ignore
        style={{ "--custom-width": `${progress}%` }}
      >
        <div
          style={{
            ...{ backgroundColor: primaryColor },
          }}
          className="progress-bar__step"
        ></div>
        <div
          style={{
            ...(barStopIndicator(0.5, progress, targetTime) && {
              backgroundColor: primaryColor,
            }),
          }}
          className="progress-bar__step"
        ></div>
        <div
          style={{
            ...(barStopIndicator(0.75, progress, targetTime) && {
              backgroundColor: primaryColor,
            }),
          }}
          className="progress-bar__step"
        ></div>
        <div
          style={{
            ...(progress === 100 && { backgroundColor: primaryColor }),
          }}
          className="progress-bar__step"
        ></div>
      </div>
    </div>
  );
}
