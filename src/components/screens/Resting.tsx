import React from "react";
import Container from "../container";
import TimerButtons from "../TimerButtons";
import AppBar from "../AppBar";
import Timer from "../Timer";
//@ts-ignore
import restingImage from "../../assets/images/resting.png";

export default function Resting() {
  return (
    <Container className="start-break">
      <AppBar />
      <main className="start-break__main">
        <Timer />
        <figure className="start-break__figure">
          <img src={restingImage} alt="man" />
        </figure>
        <TimerButtons />
      </main>
    </Container>
  );
}
