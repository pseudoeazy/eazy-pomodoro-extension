import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Note } from "../../types/note";
import { useForm } from "react-hook-form";
import { getNotes, saveNotes } from "../../utils/storage";
import Error from "../alerts/Error";

export default function AddNoteForm() {
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
    <main className="add-note__main">
      <div className="add-note__content">
        {/* <div className="add-note__form-group">
          <span>Pomodoro no.*</span>
          <select className="add-note__select">
            <option value="Pomodoro 1">Pomodoro 1</option>
          </select>
        </div> */}
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
            {errors.description && errors.description?.type === "required" && (
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
  );
}
