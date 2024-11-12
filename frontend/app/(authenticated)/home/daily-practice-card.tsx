import TodaysPracticeCard from "@/components/daily-practice/todays-practice-card";

const DailyPracticeCard = () => {
  return (
    <div className="hidden md:flex md: flex-col md:py-6 px-8 w-full h-fit bg-card border">
      <h2 className="text-lg md:text-3xl font-semibold justify-between align-center">
        <span className="flex gap-2 items-baseline text-primary-800">
          Your daily GP practice
        </span>
      </h2>
      <TodaysPracticeCard className="max-w-xl" />
    </div>
  );
};

export default DailyPracticeCard;
