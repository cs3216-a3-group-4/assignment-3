import { HighlightType, Region } from "@/types/annotations";

// credits to @seelengxd, only shifting code here to keep the component more managable

export const addNotHighlightedRegion = (regions: Region[], length: number) => {
  const result = regions.reduce(
    (prev: Region[], curr: Region) => {
      if (prev.length === 0) {
        return [curr];
      }
      if (
        curr.startIndex <= prev[prev.length - 1].endIndex + 1 &&
        prev[prev.length - 1].highlighted === curr.highlighted
      ) {
        prev[prev.length - 1].endIndex = Math.max(
          curr.endIndex,
          prev[prev.length - 1].endIndex,
        );
        return prev;
      }
      return [
        ...prev,
        {
          startIndex: prev[prev.length - 1].endIndex + 1,
          endIndex: curr.startIndex - 1,
          highlighted: HighlightType.None,
        },
        curr,
      ];
    },
    (regions.length === 0
      ? ([
          {
            startIndex: 0,
            endIndex: length - 1,
            highlighted: HighlightType.None,
          },
        ] as Region[])
      : regions[0].startIndex === 0
        ? []
        : [
            {
              startIndex: 0,
              endIndex: regions[0].startIndex - 1,
              highlighted: HighlightType.None,
            },
          ]) as Region[],
  );
  if (result[result.length - 1].endIndex != length - 1) {
    result.push({
      startIndex: result[result.length - 1].endIndex + 1,
      endIndex: length - 1,
      highlighted: HighlightType.None,
    });
  }
  return result.filter((region) => region.startIndex <= region.endIndex);
};

export const addSelectedRegion = (
  start: number,
  end: number,
  regions: Region[],
) => {
  const result = [] as Region[];
  let added = false;
  for (const region of regions) {
    // no intersection
    if (region.startIndex > end || region.endIndex < start) {
      result.push(region);
      continue;
    }
    // four cases of collision
    if (region.startIndex < start) {
      result.push({
        startIndex: region.startIndex,
        endIndex: start - 1,
        highlighted: region.highlighted,
      });
    }
    if (!added) {
      result.push({
        startIndex: start,
        endIndex: end,
        highlighted: HighlightType.Selected,
      });
      added = true;
    }
    if (end < region.endIndex) {
      result.push({
        startIndex: end + 1,
        endIndex: region.endIndex,
        highlighted: region.highlighted,
      });
    }
  }
  return result.filter((region) => region.startIndex <= region.endIndex);
};
