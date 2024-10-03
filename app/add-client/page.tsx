"use client";
import React, { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  createNewProject,
  getAllClients,
  getProject,
} from "@/lib/actions/project.actions";
import { useSession } from "next-auth/react";
import Loader from "@/components/Loader";

const projectSchema = z.object({
  client: z.string().min(1, {
    message: "Enter valid client",
  }),
  project: z.string().min(1, {
    message: "Enter valid project",
  }),
  hours: z.string().default("0"),
});

const Page = () => {
  const session = useSession();
  const [isProjectExist, setIsProjectExist] = useState(false);
  const [invalidCredentials, setInvalidCredentails] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [clients, setClients] = React.useState([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  const router = useRouter();
  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      client: "",
      project: "",
      hours: "",
    },
  });
  const getClients = async () => {
    const clientsFormDb = await getAllClients();
    setClients(clientsFormDb);
  };
  useEffect(() => {
    getClients();
  }, []);
  async function onSubmit(values: z.infer<typeof projectSchema>) {
    setLoading(true);
    if (values.hours && isNaN(parseInt(values.hours))) {
      setInvalidCredentails(true);
      return false;
    } else {
      const project = await getProject(values.client?.trim(), values.project?.trim());
      if (project) {
        setIsProjectExist(true);
      } else {
        try {
          //create project and route push /
          const createProject = await createNewProject(
            values.client?.trim(),
            values.project?.trim(),
            values.hours ? parseInt(values.hours): 0
          );
          router.push("/");
        } catch (error) {
          console.log("error:", error);
        }
      }
    }
    setLoading(false);
  }

  const handleKeyUp = () => {
    setIsProjectExist(false);
    setInvalidCredentails(false);
  };

  if (session.status === "unauthenticated") {
    router.push("/");
    return;
  }

  return loading ? (
    <div className="flex items-center justify-center min-h-screen">
      <Loader/>
    </div>
  ) : (
    <div className=" w-full relative">
      <div className="bg-black lg:bg-opacity-50 min-h-screen w-full flex justify-center">
        <div className="text-white absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex flex-col justify-start items-start px-[4rem] bg-black bg-opacity-80 w-[25rem] py-[4rem]">
          <h1 className="text-[2rem] font-bold">Add project</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
              <FormField
                control={form.control}
                name="client"
                render={({ field }) => (
                  <FormItem>
                    {isProjectExist && (
                      <FormLabel className="text-red-600 mb-2rem">
                        Project already exist
                      </FormLabel>
                    )}
                    <FormControl>
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <div className="relative">
                            <Input
                              placeholder="select or type new client"
                              {...field}
                              className="mt-[2rem] mb-[1rem] h-[3.5rem] rounded-sm bg-zinc-900"
                              onKeyUp={handleKeyUp}
                            />
                          </div>
                        </PopoverTrigger>

                        <PopoverContent className="w-full max-w-xs">
                          <Command>
                            <CommandInput placeholder="Search client" />

                            <CommandList>
                              <CommandEmpty>No client found.</CommandEmpty>

                              <CommandGroup>
                                {clients?.map((client) => (
                                  <CommandItem
                                    key={client}
                                    value={client}
                                    onSelect={(currentValue) => {
                                      field.onChange(currentValue);
                                      setOpen(false);
                                    }}
                                  >
                                    {client}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="project"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="project"
                        {...field}
                        className="mb-[1rem] h-[3.5rem] rounded-sm bg-zinc-900 bg-opacity-50 mt-[1rem]"
                        onKeyUp={handleKeyUp}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hours"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="hours"
                        {...field}
                        className="mb-[1rem] h-[3.5rem] rounded-sm bg-zinc-900 bg-opacity-50 mt-[1rem]"
                        onKeyUp={handleKeyUp}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {invalidCredentials && (
                <p className="text-red-600">
                  something went wrong or invalid input provided
                </p>
              )}
              <Button type="submit" className="w-[100%] bg-red-600 mt-[3rem]">
                Add project
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Page;
