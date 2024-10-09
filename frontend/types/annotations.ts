export enum HighlightType {
  None,
  Annotation,
  Selected,
}

export interface Region {
  startIndex: number;
  endIndex: number;
  highlighted: HighlightType;
}
