"use client";

import { useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { NotebookIcon } from "lucide-react";

import { EventDTO } from "@/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useAddEventNote,
  useDeleteNote,
  useEditEventNote,
} from "@/queries/note";

import NoteForm, { NoteFormType } from "./note-form";
import NoteItem from "./note-item";

interface Props {
  event: EventDTO;
}

const EventNotes = ({ event }: Props) => {
  const addNoteMutation = useAddEventNote(event.id);
  const deleteNoteMutation = useDeleteNote(event.id);
  const editNoteMutation = useEditEventNote(event.id);
  const [showNotes, setShowNotes] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("saved");
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
          <Tabs value={activeTab}>
            <TabsList className="mb-2 h-12">
              <TabsTrigger
                className="text-lg"
                onClick={() => setActiveTab("saved")}
                value="saved"
              >
                Saved {`(${numNotes})`}
              </TabsTrigger>
              <TabsTrigger
                className="text-lg"
                onClick={() => setActiveTab("new")}
                value="new"
              >
                New
              </TabsTrigger>
            </TabsList>
            <TabsContent className="flex flex-col gap-y-8" value="saved">
              {event.notes.map((note) => (
                <NoteItem
                  eventId={event.id}
                  handleEditNote={handleEditNote}
                  key={note.id}
                  note={note}
                />
              ))}
              {event.notes.length === 0 && (
                <div className="bg-gray-200/40 text-gray-700 px-8 py-4 text-lg rounded">
                  No notes yet.{" "}
                  <Button
                    className="px-0"
                    onClick={() => setActiveTab("new")}
                    size="lg"
                    variant="link"
                  >
                    Create one?
                  </Button>
                </div>
              )}
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
