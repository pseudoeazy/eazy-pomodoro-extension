import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Container from "../container";
import Arrow from "../../assets/icons/arrow";
import Error from "../alerts/Error";
import { Note } from "../../types/note";
import { saveNotes, getNotes } from "../../utils/storage";

export default function AddNote() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const handleFormSubmit = async ({ title, description }) => {
    setIsLoading(true);
    setTimeout(() => {
      const note: Note = {
        id: Date.now(),
        title,
        description,
        isChecked: false,
      };
      setIsLoading(false);
      saveNotes([...notes, note]).then(() => navigate("/start"));
    }, 1000);
  };

  useEffect(() => {
    getNotes().then((notesFromStorage) => {
      setNotes(notesFromStorage);
    });
  }, []);

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
      <main className="add-note__main">
        <div className="add-note__content">
          <div className="add-note__form-group">
            <span>Pomodoro no.*</span>
            <select className="add-note__select">
              <option value="Pomodoro 1">Pomodoro 1</option>
            </select>
          </div>
          <form
            className="add-note__form"
            onSubmit={handleSubmit(handleFormSubmit)}
          >
            <div className="add-note__form-group">
              <label htmlFor="title" className="add-note__label">
                Title
              </label>
              <input
                name="title"
                type="text"
                placeholder="Enter title"
                className="add-note__input"
                {...register("title", {
                  required: true,
                })}
              />
              {errors.title && errors.title?.type === "required" && (
                <Error text=" title cannot be blank" />
              )}
            </div>
            <div className="add-note__form-group">
              <label htmlFor="note" className="add-note__label">
                Note *
              </label>
              <textarea
                name="description"
                placeholder="Enter Note"
                className="add-note__textarea"
                {...register("description", {
                  required: true,
                })}
              ></textarea>
              {errors.description &&
                errors.description?.type === "required" && (
                  <Error text=" note cannot be blank" />
                )}
            </div>
            <div className="add-note__form-group">
              <button
                className={`add-note__button ${
                  isLoading && "add-note__button--loading"
                }`}
                type="submit"
                disabled={isLoading}
              >
                Save{isLoading ? "..." : ""}
              </button>
            </div>
          </form>
        </div>
      </main>
    </Container>
  );
}
