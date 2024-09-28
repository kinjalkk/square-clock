"use client";
import Image from "next/image";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IoIosLogOut } from "react-icons/io";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
const Navbar = ({session}:{session:any}) => {
  const router= useRouter()
  return (
    <>
      <div className="mx-[2rem] max-sm:mx-[0.5rem] py-4 px-2 flex flex-row items-center sticky z-10 top-0 bg-[#0f1014]">
        <Link className="cursor-pointer flex  align-middle items-center" href="/">
        <Image
          src="/images/logo.png"
          alt="logo"
          height={0}
          width={0}
          className="h-10 w-auto"
          unoptimized
        /><h2 className="text-lg text-white pl-5">Square Clock</h2></Link>

        <div className="text-white ml-[auto] gap-6 flex flex-row mr-[1rem] items-center max-sm:ml-4">
          {session && <DropdownMenu>
            <DropdownMenuTrigger>
              <Image
                src="/images/avatar.png"
                alt="avatar"
                width={50}
                height={50}
                className="outline-none border-none"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#0f1014] border text-white">
            <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => router.push("/add-client")}
              >
                Add client
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => router.push(`${session?.isAdmin?"/reset-password-admin":"/reset-password"}`)}
              >
                Change password
              </DropdownMenuItem>
              {session.isAdmin && <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => router.push("/time-table-admin")}
              >
                Track hours
              </DropdownMenuItem>}
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={async () => {await signOut();window.location.href="/"}}
              >
                <IoIosLogOut fontSize={23} />
                &nbsp;Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>}
        </div>
      </div>
    </>
  );
};

export default Navbar;
