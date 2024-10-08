"use client";
import { useSession } from "next-auth/react";
import React from "react";
import SessionContext from "@/context/SessionContext";
import Navbar from "./Navbar";

const AuthWrapper = ({ children }: { children: any }) => {
  const { data: session, status } = useSession();
  return <>
  <SessionContext.Provider value={JSON.stringify(session)}>
    {session &&  <Navbar session={session}/>}
    {children}
  </SessionContext.Provider>
  </>;
};

export default AuthWrapper;
