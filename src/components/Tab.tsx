import React, { useState } from "react";
import FocusContentForm from "./forms/FocusContentForm";
import ShortBreakForm from "./forms/ShortBreakForm";
import LongBreakForm from "./forms/LongBreakForm";

const tabs = [
  { id: "focus", label: "Focus" },
  { id: "short-break", label: "Short break" },
  { id: "long-break", label: "Long break" },
];

export default function Tab() {
  const [active, setActive] = useState(tabs[0]);
  return (
    <div className="tab">
      <ul className="tab__header">
        {tabs.map((tab, idx) => (
          <li
            key={idx}
            className={`tab__menu ${
              tab.id === active.id && "tab__menu--active"
            }`}
            onClick={() => setActive(tab)}
          >
            {tab.label}
          </li>
        ))}
      </ul>
      <div>
        {active.id === "focus" && <FocusContentForm />}
        {active.id === "short-break" && <ShortBreakForm />}
        {active.id === "long-break" && <LongBreakForm />}
      </div>
    </div>
  );
}
