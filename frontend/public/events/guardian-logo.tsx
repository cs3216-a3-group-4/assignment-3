import { ArticleSourceLogoProps } from "@/types/events";
import Image from "next/image";

const GuardianLogo = ({ height = 45, width = 140 }: ArticleSourceLogoProps) => {
  return (
    <Image
      src="/events/guardian-logo.png"
      alt="Powered by Guardian"
      height={height}
      width={width}
    />
  );
};

export default GuardianLogo;
