const DailyPracticeCard = () => {
  return (
    <div className="md:py-6 px-8 w-full h-fit bg-card border">
      <h2 className="hidden md:flex text-lg md:text-3xl font-semibold justify-between align-center">
        <span className="flex gap-2 items-baseline text-primary-800">
          Your daily GP challenge
        </span>
      </h2>
    </div>
  );
};

export default DailyPracticeCard;
