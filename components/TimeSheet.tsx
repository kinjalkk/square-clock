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
import { checkActiveTime, getTime,getTimeByDateRangeUser, startTime, stopTime } from "@/lib/actions/time.actions";
import { TimeSchemaUser,TimeTable } from "./TimeTable";
const TimeSheet:React.FC<any> = ({session}) => {
  const router = useRouter();
  const [clients, setClients] = React.useState([]);
  const [projects, setProjects] = React.useState([]);
  const [selectedClient, setSelectedClient] = React.useState("");
  const [selectedProject, setSelectedProject] = React.useState();
  const [open, setOpen] = React.useState(false);
  const [openProject, setOpenProject] = React.useState(false);
  const [alltimes, setAllTimes] = React.useState<TimeSchemaUser[]>([]);
  const [description,setDescription]=React.useState("")
  const [startDate, setStartDate] = React.useState<Date | null>(null);
  const [endDate, setEndDate] = React.useState<Date | null>(null);
  useEffect(() => {
    (async () => {
      const clientsFormDb = await getAllClients();
      setClients(clientsFormDb);
    })();
  }, []);
  useEffect(() => {
    (async () => {
      const projectsFormDb = await getAllProjects(selectedClient);
      setProjects(projectsFormDb);
    })();
  }, [selectedClient]);
  const fetchTimes= async () => {
    let times:TimeSchemaUser[];
    if(startDate && endDate){
      times = await getTimeByDateRangeUser(startDate,endDate,session?.user.id);
    }else{
      times = await getTime(session?.user?.id);
    }
    setAllTimes(times);
  }
  useEffect(() => {
    if (session) {
      fetchTimes();
    }
  },[session,startDate,endDate]);
  const start = async () => {
    const startedTime = await startTime(
      session?.user?.id,
      selectedProject._id,
      description,
    );
    setSelectedClient("");
    setSelectedProject(null);
    setDescription("");
    if(startedTime) fetchTimes();
  };

  const stop = async (timeId:string)=>{
    const stoppedTime= await stopTime(timeId);
    if(stoppedTime) fetchTimes();
  }

  return (
    <>
      <div className="w-[80%]">
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
                  ? clients?.find((client) => client === selectedClient)
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
                    {clients?.map((client) => (
                      <CommandItem
                        key={client}
                        value={client}
                        onSelect={async (currentValue) => {
                          const onGoingTime=await checkActiveTime(session?.user?.id);
                          if(onGoingTime){
                            setOpen(false);
                            alert("You have already started a time");
                            return
                          }
                          setSelectedClient(currentValue);
                          setOpen(false);
                        }}
                        className="capitalize"
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
                  {selectedProject?.project
                    ? projects?.find(
                        (project) =>
                          project?.project === selectedProject.project
                      ).project
                    : "Select project..."}

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
                          value={projects?.project}
                          onSelect={(currentValue) => {
                            const projectSelected = projects.find(
                              (p) => project.project === currentValue
                            );
                            setSelectedProject(projectSelected);
                            setOpenProject(false);
                          }}
                          className="capitalize"
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedProject.project === project?.project
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />

                          {project?.project}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          )}

          {selectedProject && selectedClient && (
            <>
            <textarea
            className="border rounded-md p-2 w-full"
            placeholder="Enter description"
            value={description}
            onChange={(e)=>setDescription(e.target.value)}
            />
            <Button onClick={start}>Start</Button>
            </>
          )}
        </div>
        <TimeTable stop={stop} times={alltimes} startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate}/>
      </div>
    </>
  );
};
export default TimeSheet;
