
import SignedOut from "@/components/SignedOut";
import React from "react";
import { getServerSession } from "next-auth";
import TimeSheet from "@/components/TimeSheet";

const Home = async() => {
  const session = await getServerSession();

  return (
    <div className="w-full relative">
      <div className="bg-black lg:bg-opacity-50 w-full h-full flex justify-center h-d">
      {session && (
        <>
        <TimeSheet/>
        </>     
      )}
      {!session && <SignedOut />}
    </div>
    </div>
  );
};

export default Home;
