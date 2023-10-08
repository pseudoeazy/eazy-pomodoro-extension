import React from "react";
import AddNoteForm from "../forms/AddNoteForm";
import ModifyNote from "../ModifyNote";

export default function AddNote() {
  return (
    <ModifyNote>
      <AddNoteForm />
    </ModifyNote>
  );
}
