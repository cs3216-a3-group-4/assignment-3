import { EventDTO } from "@/client";
import Note from "@/components/notes/note";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MiniGenericAnalysisNote from "./mini-generic-analysis-note";

interface Props {
  event: EventDTO;
}

const EventAnnotations = ({ event }: Props) => {
  const analysisAnnotations = event.analysises
    .map((analysis) => analysis.notes)
    .flat();
  const eventNotes = event.notes;
  const allNotes = analysisAnnotations
    .concat(eventNotes)
    .sort((a, b) => a.id - b.id);

  return (
    <div className="flex flex-col w-full h-full min-h-full max-h-full p-8 bg-background border-l border-l-border">
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
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default EventAnnotations;
