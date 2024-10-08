"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getUserByEmail, getUserByEmailOrUsername, login } from "@/lib/actions/user.actions";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { decode } from "next-auth/jwt";
import Loader from "@/components/Loader";

const loginSchema = z.object({
  username: z.string().min(2, {
    message: "Enter valid email",
  }),
  password: z.string().min(6, {
    message: "Must contain at least 6 characters"
  }),
});


const Page = () => {

  const [isSignUp, setIsSignUp] = useState(false);
  const [invalidCredentials, setInvalidCredentails] = useState(false);
  const [loading,setLoading]=useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setLoading(true);
    const user = await getUserByEmailOrUsername(values.username);
    if (!user) {
      setIsSignUp(true);
    } else {
      try {
        const userLogin = await signIn("credentials", {
          username: values.username,
          password: values.password,
          redirect: false,
        });
        if (userLogin && !userLogin?.ok) {
          setInvalidCredentails(true);
        } else {
          router.push("/");
        }
      } catch (error) {
        console.log("error:", error);
      }
    }
    setLoading(false);
  }

  const handleKeyUp = () => {
    setIsSignUp(false);
    setInvalidCredentails(false);
  };

  return ( loading ?
    <div className="flex items-center justify-center min-h-screen">
      <Loader/>
    </div>
    :
    <div className='w-full relative '>
      <div className="bg-black lg:bg-opacity-50 w-full min-h-screen flex justify-center">
        <div className="w-[80%]">
          <div className="flex items-center pt-5">
          <Image
          src="/images/logo.jpeg"
          alt="logo"
          height={0}
          width={0}
          className="h-10 w-auto"
          unoptimized
        /><h2 className="text-lg text-white pl-5">Square Clock</h2>
          </div>
        </div>
        <div className="text-white absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex flex-col justify-start items-start px-[4rem] bg-black bg-opacity-80 w-[25rem] h-[80%] py-[4rem]">
          <h1 className="text-[2rem] font-bold">Sign in</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    {isSignUp && (
                      <FormLabel className="text-red-600 mb-2rem">
                        User does not exist. Please sign up!
                      </FormLabel>
                    )}
                    <FormControl>
                      <Input
                        placeholder="username or email"
                        {...field}
                        className="mt-[2rem] mb-[1rem] h-[3.5rem] rounded-sm bg-zinc-900"
                        onKeyUp={handleKeyUp}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="password"
                        {...field}
                        className="mb-[1rem] h-[3.5rem] rounded-sm bg-zinc-900 bg-opacity-50 mt-[1rem]"
                        type="password"
                        onKeyUp={handleKeyUp}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {invalidCredentials && (
                <p className="text-red-600">Invalid Credentials</p>
              )}
              <span className="text-zinc-400 text-[0.9rem]">New to Square Clock?</span><Link href="/signup" className="text-[0.9rem] hover:underline"> Sign up now.</Link>
              <Button type="submit" className="w-[100%] bg-red-600 mt-[3rem]">
                Sign in
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Page;
