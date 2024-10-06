"use client";

import { CategoryDTO } from "@/client";
import Notes from "@/components/notes/notes-list";
import { Filter } from "@/components/notes/notes-selector";
import { getCategories } from "@/queries/category";
import { getAllNotes } from "@/queries/note";
import { useQuery } from "@tanstack/react-query";
import { Notebook } from "lucide-react";
import { useEffect, useState } from "react";

const Page = ({ params }: { params: { id: string } }) => {
    const categoryId = parseInt(params.id);
    const [category, setCategory] = useState<CategoryDTO | null>(null);
    const { data: categories, isSuccess: isCategoriesLoaded } =
    useQuery(getCategories());
    const { data: notes, isSuccess: isNotesLoaded } = useQuery(getAllNotes(categoryId));

    // Very inefficient, but is there a better way to do this? New StoreProvider for CategoryDTO[]?
    useEffect(() => {
        if (isCategoriesLoaded && categories!.length > 0) {
                categories!.forEach((category: CategoryDTO) => {
            if (category.id == categoryId) {
                setCategory(category);
            }
        });
        }
    }, [categories, isCategoriesLoaded, categoryId]);

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
                            <Notebook className="w-7 h-7" />
                            <span className="text-4xl 2xl:text-4xl font-bold text-primary-800">
                                {category ? `Notes for ${category.name}` : "My Notes"}
                            </span>
                        </div>
                        <Notes notes={notes || []} isNotesLoaded={isNotesLoaded} filter={Filter.DATE} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;