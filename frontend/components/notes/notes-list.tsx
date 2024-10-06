import { NoteDTO } from "@/client";
import Note from "@/components/notes/note";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Filter } from "@/components/notes/notes-selector";
import NotesCategories from "@/components/notes/notes-categories";

type Props = {
  notes: NoteDTO[];
  isNotesLoaded: boolean;
  filter: string;
};

const Notes = ({ notes, isNotesLoaded, filter }: Props) => {
    if (!isNotesLoaded) {
      return (
        <div className="flex justify-center items-center w-full">
            <LoadingSpinner className="w-24 h-24" />
        </div>
      );
    }
  
    if (notes!.length == 0) {
      return (
        <div className="flex w-full justify-center items-center">
          <p className="text-sm text-offblack">
            No notes yet. Add one to see it here!
          </p>
        </div>
      );
    }
  
    return (
        <div>
            {
            filter == Filter.DATE && notes.map((note) => (
                <Note key={note.id} data={note} />
            ))
            }
            {
              filter == Filter.CATEGORY && <NotesCategories />
            }
        </div>
    );
};
  
export default Notes;
  