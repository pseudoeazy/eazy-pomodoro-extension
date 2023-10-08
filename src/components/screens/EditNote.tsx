import React from "react";
import EditNoteForm from "../forms/EditNoteForm";
import ModifyNote from "../ModifyNote";

export default function AddNote() {
  return (
    <ModifyNote>
      <EditNoteForm />
    </ModifyNote>
  );
}
