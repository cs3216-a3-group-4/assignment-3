import { NoteDTO } from "@/client";
import { getIconFor } from "@/types/categories";

type Props = {
    data: NoteDTO;
};

const Note = ({data}: Props) => {
    const Icon = getIconFor(data.category.name);
    const onClickNote = () => {
    };

    return (
        <div
            className="flex items-center py-5 lg:flex-row w-full lg:py-3 px-4 md:px-8 xl:px-12 xl:py-5 gap-x-5 border-y-[1px] lg:border-y-[0px] hover:bg-primary-alt-foreground/[2.5%] lg:rounded-md cursor-pointer"
            onClick={onClickNote}
            >
                <Icon 
                    className="mr-3 flex-shrink-0"
                    size={30}
                    strokeWidth={1.7}/>
                <div className="flex flex-col space-y-2.5">
                    <div className="flex w-full justify-between">
                        <span>Note for '{data.category.name}'</span>
                    </div>
                    <p className="text-text-muted/90">{data.content}</p>
                </div>
        </div>
    );
};

export default Note;