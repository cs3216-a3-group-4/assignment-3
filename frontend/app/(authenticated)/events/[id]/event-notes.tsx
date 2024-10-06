"use client";

import { SubmitHandler } from "react-hook-form";
import { ChevronsDownUpIcon, ChevronsUpDownIcon, NotebookIcon } from "lucide-react";

import { EventDTO } from "@/client";
import { Button } from "@/components/ui/button";
import {
  useAddEventNote,
  useDeleteNote,
  useEditEventNote,
} from "@/queries/note";

import NoteForm, { NoteFormType } from "./note-form";
import { createElement, useState } from "react";

interface Props {
  event: EventDTO;
}

const EventNotes = ({ event }: Props) => {
  const addNoteMutation = useAddEventNote(event.id);
  const deleteNoteMutation = useDeleteNote(event.id);
  const editNoteMutation = useEditEventNote(event.id);
  const [ showNotes, setShowNotes ] = useState<boolean>(false);

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
        <div className="flex items-center mb-6">
          <NotebookIcon className="inline-flex mr-3 stroke-offblack fill-muted" />
          <h1 className="flex items-center font-medium text-3xl px-2">
            My Notes
          </h1>
          {createElement( showNotes ? ChevronsUpDownIcon : ChevronsDownUpIcon, {
            onClick: () => setShowNotes((prevState) => !prevState),
            size: 20,
            strokeWidth: 2.4,
          })}
        </div>
        <div className={`flex flex-col gap-y-4 ${showNotes ? "" : "hidden"}`}>
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
    </div>
  );
};

export default EventNotes;
