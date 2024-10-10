"use client";

import { createElement, useState } from "react";
import { SubmitHandler } from "react-hook-form";
import {
  ChevronsDownUpIcon,
  ChevronsUpDownIcon,
  EditIcon,
  NotebookIcon,
  TrashIcon,
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
import CategoryChip from "@/components/display/category-chip";
import { Category } from "@/types/categories";
import NoteItem from "./note-item";

interface Props {
  event: EventDTO;
}

const EventNotes = ({ event }: Props) => {
  const addNoteMutation = useAddEventNote(event.id);
  const deleteNoteMutation = useDeleteNote(event.id);
  const editNoteMutation = useEditEventNote(event.id);
  const [showNotes, setShowNotes] = useState<boolean>(true);
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
        </span>
        <div className={`flex flex-col gap-y-4 ${showNotes ? "" : "hidden"}`}>
          <Tabs defaultValue="saved">
            <TabsList className="mb-2 h-12">
              <TabsTrigger value="saved" className="text-lg">
                Saved {`(${numNotes})`}
              </TabsTrigger>
              <TabsTrigger value="new" className="text-lg">
                New
              </TabsTrigger>
            </TabsList>
            <TabsContent value="saved" className="flex flex-col gap-y-8">
              {event.notes.map((note) => (
                <NoteItem
                  note={note}
                  eventId={event.id}
                  handleEditNote={handleEditNote}
                />
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
