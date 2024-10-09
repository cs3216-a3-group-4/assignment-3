"use client";

import { createElement, useState } from "react";
import { SubmitHandler } from "react-hook-form";
import {
  ChevronsDownUpIcon,
  ChevronsUpDownIcon,
  NotebookIcon,
} from "lucide-react";

import { EventDTO } from "@/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [showNotes, setShowNotes] = useState<boolean>(false);
  const numNotes = event?.notes ? event.notes.length : 0;

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
        content,
        category_id: category_id ? parseInt(category_id) : undefined,
      });
    };

  return (
    <div className="flex flex-col px-6 gap-y-8">
      <div className="flex flex-col gap-y-1">
        <span className="flex items-center font-medium text-3xl mb-6">
          <NotebookIcon className="inline-flex mr-3 stroke-offblack fill-muted" />
          <h1 className="flex items-center font-medium text-3xl px-2">
            My Notes
          </h1>
          {createElement(showNotes ? ChevronsUpDownIcon : ChevronsDownUpIcon, {
            onClick: () => setShowNotes((prevState) => !prevState),
            size: 20,
            strokeWidth: 2.4,
          })}
        </span>
        <div className={`flex flex-col gap-y-4 ${showNotes ? "" : "hidden"}`}>
          <Tabs defaultValue="saved">
            <TabsList>
              <TabsTrigger value="saved">Saved {`(${numNotes})`}</TabsTrigger>
              <TabsTrigger value="new">New</TabsTrigger>
            </TabsList>
            <TabsContent value="saved">
              {event.notes.map((note) => (
                <div key={note.id}>
                  {note.content}, {note.category!.name}
                  <Button onClick={() => deleteNoteMutation.mutate(note.id)}>
                    delete
                  </Button>
                  <NoteForm onSubmit={handleEditNote(note.id)} />
                </div>
              ))}
            </TabsContent>
            <TabsContent value="new">
              <NoteForm onSubmit={handleAddNote} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default EventNotes;
