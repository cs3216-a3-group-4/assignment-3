import { EventDTO } from "@/client";
import Note from "@/components/notes/note";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MiniGenericAnalysisNote from "./mini-generic-analysis-note";
import { Button } from "@/components/ui/button";
import { PanelRightClose, PanelRightCloseIcon } from "lucide-react";

interface Props {
  event: EventDTO;
  hideAnnotationsPanel: () => void;
}

const EventAnnotations = ({ event, hideAnnotationsPanel }: Props) => {
  const analysisAnnotations = event.analysises
    .map((analysis) => analysis.notes)
    .flat();
  const eventNotes = event.notes;
  const allNotes = analysisAnnotations
    .concat(eventNotes)
    .sort((a, b) => a.id - b.id);

  return (
    <div className="flex flex-col w-full h-full min-h-full max-h-full p-8 bg-background border-l border-l-border">
      <span
        className="flex items-center mb-2 cursor-pointer text-muted-foreground/80 hover:text-muted-foreground"
        onClick={hideAnnotationsPanel}
      >
        <PanelRightCloseIcon className="h-4 w-4 mr-2" />
        View annotations on page
      </span>
      <h1 className="text-xl font-semibold">Your highlights and notes</h1>
      <div className="flex flex-col flex-1 max-h-[calc(100%_-_28px)]">
        <Tabs defaultValue="all" className="mt-2 h-full max-h-full">
          <TabsList className="mb-1">
            <TabsTrigger value="all">All ({allNotes.length})</TabsTrigger>
            <TabsTrigger value="highlights">
              Highlights ({analysisAnnotations.length})
            </TabsTrigger>
            <TabsTrigger value="notes">Notes ({eventNotes.length})</TabsTrigger>
          </TabsList>

          <div className="flex flex-col max-h-[calc(100%_-_44px)] overflow-y-auto">
            <TabsContent value="all">
              {allNotes.map((note) => (
                <MiniGenericAnalysisNote
                  note={note}
                  key={note.id}
                  eventAnalysis={event.analysises}
                  eventId={event.id}
                />
              ))}
              {allNotes.length === 0 && (
                <div className="bg-gray-200/40 text-gray-700 px-8 py-4 text-lg rounded">
                  No notes or highlights yet.
                </div>
              )}
            </TabsContent>

            <TabsContent value="highlights">
              {analysisAnnotations.map((note) => (
                <MiniGenericAnalysisNote
                  note={note}
                  key={note.id}
                  eventAnalysis={event.analysises}
                  eventId={event.id}
                />
              ))}
              {analysisAnnotations.length === 0 && (
                <div className="bg-gray-200/40 text-gray-700 px-8 py-4 text-lg rounded">
                  No highlights yet.
                </div>
              )}
            </TabsContent>

            <TabsContent value="notes">
              {eventNotes.map((note) => (
                <MiniGenericAnalysisNote
                  note={note}
                  key={note.id}
                  eventAnalysis={event.analysises}
                  eventId={event.id}
                />
              ))}
              {eventNotes.length === 0 && (
                <div className="bg-gray-200/40 text-gray-700 px-8 py-4 text-lg rounded">
                  No notes yet.
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default EventAnnotations;
