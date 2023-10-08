import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import FocusTabNotification from "../components/FocusTabNotification";
import { Messages } from "../types/messages";
import "./contentScript.css";
import "@fontsource/roboto";
import { getFocusSettings, getShortBreakSettings } from "../utils/storage";

function App() {
  const [message, setMessage] = useState("");
  const [isTabNotification, setIsTabNotification] = useState(false);

  useEffect(() => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === Messages.RESET_STATUS) {
        getFocusSettings().then((focus) => {
          setIsTabNotification(focus.focusTabNotification);
          setMessage(focus.focusTitle);
        });
        setTimeout(() => {
          sendResponse(Messages.RESET_STATUS);
          setIsTabNotification(false);
        }, 5000);
      }

      if (message.type === Messages.SHORTBREAK_OVER) {
        getShortBreakSettings().then((shortBreak) => {
          setIsTabNotification(shortBreak.isShortBreakTabNotification);
          setMessage(shortBreak.shortBreakTitle);
        });

        setTimeout(() => {
          sendResponse(Messages.SHORTBREAK_OVER);
          setIsTabNotification(false);
        }, 6000);
      }
      return true;
    });
  }, []);

  return (
    <div id="eazy-pomodoro-content-script">
      {isTabNotification && <FocusTabNotification message={message} />}
    </div>
  );
}

const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);
root.render(<App />);
