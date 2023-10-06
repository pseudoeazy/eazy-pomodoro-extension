import React from "react";
import Container from "../container";
import AppBar from "../AppBar";
import ProgressBar from "../ProgressBar";
import Timer from "../Timer";
import { Link } from "react-router-dom";
import NoteCard from "../NoteCard";
import TimerButtons from "../TimerButtons";
import { usePomodoro } from "../context/PomodoroContext";
import { TimerStatus } from "../../types/time";
import Resting from "./Resting";

export default function StartFocusing() {
  const { pomodoro } = usePomodoro();
  return (
    <>
      {pomodoro.status !== TimerStatus.RESTING && (
        <Container className="start">
          <AppBar />
          <ProgressBar />
          <Timer />
          <div className="timer">
            <TimerButtons />
          </div>
          <div>
            <div className="start__title">
              <span className="start__title--1">
                <strong>Notes</strong>
              </span>
              <Link to="/add-note">
                <span className="start__title--2">Add notes</span>
              </Link>
            </div>
          </div>
          <NoteCard />
        </Container>
      )}
      {pomodoro.status === TimerStatus.RESTING && <Resting />}
    </>
  );
}
