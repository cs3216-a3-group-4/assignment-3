import JippyClown from "@/public/jippy-clown";
import Link from "@/components/navigation/link";
import { Button } from "@/components/ui/button";

function AboutPage() {
  return (
    <div className="flex flex-col space-y-4 m-auto px-12 md:px-24">
      <div className="flex flex-col space-y-8">
        <JippyClown />
        <div className="flex flex-col space-y-2">
          <h3 className="text-lg md:text-2xl font-medium font-mono">
            404 Not Found Error
          </h3>
          <h1 className="text-3xl md:text-5xl font-semibold">
            Ribbit! Jippy couldn&apos;t find that page...
          </h1>
        </div>
      </div>
      <div className="flex flex-col gap-y-8">
        <p>
          The page you were looking for doesn&apos;t exist. The page might have
          moved, or you might have clicked on a bad link.
        </p>
        <Link href="/">
          <Button size="lg">Bring me back to my home page</Button>
        </Link>
      </div>
    </div>
  );
}

export default AboutPage;
