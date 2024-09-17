
import SignedOut from "@/components/SignedOut";
import React from "react";
import { getServerSession } from "next-auth";
import TimeSheet from "@/components/TimeSheet";

const Home = async() => {
  const session = await getServerSession();

  return (
    <div className="min-h-screen">
      {session && (
        <>
        <TimeSheet/>
        </>     
      )}
      {!session && <SignedOut />}
    </div>
  );
};

export default Home;
