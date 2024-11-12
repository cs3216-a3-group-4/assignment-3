import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import ActionBar from "./action-bar";
import ActionBarMobile from "./action-bar-mobile";
import ArticleFeed from "./article-feed";
import TopArticleList from "./top-article-list";
import DailyPracticeCard from "./daily-practice-card";

const Home = () => {
  return (
    <div className="w-full p-4 sm:p-8 bg-muted overflow-y-auto min-h-full">
      <ActionBarMobile />
      <ActionBar />
      <div className="flex w-full mt-6 mb-8">
        <Tabs className="w-full" defaultValue="practice">
          <TabsList className="flex w-full font-medium md:h-12 bg-primary-100/80 text-primary-700">
            <TabsTrigger className="w-full md:text-base" value="practice">
              Daily practice
            </TabsTrigger>
            <TabsTrigger className="w-full md:text-base" value="week">
              Weekly picks
            </TabsTrigger>
            <TabsTrigger className="w-full md:text-base" value="yours">
              Today&apos;s news
            </TabsTrigger>
          </TabsList>
          <TabsContent value="practice">
            <DailyPracticeCard />
          </TabsContent>
          <TabsContent value="week">
            <TopArticleList />
          </TabsContent>
          <TabsContent value="yours">
            <ArticleFeed />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Home;
