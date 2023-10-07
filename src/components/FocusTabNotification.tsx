import React from "react";

export default function FocusTabNotification({ message }: { message: string }) {
  return (
    <div id="eazy-pomodoro-tab-notification">
      <div id="eazy-pomodoro-tab-notification-container">
        <img
          id="eazy-pomodoro-tab-notification-icon"
          src={chrome.runtime.getURL("icon.png")}
          alt="icon"
        />
        <p id="eazy-focus-pomodoro-container-message">{message}</p>
      </div>
    </div>
  );
}
