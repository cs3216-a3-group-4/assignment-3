import { getIconFor } from "@/types/categories";
import { useRouter } from "next/navigation";

interface Props {
    title: string;
    categoryId: number;
};

const NotesCategoryItem = ({title, categoryId}: Props) => {
    const CategoryIcon = getIconFor(title);
    const router = useRouter();

    const onClickCategory = () => {
        router.push(`/notes/${categoryId}`);
    };

    return (
        <div onClick={onClickCategory} className="flex items-center py-5 lg:flex-row w-full lg:py-3 px-4 md:px-8 xl:px-12 xl:py-5 gap-x-5 border-y-[1px] lg:border-y-[0px] hover:bg-primary-alt-foreground/[2.5%] lg:rounded-md cursor-pointer">
            <CategoryIcon 
                className="mr-3 flex-shrink-0"
                size={30}
                strokeWidth={1.7}/>
            <span className="pointer-events-none text-xl">{title}</span>
        </div>
    );
};

export default NotesCategoryItem;