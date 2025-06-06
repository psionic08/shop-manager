"use client"

import { useRouter } from "next/navigation";

export default function Home() {
  const router= useRouter()
  return (
    <div className="w-full flex flex-col items-center pt-20">
      <div className="text-blue-500 underline" onClick={()=>{router.push("bill")}}>Create new bill</div>
    </div>
  );
}
