import { LucideIcon } from "lucide-react";

interface SidebarItemWithIconProps {
  Icon: LucideIcon;
  label: string;
}

const SidebarItemWithIcon = ({ Icon, label }: SidebarItemWithIconProps) => {
  return (
    <div className="flex rounded px-2 py-1.5 hover:bg-muted-foreground/5 text-sm font-medium items-center">
      <Icon
        className="mr-3 text-muted-foreground"
        size={16}
        strokeWidth={1.8}
      />
      <span className="text-offblack/80 pointer-events-none hover:text-offblack">
        {label}
      </span>
    </div>
  );
};

export default SidebarItemWithIcon;
