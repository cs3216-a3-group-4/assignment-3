import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";

import ActionBar from "./action-bar";
import ArticleFeed from "./article-feed";
import TopArticleList from "./top-article-list";

const Home = () => {
  return (
    <div className="w-full p-4 sm:border-l-2 sm:p-8">
      <ActionBar />
      <div className="grid grid-cols-2 my-8">
        <Tabs className="col-span-2" defaultValue="week">
          <TabsList className="grid w-full grid-cols-2 mb-4 font-semibold text-lg shadow-md">
            <TabsTrigger
              className="aria-selected:border-b-2 border-primary-500 py-2"
              value="week"
            >
              Top picks
            </TabsTrigger>
            <TabsTrigger
              className="aria-selected:border-b-2 border-primary-500"
              value="yours"
            >
              Curated reads
            </TabsTrigger>
          </TabsList>
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
