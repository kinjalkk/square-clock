"use client";
import React, { useEffect } from "react";
import { Check, ChevronDown } from "lucide-react";
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
import { getAllClients, getAllProjects, updateProject } from "@/lib/actions/project.actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
const UpdateProject: React.FC<any> = ({ refreshTime }) => {
  const [clients, setClients] = React.useState([]);
  const [projects, setProjects] = React.useState<any[]>([]);
  const [selectedClient, setSelectedClient] = React.useState("");
  const [selectedProject, setSelectedProject] = React.useState<any | null>();
  const [open, setOpen] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [openProject, setOpenProject] = React.useState(false);
  const [invalidCredentials,setInvalidCredentails]=React.useState(false);
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
  const handleChange=(e:any)=>{
    const {name,value}=e.target;    
    setSelectedProject({
      ...selectedProject,
      [name]:value
    })
  }
  const update = async () => {
    if (selectedProject && selectedProject.maxTime > -1 && selectedProject.client && selectedProject.project) {
      const update = await updateProject(
        selectedProject?._id,
        selectedProject.maxTime,
        selectedProject?.client,
        selectedProject?.project 
      );
      if(!update){
        setInvalidCredentails(true);
      }else{
        setSelectedClient("");
        setSelectedProject(null);
        setDialogOpen(false);
        getClients();
        refreshTime();
      }
    } else {
      if( !selectedProject.client || !selectedProject.project ){
        alert("Client and/or Project feilds are mandatory");
      } else{
        alert("Hours feild can not be negative")
      }
    }
  };
  return (
    <>
      <div className="flex">
        <h1 className="text-xl text-white mr-4"> Edit project: </h1>
        <div className="gap-6 flex flex-row items-center max-sm:ml-4 justify-center text-black">
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
                  : "Select client"}

                <ChevronDown className="m1-2 h-4 w-4 shrink-e opacity-50" />
              </Button>
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
                          setSelectedProject(null);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
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

          <Popover open={openProject} onOpenChange={setOpenProject}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openProject}
                className="w-[200px] justify-between"
                disabled={!selectedClient}
              >
                {selectedProject?.project
                  ? projects?.find(
                      (project: any) =>
                        project?.project === selectedProject?.project
                    )?.project
                  : "Select project"}

                <ChevronDown className="ml-2 h-4 w-4 shrink-8 opacity-50" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-full max-w-xs">
              <Command>
                <CommandInput placeholder="Search project..." />

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
                          setSelectedProject(projectSelected);
                          setOpenProject(false);
                        }}
                      >
                        <Check
                          className={cn(
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

          <Dialog open={dialogOpen} onOpenChange={(open)=>{ setDialogOpen(open);
          if(!open){
          setSelectedClient("");
          setSelectedProject(null);
          } }}>
            <DialogTrigger asChild>
              <Button className="bg-red-600" disabled={!selectedProject}>Edit</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-black text-white">
              <DialogHeader>
                <DialogTitle>Edit project</DialogTitle>
                <DialogDescription>
                  Make changes to your project here. Click save when you&apos;re
                  done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Client
                  </Label>
                  <Input
                    id="client"
                    name="client"
                    value={selectedProject?.client}
                    className="col-span-3 text-black"
                    onChange={handleChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Project
                  </Label>
                  <Input
                    id="project"
                    name="project"
                    value={selectedProject?.project}
                    className="col-span-3 text-black"
                    onChange={handleChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Hours
                  </Label>
                  <Input
                    id="maxTime"
                    name="maxTime"
                    value={selectedProject?.maxTime}
                    type="number"
                    className="col-span-3 text-black"
                    onChange={handleChange}
                  />
                </div>
              </div>
              {invalidCredentials && (
                <p className="text-red-600">
                 Project already exists
                </p>
              )}
              <DialogFooter>
                <Button type="submit" onClick={update} className="bg-red-600">Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
};
export default UpdateProject;
