import React from "react";
import AppBar from "../AppBar";
import Container from "../container";
import { Link, useNavigate } from "react-router-dom";
import { getStoredStatus, setStoredStatus } from "../../utils/storage";
import { Actions, usePomodoro } from "../context/PomodoroContext";
import { TimerStatus } from "../../types/time";
//@ts-ignore
import shortBreakImage from "../../assets/images/short-break.png";

export default function StartShortBreak() {
  const navigate = useNavigate();
  const { updatePomodoro } = usePomodoro();

  function handleShortBreak() {
    setStoredStatus(TimerStatus.RESTING).then(() => {
      getStoredStatus().then((storedStatus) => {
        updatePomodoro({ type: Actions.STATUS, payload: storedStatus });
        navigate("/start");
      });
    });
  }
  return (
    <Container className="start-break">
      <AppBar />
      <header className="start-break__header">
        <h2 className="start-break__title">Take a short break</h2>
        <p className="delete-note__subtitle">3 more pomodoros to go. Nice!</p>
      </header>
      <main className="start-break__main">
        <figure className="start-break__figure">
          <img src={shortBreakImage} alt="man" />
        </figure>

        <div className="timer__btn-group">
          <button
            type="button"
            className={`timer__button timer__button--short-break`}
            onClick={handleShortBreak}
          >
            Start short break
          </button>

          <div className="timer__btns">
            <Link to="/start" className="timer__link">
              Skip
            </Link>
            {/* <Link to="/long-break" className="timer__link">
              Start long break
            </Link> */}
          </div>
        </div>
      </main>
    </Container>
  );
}
