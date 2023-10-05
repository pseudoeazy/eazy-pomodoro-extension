import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Arrow from "../assets/icons/arrow";
import { Note } from "../types/note";
import More from "../assets/icons/more";
import Trash from "../assets/icons/trash";
import Pen from "../assets/icons/pen";
import Circle from "../assets/icons/circle";
import Checked from "../assets/icons/checked";
import { getNotes } from "../utils/storage";

const sampleNote = {
  id: Date.now(),
  title: `Lorem ipsum`,
  description: `
  Sed ut perspiciatis unde omnis 
  iste natus error sit voluptatem 
  accusantium doloremque laudantium, 
  totam rem aperiam, `,
  isChecked: true,
};
const sampleNote2 = {
  id: Date.now(),
  title: `2Lorem ipsum`,
  description: `
    Sed ut perspiciatis unde omnis 
    iste natus error sit voluptatem 
    accusantium doloremque laudantium, 
    totam rem aperiam, `,
  isChecked: false,
};

export default function NoteCard() {
  const navigate = useNavigate();
  const [noteCards, setNoteCards] = useState<Note[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [curerntPage, setCurrentPage] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState("right");
  const notePerPage = 2;
  const totalNotes = notes.length;
  const Offset = (curerntPage - 1) * notePerPage;

  const handleNext = () => {
    setDirection("right");
    // setCurrentSlide((prevIndex) => {
    //   return prevIndex + 1 === notes.length ? 0 : prevIndex + 1;
    // });

    if (curerntPage + 1 === notes.length || curerntPage + 1 > notes.length) {
      return;
    }
    setCurrentPage((page) => page + 1);
  };

  // useEffect(() => {
  //   if (direction === "right") {
  //     setNoteCards(notes.slice(curerntPage, curerntPage + notePerPage));
  //   }
  // }, [curerntPage]);

  useEffect(() => {
    getNotes().then((notesFromStorage) => setNotes(notesFromStorage));
  }, []);

  useEffect(() => {
    setNoteCards(notes.slice(curerntPage, curerntPage + notePerPage));
  }, [notes]);

  function handleDelete() {
    navigate("/delete-note");
  }

  function handleEdit() {
    navigate("/add-note");
  }
  console.log(noteCards);
  return (
    <div className="note-card__container">
      <div className="note-card__content">
        <button className="note-card__arrow note-card__arrow--left">
          <Arrow opacity="0.3" />
        </button>
        <strong>
          Pomodoro {curerntPage} of {totalNotes}
        </strong>
        <button
          className="note-card__arrow  note-card__arrow--right"
          type="button"
          onClick={handleNext}
        >
          <Arrow opacity="1" />
        </button>
      </div>
      <div className="note-card__notes">
        {noteCards.map((note, idx) => (
          <div key={idx} className="note-card__card">
            <div className="note-card__card-title">
              <label
                htmlFor={`${note.title}-${note.id}`}
                className="note-card__label"
              >
                {note.isChecked ? <Checked /> : <Circle />}
                <input
                  type="checkbox"
                  id={`${note.title}-${note.id}`}
                  name={note.title}
                  className="note-card__checkbox"
                />

                <span className="note-card__card-title--text">
                  {note.title}
                </span>
              </label>
              <button className="note-card__more">
                <More />
              </button>
              <div className="note-card__drop-down">
                <button className="note-card__item" onClick={handleDelete}>
                  <span>
                    <Trash />
                  </span>
                  <span>Delete</span>
                </button>
                <button className="note-card__item" onClick={handleEdit}>
                  <span>
                    <Pen />
                  </span>
                  <span>Edit Note</span>
                </button>
              </div>
            </div>
            <div className="note-card__card-note">{note.description}</div>
          </div>
        ))}
        {noteCards.length === 0 && (
          <div className="note-card__card">
            <span className="note-card__empty">
              You don&#39;t have any notes yet
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
