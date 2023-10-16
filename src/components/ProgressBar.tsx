import React from "react";

type Props = {
  targetTime: number;
  progress: number;
};

function barStopIndicator(range: number, progress: number, targetTime: number) {
  const currentProgress = (progress / 100) * targetTime;
  const halfOfProgress = targetTime * range - 62; //substracting 62 is hardfix
  //uncomment for debugging
  // console.log({ currentProgress, halfOfProgress, progress, targetTime, range });

  if (currentProgress >= halfOfProgress) return true;
  return false;
}

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
