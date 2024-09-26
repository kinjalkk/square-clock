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
import {
  getAllClients,
  getAllProjects,
  updateProject,
} from "@/lib/actions/project.actions";
const UpdateProject: React.FC<any> = ({ refreshTime }) => {
  const [clients, setClients] = React.useState([]);
  const [projects, setProjects] = React.useState<any[]>([]);
  const [selectedClient, setSelectedClient] = React.useState("");
  const [selectedProject, setSelectedProject] = React.useState<any | null>();
  const [open, setOpen] = React.useState(false);
  const [openProject, setOpenProject] = React.useState(false);
  const [hours, setHours] = React.useState<number>(0);
  const [updatedProjectName, setUpdatedProjectName] = React.useState("");
  const [updatedClientName, setUpdatedClientName] = React.useState("");

  const getClients = async () => {
    const clientsFormDb = await getAllClients();
    setClients(clientsFormDb);
  };

  useEffect(() => {
    getClients();
  }, []);
  useEffect(() => {
    (async () => {
      const projectsFormDb = await getAllProjects(selectedClient);
      setProjects(projectsFormDb);
    })();
  }, [selectedClient]);
  const update = async () => {
    if (selectedProject && hours && hours > -1) {
      const update = await updateProject(
        selectedProject?._id,
        hours,
        updatedClientName == "" ? selectedClient : updatedClientName,
        updatedProjectName == "" ? selectedProject?.project : updatedProjectName
      );

      setSelectedClient("");
      setSelectedProject(null);
      setHours(0);
      setUpdatedClientName("");
      setUpdatedProjectName("");
      getClients();
      refreshTime();
    } else {
      alert("please provide correct values");
    }
  };

  return (
    <>
      <div className="flex">
        <h1 className="text-xl text-white mr-4"> Update Project:- </h1>
        <div className="gap-6 flex flex-row items-center max-sm:ml-4 justify-center text-black">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter Client..."
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={
                    updatedClientName == "" ? selectedClient : updatedClientName
                  }
                  onChange={(e) => setUpdatedClientName(e.target.value)}
                />
                <ChevronsUpDown className="m1-2 h-4 w-4 shrink-e opacity-50" />
              </div>
            </PopoverTrigger>

            <PopoverContent className="w-full max-w-xs">
              <Command>
                <CommandInput placeholder="Search client..." />

                <CommandList>
                  <CommandEmpty>No client found.</CommandEmpty>

                  <CommandGroup>
                    {clients?.map((client) => (
                      <CommandItem
                        key={client}
                        value={client}
                        onSelect={(currentValue) => {
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
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter Project..."
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={
                      updatedProjectName == ""
                        ? selectedProject?.project
                        : updatedProjectName
                    }
                    onChange={(e) => setUpdatedProjectName(e.target.value)}
                  />
                  <ChevronsUpDown className="m1-2 h-4 w-4 shrink-e opacity-50" />
                </div>
              </PopoverTrigger>

              <PopoverContent className="w-full max-w-xs">
                <Command>
                  <CommandInput placeholder="Search Project..." />

                  <CommandList>
                    <CommandEmpty>No project found.</CommandEmpty>

                    <CommandGroup>
                      {projects?.map((project) => (
                        <CommandItem
                          key={project.project}
                          value={project.project}
                          onSelect={(currentValue) => {
                            const projectSelected = projects.find(
                              (p) => p?.project === currentValue
                            );
                            setHours(projectSelected?.maxTime);
                            setSelectedProject(projectSelected);
                            setOpenProject(false);
                          }}
                          className="capitalize"
                        >
                          <Check
                            className-={cn(
                              "mr-2 h-4 w-4",

                              selectedProject?.project === project?.project
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
              <div className="flex">
                <label
                  htmlFor="hours"
                  className="text-white mr-4 flex items-center"
                >
                  Hours
                </label>
                <input
                  type="number"
                  id="hours"
                  name="hours"
                  className="w-[200px] p-2 border border-gray-300 rounded"
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                />
              </div>
              <Button onClick={update} className="bg-red-600">Update</Button>
            </>
          )}
        </div>
      </div>
    </>
  );
};
export default UpdateProject;
