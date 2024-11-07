"use client";

import { useUserStore } from "@/store/user/user-store-provider";

import CategoryForm from "./category-form";
import ChangePasswordForm from "./change-password-form";

export default function Profile() {
  const user = useUserStore((store) => store.user);

  return (
    user && (
      <div className="flex flex-col w-full py-8">
        <div className="flex flex-col mb-8 gap-y-2 mx-8 md:mx-16 xl:mx-56 pt-8">
          <h1 className="text-3xl 2xl:text-4xl font-bold">Settings</h1>
        </div>

        {/* "mx-4 md:mx-0" i dont know wth is going on with the margins but i add this to and it aligned */}
        <div className="flex flex-col gap-8 mx-4 md:mx-0">
          <CategoryForm
            initialCategoryIds={user.categories.map((category) => category.id)}
          />

          <ChangePasswordForm />
        </div>
      </div>
    )
  );
}
