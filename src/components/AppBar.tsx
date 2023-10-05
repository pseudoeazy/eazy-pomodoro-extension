import React from "react";
import Reload from "../assets/icons/reload";
import Gear from "../assets/icons/gear";
import { Link, useNavigate } from "react-router-dom";

export default function AppBar() {
  const navigate = useNavigate();
  return (
    <div className="app-bar">
      <div className="logo">
        <Link to="/welcome" className="logo">
          <img src="icon.png" alt="logo" className="logo__img" />
          <span className="logo__title">Pomodoro</span>
        </Link>
      </div>

      <div className="app-bar__actions">
        <button
          title="Restart pomodoro cycle"
          type="button"
          className="app-bar__action"
          onClick={() => navigate("/reset-cycle")}
        >
          <Reload />
        </button>
        <button
          title="Go to settings"
          type="button"
          className="app-bar__action"
          onClick={() => navigate("/settings")}
        >
          <Gear />
        </button>
      </div>
    </div>
  );
}
