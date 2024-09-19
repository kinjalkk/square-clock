"use client";
import React, { useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import { useRouter } from "next/navigation";
import { getAllClients, getAllProjects } from "@/lib/actions/project.actions";
import { useSession } from "next-auth/react";
import { TimeTable } from "./TimeTable";
import { getTime, reportTime } from "@/lib/actions/time.actions";
const TimeSheet = () => {
  const router = useRouter();
  const session = useSession();
  console.log("session", session);
  const [clients, setClients] = React.useState([]);
  const [projects, setProjects] = React.useState([]);
  const [selectedClient, setSelectedClient] = React.useState("");
  const [selectedProject, setSelectedProject] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [openProject, setOpenProject] = React.useState(false);
  const[alltimes,setAllTimes]=React.useState([]);

  useEffect(() => {
    (async () => {
      const clientsFormDb = await getAllClients();
      console.log("clients", clientsFormDb);
      setClients(clientsFormDb);
    })();
  }, []);
  useEffect(() => {
    (async () => {
      const projectsFormDb = await getAllProjects(selectedClient);
      console.log("projects", projectsFormDb);
      setProjects(projectsFormDb);
    })();
  }, [selectedClient]);
  useEffect(()=>{
    (async ()=>{
      if(session && session.data && session.data.user.id){
        const times=await getTime(session.data.user.id)
        setAllTimes(times)
      }
    })
  })
  const start=async()=>{
    const startedTime=await reportTime(session.data?.user.id,session.data?.user?.email,session.data?.user?.name,selectedProject.project,selectedClient,selectedProject._id,"desc",true)
  }

  return (
    <>
    <div>
      <div className="mx-auto gap-6 flex flex-row items-center max-sm:ml-4">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between"
            >
              {selectedClient
                ? clients.find((client) => client === selectedClient)
                : "Select client..."}

              <ChevronsUpDown className="m1-2 h-4 w-4 shrink-e opacity-50" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-[200px] p-8">
            <Command>
              <CommandInput placeholder="Search client..." />

              <CommandList>
                <CommandEmpty>No client found.</CommandEmpty>

                <CommandGroup>
                  {clients.map((client) => (
                    <CommandItem
                      key={client}
                      value={client}
                      onSelect={(currentValue) => {
                        setSelectedClient(currentValue);

                        setOpen(false);
                      }}
                    >
                      <Check
                        className-={cn(
                          "mr-2 h-4 w-4",

                          selectedClient === client
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {client}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {selectedClient && (
          <Popover open={openProject} onOpenChange={setOpenProject}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openProject}
                className="w-[200px] justify-between"
              >
                {selectedProject?.project ? projects?.find((project) => project?.project === selectedProject.project).project: "Select project..."}

                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-8 opacity-50" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[200px] р-8">
              <Command>
                <CommandInput placeholder="Search client..." />
                <CommandList>
                  <CommandEmpty>No project found.</CommandEmpty>

                  <CommandGroup>
                    {projects.map((project) => (
                        <CommandItem
                            key={project?.project}
                            value ={projects?.project}
                            onSelect={(currentValue) => {
                              const projectSelected=projects.find((p)=>project.project===currentValue

                              )
                                setSelectedProject(projectSelected);
                                setOpenProject(false); }}>
                    <Check
                        className={cn( "mr-2 h-4 w-4",
                            selectedProject.project === project?.project ? "opacity-100" : "opacity-0")}/>

                        {project?.project}  
                        </CommandItem>))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}

        {selectedProject && selectedClient && (
          <Button
            onClick={start}
          >
            Start
          </Button>
        )}
      </div>
      <TimeTable/>
      </div>
    </>
  );
};
export default TimeSheet;