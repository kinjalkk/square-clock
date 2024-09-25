import SignedOut from "@/components/SignedOut";
import React from "react";
import { getServerSession, Session } from "next-auth";
import TimeSheet from "@/components/TimeSheet";
import { authOptions } from "./api/auth/[...nextauth]/route";

const Home = async () => {
  const session:Session|null= await getServerSession(authOptions);
  return (
    <div className="w-full relative mt-4">
      <div className="bg-black lg:bg-opacity-50 w-full min-h-screen flex justify-center">
      {session && (
        <>
        <TimeSheet session={session}/>
        </>     
      )}
      {!session && <SignedOut />}
    </div>
    </div>
  );
};

export default Home;
