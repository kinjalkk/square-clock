
import SignedOut from "@/components/SignedOut";
import React from "react";
import { getServerSession } from "next-auth";

const Home = async() => {
  const session = await getServerSession();

  return (
    <div className="min-h-screen">
      {session && (
        <>
        <div className="text-white">Time fill</div>
        </>     
      )}
      {!session && <SignedOut />}
    </div>
  );
};

export default Home;
