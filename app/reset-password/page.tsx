"use client";
import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {  updatePassword } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Loader from "@/components/Loader";

const resetPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Must contain at least 6 characters"
  }),
  reEnterPassword: z.string().min(3, {
    message: "Must contain at least 6 characters"
  }),
});


const Page = () => {
  const session=useSession();
  const [invalidCredentials, setInvalidCredentails] = useState(false);
  const [loading,setLoading]=useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      reEnterPassword:""
    },
  });

  async function onSubmit(values: z.infer<typeof resetPasswordSchema>) {
    setLoading(true);
    if (values.password!==values.reEnterPassword) {
      setInvalidCredentails(true);
    } else {
      try {
        const email=session?.data?.user?.email;
        if(!email){
          setInvalidCredentails(true);
          return;
        }
        const changePassword = await updatePassword(email,values.password);
        if (!changePassword) {
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
    setInvalidCredentails(false);
  };
  if(session.status==="unauthenticated"){
    router.push("/");
    return null;
  }
  return (
    loading?
    <div className="flex items-center justify-center min-h-screen">
    <Loader/>
  </div>:
    <div className=' w-full relative bg-no-repeat bg-center bg-cover'>
      <div className="bg-black lg:bg-opacity-50 w-full min-h-screen flex justify-center">
        <div className="text-white absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex flex-col justify-start items-start px-[4rem] bg-black bg-opacity-80 w-[25rem] py-[4rem]">
          <h1 className="text-[1.8rem] font-bold">Change password</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
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
              <FormField
                control={form.control}
                name="reEnterPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="re-enter password"
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
                <p className="text-red-600">Passwords do not match</p>
              )}
              <Button type="submit" className="w-[100%] bg-red-600 mt-[3rem]">
                Change
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Page;
