import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Arrow from "../assets/icons/arrow";
import { Note } from "../types/note";
import More from "../assets/icons/more";
import Trash from "../assets/icons/trash";
import Pen from "../assets/icons/pen";
import Circle from "../assets/icons/circle";
import Checked from "../assets/icons/checked";
import { getNotes, saveNotes } from "../utils/storage";

interface NoteCard {
  note: Note;
  toggle: boolean;
}
function sortNoteCard(notes: NoteCard[]) {
  return notes.sort(
    (noteCardA, noteCardB) => noteCardB.note.id - noteCardA.note.id
  );
}
export default function NoteCard() {
  const navigate = useNavigate();
  const [noteCards, setNoteCards] = useState<NoteCard[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(2); // Number of items to display per page

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = noteCards.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = notes.length / itemsPerPage;

  const handleToggle = (noteCardToToggle: NoteCard) => {
    const toggledCards = noteCards.map((noteCard) => {
      if (noteCard.note.id === noteCardToToggle.note.id) {
        return { ...noteCard, toggle: !noteCard.toggle };
      }
      return noteCard;
    });
    setNoteCards(toggledCards);
  };

  const handleChecked = async (noteCardToCheck: NoteCard) => {
    console.log("handleChecked:", noteCardToCheck);
    const checkedNoteCards = noteCards.map((noteCard) => {
      if (noteCard.note.id === noteCardToCheck.note.id) {
        return {
          ...noteCard,
          note: {
            ...noteCard.note,
            isChecked: !noteCardToCheck.note.isChecked,
          },
        };
      }
      return noteCard;
    });
    const updatedNotes = checkedNoteCards.map((noteCard) => {
      const { note } = noteCard;
      return note;
    });

    saveNotes(updatedNotes);
    setNoteCards(checkedNoteCards);
  };

  const handleNext = () => {
    // setDirection("right");
    // setCurrentSlide((prevIndex) => {
    //   return prevIndex + 1 === notes.length ? 0 : prevIndex + 1;
    // });
    // if (curerntPage + 1 === notes.length || curerntPage + 1 > notes.length) {
    //   return;
    // }
    // setCurrentPage((page) => page + 1);
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
    setNoteCards(
      notes.map((note) => ({
        toggle: false,
        note,
      }))
    );
  }, [notes]);

  function handleDelete(id: number) {
    navigate(`/delete-note/${id}`);
  }

  function handleEdit(id: number) {
    navigate(`/add-note/${id}`);
  }

  return (
    <div className="note-card__container">
      <div className="note-card__content">
        <button className="note-card__arrow note-card__arrow--left">
          <Arrow opacity="0.3" />
        </button>
        <strong>
          Pomodoro {currentPage} of {totalPages}
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
        {sortNoteCard(noteCards).map((noteCard, idx) => (
          <div key={idx} className="note-card__card">
            <div className="note-card__card-title">
              <label
                htmlFor={`${noteCard.note.title}-${noteCard.note.id}`}
                className="note-card__label"
              >
                {noteCard.note.isChecked ? <Checked /> : <Circle />}
                <input
                  type="checkbox"
                  id={`${noteCard.note.title}-${noteCard.note.id}`}
                  name={noteCard.note.title}
                  className="note-card__checkbox"
                  checked={noteCard.note.isChecked}
                  onChange={() => handleChecked(noteCard)}
                />

                <span className="note-card__card-title--text">
                  {noteCard.note.title}
                </span>
              </label>
              <button
                className="note-card__more"
                type="button"
                onClick={() => handleToggle(noteCard)}
              >
                <More />
              </button>
              <div
                className={`${
                  !noteCard.toggle ? "note-card__hide-menu" : ""
                } note-card__drop-down  `}
              >
                <button
                  className="note-card__item"
                  onClick={() => handleDelete(noteCard.note.id)}
                >
                  <span>
                    <Trash />
                  </span>
                  <span>Delete</span>
                </button>
                <button
                  className="note-card__item"
                  onClick={() => handleEdit(noteCard.note.id)}
                >
                  <span>
                    <Pen />
                  </span>
                  <span>Edit Note</span>
                </button>
              </div>
            </div>
            <div className="note-card__card-note">
              {noteCard.note.description}
            </div>
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
