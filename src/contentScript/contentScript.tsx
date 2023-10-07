import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./contentScript.css";
import "@fontsource/roboto";
import { Messages } from "../types/messages";

const FocusTabNotification = () => {
  return (
    <div id="eazy-pomodoro-tab-notification">
      <div id="eazy-pomodoro-tab-notification-container">
        <img
          id="eazy-pomodoro-tab-notification-icon"
          src={chrome.runtime.getURL("icon.png")}
          alt="icon"
        />
        <p id="eazy-focus-pomodoro-container-message">
          This is a tab notification!
        </p>
      </div>
    </div>
  );
};

function App() {
  const [isTabNotify, setIsTabNotify] = useState(false);
  useEffect(() => {
    chrome.runtime.onMessage.addListener((message) => {
      if (message === Messages.FOCUS_TAB_NOTIFICATION) {
        console.log("content Script notification");
        setIsTabNotify(true);
        setTimeout(() => {
          setIsTabNotify(false);
        }, 5000);
      }
      return true;
    });
  }, []);

  return <>{isTabNotify && <FocusTabNotification />}</>;
}

const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);
root.render(<App />);
