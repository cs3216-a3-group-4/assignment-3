import { MediaBreakpoint } from "@/utils/media";
import { useMediaQuery } from "usehooks-ts";

function useBreakpointMediaQuery(): MediaBreakpoint {
  const isMdBreakpoint = useMediaQuery(`(min-width: ${MediaBreakpoint.Md})`);
  const isLgBreakpoint = useMediaQuery(`(min-width: ${MediaBreakpoint.Lg})`);
  const isXlBreakpoint = useMediaQuery(`(min-width: ${MediaBreakpoint.Xl})`);
  const isXxlBreakpoint = useMediaQuery(`(min-width: ${MediaBreakpoint.XXl})`);

  if (isXxlBreakpoint) return MediaBreakpoint.XXl;
  if (isXlBreakpoint) return MediaBreakpoint.Xl;
  if (isMdBreakpoint) return MediaBreakpoint.Md;
  if (isLgBreakpoint) return MediaBreakpoint.Lg;

  return MediaBreakpoint.Sm;
}

export default useBreakpointMediaQuery;
