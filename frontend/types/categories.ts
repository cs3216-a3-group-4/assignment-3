import {
  Building2,
  DollarSign,
  Film,
  HeartHandshake,
  Leaf,
  LucideIcon,
  Medal,
  Microscope,
  Palette,
  Scale,
  UsersRound,
} from "lucide-react";

export enum Category {
  SciTech = "Science & technology",
  ArtsHumanities = "Arts & humanities",
  Politics = "Politics",
  Media = "Media",
  Environment = "Environment",
  Economics = "Economics",
  Sports = "Sports",
  GenderEquality = "Gender & equality",
  Religion = "Religion",
  SocietyCulture = "Society & culture",
}

export const categoriesToDisplayName: Record<Category, string> = {
  [Category.SciTech]: "Science & technology",
  [Category.ArtsHumanities]: "Arts & humanities",
  [Category.Politics]: "Politics",
  [Category.Media]: "Media",
  [Category.Environment]: "Environment",
  [Category.Economics]: "Economics",
  [Category.Sports]: "Sports",
  [Category.GenderEquality]: "Gender & equality",
  [Category.Religion]: "Religion",
  [Category.SocietyCulture]: "Society & culture",
};

export const categoriesToIconsMap: Record<Category, LucideIcon> = {
  [Category.SciTech]: Microscope,
  [Category.ArtsHumanities]: Palette,
  [Category.Politics]: Building2,
  [Category.Media]: Film,
  [Category.Environment]: Leaf,
  [Category.Economics]: DollarSign,
  [Category.Sports]: Medal,
  [Category.GenderEquality]: Scale,
  [Category.Religion]: HeartHandshake,
  [Category.SocietyCulture]: UsersRound,
};
