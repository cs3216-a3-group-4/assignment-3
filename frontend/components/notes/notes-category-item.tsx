import { getIconFor } from "@/types/categories";

interface Props {
    title: string;
};

const NotesCategoryItem = ({title}: Props) => {
    const CategoryIcon = getIconFor(title);

    return (
        <div className="flex">
            <CategoryIcon 
                className="mr-3 flex-shrink-0"
                size={20}
                strokeWidth={1.7}/>
            <span className="pointer-events-none">{title}</span>
        </div>
    );
};

export default NotesCategoryItem;