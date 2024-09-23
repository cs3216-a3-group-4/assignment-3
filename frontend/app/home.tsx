import NewsArticle from "@/components/news/news-article";

/* This component should only be rendered to authenticated users */
const Home = () => {
  return (
    <div className="flex flex-col w-full py-8">
      <div className="flex flex-col mb-8 gap-y-2 mx-8 md:mx-16 xl:mx-32">
        <span className="text-sm text-muted-foreground">
          {new Date().toDateString()}
        </span>
        <h1 className="text-3xl 2xl:text-4xl font-bold">
          What happened this week
        </h1>
      </div>

      <div className="flex flex-col w-auto mx-4 md:mx-8 xl:mx-24">
        <NewsArticle />
        <NewsArticle />
        <NewsArticle />
        <NewsArticle />
      </div>
    </div>
  );
};

export default Home;
