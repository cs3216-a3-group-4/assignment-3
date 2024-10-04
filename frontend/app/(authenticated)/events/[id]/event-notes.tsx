"use client";

import { SubmitHandler } from "react-hook-form";
import { NotebookIcon } from "lucide-react";

import { EventDTO } from "@/client";
import { Button } from "@/components/ui/button";
import {
  useAddEventNote,
  useDeleteNote,
  useEditEventNote,
} from "@/queries/note";

import NoteForm, { NoteFormType } from "./note-form";

interface Props {
  event: EventDTO;
}

const EventNotes = ({ event }: Props) => {
  const addNoteMutation = useAddEventNote(event.id);
  const deleteNoteMutation = useDeleteNote(event.id);
  const editNoteMutation = useEditEventNote(event.id);

  const handleAddNote: SubmitHandler<NoteFormType> = ({
    content,
    category_id,
  }) => {
    addNoteMutation.mutate({ category_id: parseInt(category_id!), content });
  };

  const handleEditNote: (id: number) => SubmitHandler<NoteFormType> =
    (id: number) =>
    ({ content, category_id }) => {
      editNoteMutation.mutate({
        id,
        category_id: parseInt(category_id!),
        content,
      });
    };

  return (
    <div className="flex flex-col px-6 gap-y-8">
      <div className="flex flex-col gap-y-1">
        <span className="flex items-center font-medium text-3xl mb-6">
          <NotebookIcon className="inline-flex mr-3 stroke-offblack fill-muted" />
          Notes
        </span>
        <NoteForm onSubmit={handleAddNote} />
        <hr />
        {event.notes.map((note) => (
          <div key={note.id}>
            {note.content}, {note.category.name}
            <Button onClick={() => deleteNoteMutation.mutate(note.id)}>
              delete
            </Button>
            <NoteForm onSubmit={handleEditNote(note.id)} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventNotes;
