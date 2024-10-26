"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { useUserStore } from "@/store/user/user-store-provider";

const ActionBar = () => {
  const user = useUserStore((state) => state.user);
  return (
    <div className="flex flex-col gap-4 border border-b h-fit shadow-inner p-8 mb-4">
      <div className="text-primary-600" id="welcome-message">
        <div className="text-lg">
          Welcome{" "}
          <span className="font-medium">{user?.email.split("@")[0]}</span>,
        </div>
        <p className="">What do you want Jippy to do today?</p>
      </div>
      <div className="grid sm:grid-cols-3 gap-4 items-stretch">
        <div className="border-green-800/50 border-2 p-4 shadow-sm">
          <h2 className="font-semibold">Explore articles</h2>
          <p>
            Keep up to date with current affairs. Jippy curates articles based
            on your GP topics.
          </p>
          <Link
            className="flex items-center gap-1 mt-4 underline"
            href="/articles"
          >
            Explore <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="border-green-800/50 border-2 p-4 shadow-sm">
          <h2 className="font-semibold">Ask Jippy an essay question</h2>
          <p>Jippy will come up with points and examples.</p>
          <Link className="flex items-center gap-1 mt-4 underline" href="/ask">
            Ask <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="border-green-800/50 border-2 p-4 shadow-sm">
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
