import React from "react";
import { useNavigate } from "react-router-dom";
import Container from "./container";
import Arrow from "../assets/icons/arrow";

interface Props {
  children: React.ReactNode;
}
export default function ModifyNote({ children }: Props) {
  const navigate = useNavigate();
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
        <h2 className="add-note__title">Notes</h2>
      </header>
      {children}
    </Container>
  );
}
