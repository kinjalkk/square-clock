"use client";
import { TimeTableAdmin } from "@/components/TimeTableAdmin";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

const Page = () => {
  const session=useSession();
  const router=useRouter();
  if(session.status==="unauthenticated" || (session.status==="authenticated" && session.data.isAdmin===false)){
    router.push("/");
    return;
  }
  return (
    <div className="w-[80%] m-auto">
      <TimeTableAdmin />
    </div>
  );
};

export default Page;
