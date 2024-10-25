import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

import ActionBar from "./action-bar";
import ArticleFeed from "./article-feed";
import TopArticleList from "./top-article-list";

const Home = () => {
  return (
    <div className="w-full p-4">
      <ActionBar />
      <div className="grid grid-cols-4">
        <div className="p-4 flex flex-col gap-4 col-span-1">
          <TopArticleList />
        </div>
        <div className="p-4 flex flex-col gap-4 col-span-2">
          {/* Today's top events */}
          <ArticleFeed />
        </div>
        <div className="p-4 flex flex-col gap-4">
          {/* My notes */}
          <h2 className="flex justify-between align-center text-3xl font-semibold">
            Continue where you left off
          </h2>
          <div>
            <h2 className="flex justify-between align-center">
              My notes
              <Button variant={"outline"}>
                Read more
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </h2>
            <div className="flex flex-col gap-2 mt-4">
              <div className="border border-black w-full p-8" />
              <div className="border border-black w-full p-8" />
              <div className="border border-black w-full p-8" />
            </div>
          </div>
          {/* My essays */}
          <div>
            <h2 className="flex justify-between align-center">
              My essays
              <Button variant={"outline"}>
                Read more
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </h2>
            <div className="flex flex-col gap-2 mt-4">
              <div className="border border-black w-full p-8" />
              <div className="border border-black w-full p-8" />
              <div className="border border-black w-full p-8" />
            </div>
          </div>
          {/* My questions */}
          <div>
            <div>
              <h2 className="flex justify-between align-center">
                My questions
                <Button variant={"outline"}>
                  Read more
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </h2>
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <div className="border border-black w-full p-8" />
              <div className="border border-black w-full p-8" />
              <div className="border border-black w-full p-8" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
