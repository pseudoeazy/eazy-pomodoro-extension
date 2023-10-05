import React, { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../container";
import Arrow from "../../assets/icons/arrow";
import Tab from "../Tab";

export default function Settings() {
  const navigate = useNavigate();

  function handleSaveNote(e: FormEvent) {
    e.preventDefault();
    navigate("/start");
  }

  return (
    <Container className="add-note">
      <div className="add-note__top-bar">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="add-note__back-btn"
        >
          <Arrow opacity="1" />
        </button>
      </div>
      <header className="add-note__header">
        <h2 className="add-note__title">Settings</h2>
      </header>
      <main className="add-note__main">
        <Tab />
      </main>
    </Container>
  );
}
