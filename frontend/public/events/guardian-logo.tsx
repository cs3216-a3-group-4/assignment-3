import Image from "next/image";

import { ArticleSourceLogoProps } from "@/types/events";

const GuardianLogo = ({ height = 45, width = 140 }: ArticleSourceLogoProps) => {
  return (
    <Image
      alt="Powered by Guardian"
      height={height}
      src="/events/guardian-logo.png"
      width={width}
    />
  );
};

export default GuardianLogo;
