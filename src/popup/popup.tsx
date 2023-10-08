import React from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Welcome from "../components/screens/Welcome";
import StartFocusing from "../components/screens/StartFocusing";
import AddNote from "../components/screens/AddNote";
import DeleteNote from "../components/screens/DeleteNote";
import StartShortBreak from "../components/screens/StartShortBreak";
import Resting from "../components/screens/Resting";
import LongBreak from "../components/screens/LongBreak";
import Settings from "../components/screens/Settings";
import ResetCycle from "../components/screens/ResetCycle";
import EditNote from "../components/screens/EditNote";
import PomodoroProvider from "../components/context/PomodoroProvider";

import "./popup.css";
import "@fontsource/roboto";

function App() {
  return (
    <PomodoroProvider>
      <MemoryRouter initialEntries={["/welcome"]}>
        <Routes>
          <Route path="/welcome" Component={Welcome} />
          <Route path="/start" element={<StartFocusing />} />
          <Route path="/add-note" element={<AddNote />} />
          <Route path="/add-note/:id" element={<EditNote />} />
          <Route path="/delete-note/:id" element={<DeleteNote />} />
          <Route path="/start-short-break" element={<StartShortBreak />} />
          <Route path="/resting" element={<Resting />} />
          <Route path="/long-break" element={<LongBreak />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/reset-cycle" element={<ResetCycle />} />
        </Routes>
      </MemoryRouter>
    </PomodoroProvider>
  );
}

const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);
root.render(<App />);
