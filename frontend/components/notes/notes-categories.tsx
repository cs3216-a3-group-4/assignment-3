"use client";

import { useQuery } from "@tanstack/react-query";

import NotesCategoryItem from "@/components/notes/notes-category-item";
import { getCategories } from "@/queries/category";

const NotesCategories = () => {
  const { data: categories, isSuccess } = useQuery(getCategories());

  return (
    <div className="flex flex-col w-full">
      {isSuccess &&
        categories!.map((category) => (
          <NotesCategoryItem
            categoryId={category.id}
            key={category.id}
            title={category.name}
          />
        ))}
    </div>
  );
};

export default NotesCategories;
