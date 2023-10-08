import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import FocusTabNotification from "../components/FocusTabNotification";
import { Messages } from "../types/messages";
import "./contentScript.css";
import "@fontsource/roboto";
import { getFocusSettings } from "../utils/storage";

function App() {
  const [message, setMessage] = useState("");
  const [isTabNotification, setIsTabNotification] = useState(false);

  useEffect(() => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === Messages.RESET_STATUS) {
        setIsTabNotification(true);
        setTimeout(() => {
          sendResponse(Messages.RESET_STATUS);
          setIsTabNotification(false);
        }, 5000);
      }
      return true;
    });

    getFocusSettings().then((focus) => setMessage(focus.focusTitle));
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
