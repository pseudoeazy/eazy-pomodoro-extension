import React, { useState } from "react";
import AppBar from "../AppBar";
import Container from "../container";
//@ts-ignore
import longBreak from "../../assets/images/long-break.png";
import { useNavigate } from "react-router-dom";
import Reload from "../../assets/icons/reload";

export default function LongBreak() {
  const [isAutomatic, setIsAutomatic] = useState(false);
  const navigate = useNavigate();

  function handleButtonClick() {
    navigate("/resting");
  }
  return (
    <Container className="start-break">
      <AppBar />
      <header className="start-break__header">
        <h2 className="start-break__title">Take a long break</h2>
        <p className="delete-note__subtitle">
          Pat on the back for doing a good job!
        </p>
      </header>
      <main className="start-break__main">
        <figure className="start-break__figure">
          <img src={longBreak} alt="man" />
        </figure>
        <div className="long-break__restart">
          <span className="long-break__reload">
            <Reload />
          </span>
          <span>Restart pomodoro cycle</span>
        </div>
      </main>
    </Container>
  );
}
