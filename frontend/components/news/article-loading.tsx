const ArticleLoading = () => {
  // TODO: fix width
  return (
    <div className="flex flex-col-reverse lg:flex-row w-full animate-pulse lg:py-6 xl:px-12 xl:py-10 gap-x-28 border-y-[1px] lg:border-y-[0px] hover:bg-muted/70 lg:rounded-md px-4 md:px-8">
      <div className="flex flex-col w-full lg:w-7/12 2xl:w-9/12 3xl:w-10/12">
        <div className="flex flex-row justify-between w-full">
          {/* Article source placeholder */}
          <div className="h-3 bg-gray-300 rounded w-1/6 mb-2"></div>
          {/* Article date placeholder */}
          <div className="h-3 bg-gray-300 rounded w-1/4 mb-2"></div>
        </div>
        {/* Event title placeholder */}
        <div className="h-4 bg-gray-300 rounded w-2/3 mb-2 mt-2"></div>
        {/* Event description placeholder */}
        <div className="h-6 bg-gray-300 rounded w-5/6 mb-4"></div>
        {/* Event category placeholder */}
        <div className="flex flex-wrap gap-x-2 gap-y-2 mt-6">
          <div className="rounded h-5 bg-gray-300 w-14 mb-2"></div>
        </div>
      </div>
      {/* Event image placeholder */}
      <div className="min-h-32 bg-gray-300 rounded w-full lg:w-5/12 2xl:w-3/12 3xl:w-2/12 mb-6"></div>
    </div>
  );
};

export default ArticleLoading;
