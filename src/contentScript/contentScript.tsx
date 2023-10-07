import React from "react";
import { createRoot } from "react-dom/client";
import FocusTabNotification from "../components/FocusTabNotification";
import "./contentScript.css";
import "@fontsource/roboto";

function App() {
  return (
    <div id="eazy-pomodoro-content-script">
      <FocusTabNotification />
    </div>
  );
}

const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);
root.render(<App />);
