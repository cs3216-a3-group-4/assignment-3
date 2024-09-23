import NewsArticle from "@/components/news/news-article";

/* This component should only be rendered to authenticated users */
const Home = () => {
  return (
    <div className="flex flex-col w-full py-8 mx-8 md:mx-16 xl:mx-32">
      <div className="mb-12">
        <span className="text-sm text-muted-foreground">
          {new Date().toDateString()}
        </span>
        <h1 className="text-2xl lg:text-3xl 2xl:text-4xl font-bold">
          What happened this week
        </h1>
      </div>

      <div className="flex flex-col w-full">
        <NewsArticle />
        <NewsArticle />
        <NewsArticle />
        <NewsArticle />
      </div>
    </div>
  );
};

export default Home;
