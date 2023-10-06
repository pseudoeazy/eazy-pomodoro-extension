import React from "react";
import { useNavigate } from "react-router-dom";
import Container from "../container";
import AppBar from "../AppBar";
import { getStoredStatus, setStoredStatus } from "../../utils/storage";
import { TimerStatus } from "../../types/time";
import { Actions, usePomodoro } from "../context/PomodoroContext";
//@ts-ignore
import deleteNoteImage from "../../assets/images/delete-note.png";

export default function ResetCycle() {
  const navigate = useNavigate();
  const { updatePomodoro } = usePomodoro();

  function handleRestart() {
    setStoredStatus(TimerStatus.DEFAULT).then(() => {
      getStoredStatus().then((storedStatus) => {
        updatePomodoro({ type: Actions.STATUS, payload: storedStatus });
        navigate("/start");
      });
    });
  }
  return (
    <Container className="delete-note">
      <AppBar />
      <header className="delete-note__header">
        <h2 className="delete-note__title">Restart pomodoro cycle?</h2>
        <p className="delete-note__subtitle">
          This is permanent and cannot be undone
        </p>
      </header>
      <main className="delete-note__main">
        <figure className="delete-note__figure">
          <img src={deleteNoteImage} alt="delete-image" />
        </figure>
        <div className="delete-note__btn-container">
          <button
            className="delete-note__button delete-note__button--blank"
            type="button"
            onClick={() => navigate("/start")}
          >
            Cancel
          </button>

          <button
            className="delete-note__button delete-note__button--fill"
            type="button"
            onClick={handleRestart}
          >
            Reset
          </button>
        </div>
      </main>
    </Container>
  );
}
