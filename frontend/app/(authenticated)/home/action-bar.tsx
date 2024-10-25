import Link from "next/link";
import { ArrowRight } from "lucide-react";

const ActionBar = () => {
  return (
    <div className="flex flex-col gap-4 border border-b h-fit border-black p-8">
      <div id="welcome-message">
        <div className="text-red-600">Welcome xxxxxx,</div>
        <p className="text-red-600">What do you want Jippy to do today?</p>
      </div>
      <div className="grid sm:grid-cols-3 gap-4 items-stretch">
        <div className="border-blue-500 border-2 p-4">
          <h2 className="font-semibold">Explore ?? events</h2>
          <p>Keep up to date with current affairs, each analysed by Jippy</p>
        </div>
        <div className="border-blue-500 border-2 p-4">
          <h2 className="font-semibold">Ask Jippy an essay question</h2>
          <p>Jippy will come up with points and examples.</p>
          <Link className="flex items-center gap-1 mt-4 underline" href="/ask">
            Ask <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="border-blue-500 border-2 p-4">
          <h2 className="font-semibold">Get essay feedback</h2>
          <p>Jippy will comment on your essay.</p>
          <Link
            className="flex items-center gap-1 mt-4 underline"
            href="/essay-feedback"
          >
            Submit your essay <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ActionBar;
