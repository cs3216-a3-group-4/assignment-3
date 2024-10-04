import Link from "next/link";
import { LucideIcon } from "lucide-react";
interface SidebarItemWithIconProps {
  Icon: LucideIcon;
  label: string;
  isActive?: boolean;
  path: string;
}

const SidebarItemWithIcon = ({
  Icon,
  label,
  isActive = false,
  path,
}: SidebarItemWithIconProps) => {
  return (
    <Link
      className={`flex rounded px-2 py-1.5 items-center ${isActive ? "text-primary-alt-800/90 font-medium bg-primary-400/30" : "text-primary-alt-foreground/70 hover:bg-primary-200/20"}`}
      href={path}
    >
      <Icon
        className="mr-3 flex-shrink-0"
        size={20}
        strokeWidth={isActive ? 1.9 : 1.7}
      />
      <span className="pointer-events-none">{label}</span>
    </Link>
  );
};

export default SidebarItemWithIcon;
