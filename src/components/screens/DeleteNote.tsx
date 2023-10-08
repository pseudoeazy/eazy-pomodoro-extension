import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Container from "../container";
import AppBar from "../AppBar";
import { Note } from "../../types/note";
import { getNotes, saveNotes } from "../../utils/storage";
//@ts-ignore
import deleteNoteImage from "../../assets/images/delete-note.png";

export default function DeleteNote() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getNotes().then((saveNotes) => {
      const noteId = Number(id);
      const noteToDelete = saveNotes.find((note) => note.id === noteId);

      if (noteToDelete) {
        setNote(noteToDelete);
      }
    });
  }, []);

  function handleDelete() {
    setIsLoading(true);
    getNotes().then((savedNotes) => {
      const remainNotes = savedNotes.filter(
        (savedNote) => savedNote.id !== note.id
      );

      saveNotes(remainNotes).then(() => {
        setIsLoading(false);
        navigate("/start");
      });
    });
  }
  return (
    <Container className="delete-note">
      <AppBar />
      <header className="delete-note__header">
        <h2 className="delete-note__title">Delete note?</h2>
        {note && <p className="delete-note__subtitle">{note.title}</p>}
        <p className="delete-note__subtitle delete-note__subtitle--warning">
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
            onClick={handleDelete}
            disabled={isLoading}
          >
            Delete{isLoading ? "..." : ""}
          </button>
        </div>
      </main>
    </Container>
  );
}
