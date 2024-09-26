"use client";

import { useMediaQuery } from "usehooks-ts";

import { MediaBreakpoint } from "@/utils/media";

function useBreakpointMediaQuery(): MediaBreakpoint {
  const isMdBreakpoint = useMediaQuery(`(min-width: ${MediaBreakpoint.Md})`);
  const isLgBreakpoint = useMediaQuery(`(min-width: ${MediaBreakpoint.Lg})`);
  const isXlBreakpoint = useMediaQuery(`(min-width: ${MediaBreakpoint.Xl})`);
  const isXxlBreakpoint = useMediaQuery(`(min-width: ${MediaBreakpoint.Xxl})`);
  const isXxxlBreakpoint = useMediaQuery(
    `(min-width: ${MediaBreakpoint.Xxxl})`,
  );

  if (isXxxlBreakpoint) return MediaBreakpoint.Xxxl;
  if (isXxlBreakpoint) return MediaBreakpoint.Xxl;
  if (isXlBreakpoint) return MediaBreakpoint.Xl;
  if (isMdBreakpoint) return MediaBreakpoint.Md;
  if (isLgBreakpoint) return MediaBreakpoint.Lg;

  return MediaBreakpoint.Sm;
}

export default useBreakpointMediaQuery;
