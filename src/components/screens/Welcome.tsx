import React from "react";
import { Link } from "react-router-dom";
import Container from "../container";
import AppBar from "../AppBar";
//@ts-ignore
import startCycle from "../../assets/images/start-cycle.png";

export default function Welcome() {
  return (
    <Container className="welcome">
      <AppBar />
      <header className="welcome__header">
        <h2 className="welcome__title">Start focusing</h2>
      </header>
      <main className="welcome__main">
        <figure className="welcome__figure">
          <img src={startCycle} alt="man" />
        </figure>
        <div className="welcome__btn-container">
          <Link to="/start">
            <button className="welcome__button" type="button">
              Start pomodoro cycle
            </button>
          </Link>
        </div>
      </main>
    </Container>
  );
}
