"use client";

import NotesCategoryItem from "@/components/notes/notes-category-item";
import { getCategories } from "@/queries/category";
import { useQuery } from "@tanstack/react-query";

const NotesCategories = () => {
    const { data: categories, isSuccess } = useQuery(getCategories());
    
    return (
        <div className="flex flex-col w-full">
            {isSuccess && categories!.map((category) => 
                <NotesCategoryItem
                  key={category.id}
                  title={category.name} 
                  categoryId={category.id} 
                />
            )}
        </div>
    );
};

export default NotesCategories;