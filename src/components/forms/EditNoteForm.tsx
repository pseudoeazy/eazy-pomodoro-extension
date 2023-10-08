import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Note } from "../../types/note";
import { useForm } from "react-hook-form";
import { getNotes, saveNotes } from "../../utils/storage";
import Error from "../alerts/Error";

export default function EditNoteForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [note, setNote] = useState<Note | null>(null);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const handleFormSubmit = async ({ title, description }) => {
    setIsLoading(true);
    setTimeout(() => {
      const updatedNote: Note = {
        id: Number(id),
        title,
        description,
        isChecked: note.isChecked,
      };
      setIsLoading(false);
      const upatedNotes = notes.map((note) => {
        if (note.id === updatedNote.id) {
          return updatedNote;
        }
        return note;
      });
      saveNotes(upatedNotes).then(() => navigate("/start"));
    }, 1000);
  };

  useEffect(() => {
    getNotes().then((notesFromStorage) => {
      setNotes(notesFromStorage);
    });
  }, []);

  useEffect(() => {
    const noteId = Number(id);
    const noteToEdit = notes.find((note) => note.id === noteId);
    if (noteToEdit) {
      reset({
        title: noteToEdit.title,
        description: noteToEdit.description,
      });
      setNote({ ...noteToEdit, id: noteId });
    }
  }, [notes]);
  return (
    <main className="add-note__main">
      <div className="add-note__content">
        {/* <div className="add-note__form-group">
          <span>Pomodoro no.*{`${id}`}</span>
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
