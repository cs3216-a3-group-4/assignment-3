"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Notebook } from "lucide-react";

import { NoteDTO } from "@/client";
import Notes from "@/components/notes/notes-list";
import NotesSelector, { Filter } from "@/components/notes/notes-selector";
import { getAllNotes } from "@/queries/note";

const Page = () => {
  const { data: fetchedNotes, isSuccess: isNotesLoaded } =
    useQuery(getAllNotes());
  const [notes, setNotes] = useState<NoteDTO[]>([]);
  const [filter, setFilter] = useState<string>(Filter.CATEGORY);

  useEffect(() => {
    if (isNotesLoaded) {
      setNotes(fetchedNotes!);
    }
  }, [isNotesLoaded]);

  return (
    <div className="relative w-full h-full">
      <div
        className="flex bg-muted w-full h-full max-h-full py-8 overflow-y-auto"
        id="notes-page"
      >
        <div className="flex flex-col py-6 lg:py-12 w-full h-fit mx-4 md:mx-8 xl:mx-24 bg-background rounded-lg border border-border px-8">
          {/* TODO: x-padding here is tied to the news article */}
          <div
            className="flex flex-col mb-4 gap-y-2 px-4 md:px-8 xl:px-12"
            id="notes-page-content"
          >
            <div className="flex items-baseline gap-4" id="note-page-title">
              <Notebook className="w-8 h-8 grow-0 self-center" />
              <span className="text-4xl 2xl:text-4xl font-bold text-primary-800 grow">
                My Notes
              </span>
              <NotesSelector filter={filter} setFilter={setFilter} />
            </div>
            <Notes
              filter={filter}
              isNotesLoaded={isNotesLoaded}
              notes={notes || []}
              setNotes={setNotes}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
