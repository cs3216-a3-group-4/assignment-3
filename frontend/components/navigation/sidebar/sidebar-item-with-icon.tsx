import { LucideIcon } from "lucide-react";
interface SidebarItemWithIconProps {
  Icon: LucideIcon;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

const SidebarItemWithIcon = ({
  Icon,
  label,
  isActive = false,
  onClick,
}: SidebarItemWithIconProps) => {
  return (
    <div
      className={`flex rounded px-2 py-1.5 items-center ${isActive ? "text-primary-alt-800/90 font-medium bg-primary-400/30" : "text-primary-alt-foreground/70 hover:bg-primary-200/20"}`}
      onClick={onClick}
    >
      <Icon
        className="mr-3 flex-shrink-0"
        size={20}
        strokeWidth={isActive ? 1.9 : 1.7}
      />
      <span className="pointer-events-none">{label}</span>
    </div>
  );
};

export default SidebarItemWithIcon;
