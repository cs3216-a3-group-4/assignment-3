import { useRouter } from "next/navigation";
import { LucideIcon } from "lucide-react";

interface SidebarItemWithIconProps {
  Icon: LucideIcon;
  label: string;
  categoryId: number;
  isActive?: boolean;
}

const SidebarItemWithIcon = ({
  Icon,
  label,
  categoryId,
  isActive = false,
}: SidebarItemWithIconProps) => {
  const router = useRouter();

  return (
    <div
      className={`flex rounded px-2 py-1.5 items-center ${isActive ? "bg-primary-400/30" : "hover:bg-primary-200/20"}`}
      onClick={() => router.push(`/categories/${categoryId}`)}
    >
      <Icon
        className="mr-3 text-primary flex-shrink-0"
        size={20}
        strokeWidth={isActive ? 1.7 : 1.5}
      />
      <span
        className={`text-primary/90 pointer-events-none hover:text-primary ${isActive ? "font-medium" : "font-normal"}`}
      >
        {label}
      </span>
    </div>
  );
};

export default SidebarItemWithIcon;
