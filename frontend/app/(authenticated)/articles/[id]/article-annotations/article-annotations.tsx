import { PanelRightCloseIcon } from "lucide-react";

import { ArticleDTO } from "@/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import MiniGenericConceptNote from "./mini-generic-concept-note";

interface Props {
  article: ArticleDTO;
  hideAnnotationsPanel: () => void;
}

const ArticleAnnotations = ({ article, hideAnnotationsPanel }: Props) => {
  const conceptAnnotations = article.article_concepts
    .map((article_concept) => article_concept.concept.notes)
    .flat();
  const articleNotes = article.notes;
  const allNotes = conceptAnnotations
    .concat(articleNotes)
    .sort((a, b) => a.id - b.id);

  return (
    <div className="flex flex-col w-full h-full min-h-full max-h-full p-8 bg-background border-l border-l-border">
      <span
        className="flex items-center mb-2 cursor-pointer text-muted-foreground/80 hover:text-muted-foreground"
        onClick={hideAnnotationsPanel}
      >
        <PanelRightCloseIcon className="h-4 w-4 mr-2" />
        Hide annotations panel
      </span>
      <h1 className="text-xl font-semibold">Your highlights and notes</h1>
      <div className="flex flex-col flex-1 max-h-[calc(100%_-_28px)]">
        <Tabs className="mt-2 h-full max-h-full" defaultValue="all">
          <TabsList className="mb-1">
            <TabsTrigger value="all">All ({allNotes.length})</TabsTrigger>
            <TabsTrigger value="highlights">
              Highlights ({conceptAnnotations.length})
            </TabsTrigger>
            <TabsTrigger value="notes">
              Notes ({articleNotes.length})
            </TabsTrigger>
          </TabsList>

          <div className="flex flex-col max-h-[calc(100%_-_44px)] overflow-y-auto w-full">
            <TabsContent value="all">
              {allNotes.map((note) => (
                <MiniGenericConceptNote
                  articleConcepts={article.article_concepts}
                  articleId={article.id}
                  key={note.id}
                  note={note}
                />
              ))}
              {allNotes.length === 0 && (
                <div className="bg-gray-200/40 text-gray-700 px-8 py-4 text-lg rounded">
                  No notes or highlights yet.
                </div>
              )}
            </TabsContent>

            <TabsContent value="highlights">
              {conceptAnnotations.map((note) => (
                <MiniGenericConceptNote
                  articleConcepts={article.article_concepts}
                  articleId={article.id}
                  key={note.id}
                  note={note}
                />
              ))}
              {conceptAnnotations.length === 0 && (
                <div className="bg-gray-200/40 text-gray-700 px-8 py-4 text-lg rounded">
                  No highlights yet.
                </div>
              )}
            </TabsContent>

            <TabsContent value="notes">
              {articleNotes.map((note) => (
                <MiniGenericConceptNote
                  articleConcepts={article.article_concepts}
                  articleId={article.id}
                  key={note.id}
                  note={note}
                />
              ))}
              {articleNotes.length === 0 && (
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

export default ArticleAnnotations;
