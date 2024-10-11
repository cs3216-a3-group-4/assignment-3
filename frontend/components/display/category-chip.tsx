import {
  categoriesToDisplayName,
  categoriesToIconsMap,
  Category,
} from "@/types/categories";

import Chip, { ChipProps } from "./chip";

interface CategoryChipProps extends Omit<ChipProps, "label"> {
  category: Category;
  size?: "sm" | "lg" | "default";
  iconSize?: string | number;
  showIcon?: boolean;
}

const CategoryChip = ({
  category,
  iconSize,
  size = "lg",
  showIcon = true,
  ...props
}: CategoryChipProps) => {
  return (
    <Chip
      Icon={(showIcon && categoriesToIconsMap[category]) || undefined}
      className="mb-2 md:mb-0"
      iconSize={iconSize}
      key={category}
      label={categoriesToDisplayName[category]}
      size={size}
      variant="primary" // TODO: this is ugly
      {...props}
    />
  );
};

export default CategoryChip;
