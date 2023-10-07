import { Messages } from "../types/messages";
import { getFocusSettings } from "../utils/storage";
import "./contentScript.css";

// Create a function to display the tab notification
function showTabNotification() {
  getFocusSettings().then((focus) => {
    if (focus.focusTabNotification) {
      const notificationContainer = document.createElement("div");
      notificationContainer.id = "eazy-pomodoro-tab-notification";

      notificationContainer.innerHTML = `
      <style>
      #eazy-pomodoro-tab-notification {
        position: fixed;
        z-index: 1000000;
        top: 10px;
        right: 10px;
        background-color: #0078d4;
        color: #ffffff;
        padding: 10px;
        border-radius: 5px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
      }
      #eazy-pomodoro-tab-notification-container {
        font-family: "Roboto", sans-serif !important;
        display: flex;
        align-items: center;
        padding: 8px;
      }
      #eazy-pomodoro-tab-notification-icon {
        display: inline-block;
        width: 2rem;
        height: 2rem;
        margin-right: 4px;
      }
      </style>
        <div id="eazy-pomodoro-tab-notification-container">
        <img
          id="eazy-pomodoro-tab-notification-icon"
          src=${chrome.runtime.getURL("icon.png")}
          alt="icon"
        />
        <p id="eazy-focus-pomodoro-container-message">
          ${focus.focusTitle}
        </p>
      </div>`;

      document.body.appendChild(notificationContainer);

      // Remove the notification after a few seconds (adjust the timeout as needed)
      setTimeout(() => {
        notificationContainer.remove();
      }, 5000);
    }
  });
}

chrome.runtime.onMessage.addListener((message) => {
  console.log("listen for message event");
  if (message.type === Messages.RESET_STATUS) {
    console.log("reset event triggered");
    showTabNotification();
  }
  return true;
});

console.log("hello from content script");
