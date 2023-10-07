import React, { useState, useEffect } from "react";
import { getFocusSettings } from "../utils/storage";
import { Messages } from "../types/messages";

export default function FocusTabNotification() {
  const [message, setMessage] = useState("");
  const [isTabNotification, setIsTabNotification] = useState(false);

  useEffect(() => {
    chrome.runtime.onMessage.addListener((message) => {
      if (message.type === Messages.RESET_STATUS) {
        setIsTabNotification(true);
        setTimeout(() => {
          setIsTabNotification(false);
        }, 5000);
      }
      return true;
    });

    getFocusSettings().then((focus) => setMessage(focus.focusTitle));
  }, []);

  return (
    <>
      {isTabNotification && (
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
      )}
    </>
  );
}
