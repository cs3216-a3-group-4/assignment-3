import ActionBar from "./action-bar";
import ArticleFeed from "./article-feed";
import TopArticleList from "./top-article-list";

const Home = () => {
  return (
    <div className="w-full p-4">
      <ActionBar />
      <div className="flex flex-col sm:grid sm:grid-cols-3">
        <div className="p-4 flex flex-col gap-4 col-span-1 w-full">
          <TopArticleList />
        </div>
        <div className="p-4 flex flex-col gap-4 col-span-2">
          {/* Today's top events */}
          <ArticleFeed />
        </div>
      </div>
    </div>
  );
};

export default Home;
