"use client"

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="w-full flex flex-col items-center pt-20 space-y-6">
      {["/bill", "/buyer", "/item"].map((route, idx) => {
        let label = "";
        if (route === "/bill") label = "Create New Bill";
        else if (route === "/buyer") label = "Create / Modify Buyer";
        else if (route === "/item") label = "Create / Modify Item";

        return (
          <button
            key={idx}
            onClick={() => router.push(route)}
            className="text-blue-600 underline cursor-pointer text-lg font-semibold hover:text-blue-800 transition"
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
