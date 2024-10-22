"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  Check,
  ChevronDown,
  CircleStop,
  MoreHorizontal,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import * as XLSX from "exceljs";
import {
  getAllTimes,
  getTimeByDateRange,
  stopTime,
} from "@/lib/actions/time.actions";
import LiveTimer from "./LiveTimer";
import UpdateProject from "./UpdateProject";
import Loader from "./Loader";
import { getAllClients, getAllProjects } from "@/lib/actions/project.actions";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { getAllUsers } from "@/lib/actions/user.actions";

export type TimeSchema = {
  _id: string;
  user: string;
  project: string;
  hours: number;
  description: string;
  checkInTime: string;
  checkOutTime: string;
  __v: number;
  projectClient: string;
  projectName: string;
  projectMaxTime: number;
  userName: string;
  userEmail: string;
};

export function TimeTableAdmin() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [startDate, setStartDate] = React.useState<Date | null>(null);
  const [endDate, setEndDate] = React.useState<Date | null>(null);
  const [data, setData] = React.useState<TimeSchema[]>([]);
  const [isPickUpStartOpen, setIsPickUpStartOpen] =
    React.useState<boolean>(false);
  const [isEndDateOpen, setIsEndDateOpen] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [clients, setClients] = React.useState([]);
  const [users, setUsers] = React.useState<any[]>([]);
  const [projects, setProjects] = React.useState<any[]>([]);
  const [selectedClient, setSelectedClient] = React.useState("");
  const [selectedUser, setSelectedUser] = React.useState("");
  const [selectedProject, setSelectedProject] = React.useState<any | null>();
  const [open, setOpen] = React.useState(false);
  const [openProject, setOpenProject] = React.useState(false);
  const [openUser, setOpenUser] = React.useState(false);

  const getClients = async () => {
    const clientsFormDb = await getAllClients();
    setClients(clientsFormDb);
  };
const getUsers= async ()=>{
  const allUsers=await getAllUsers();
  setUsers(allUsers ||[]);
};
  React.useEffect(() => {
    getClients();
  }, []);
  React.useEffect(() => {
    getUsers();
  }, []);
  React.useEffect(() => {
    (async () => {
      const projectsFormDb = await getAllProjects(selectedClient);
      setProjects(projectsFormDb);
    })();
  }, [selectedClient]);
  const getTimes = async () => {
    setLoading(true);
    let allTimes: TimeSchema[];
    if (startDate && endDate) {
      allTimes = await getTimeByDateRange(startDate, endDate);
    } else {
      allTimes = await getAllTimes();
    }
    setData(allTimes);
    setLoading(false);
  };

  const columns: ColumnDef<TimeSchema>[] = [
    {
      accessorKey: "projectClient",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-white font-bold justify-center"
          >
            Client
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("projectClient")}</div>
      ),
    },
    {
      accessorKey: "projectName",
      header: () => (
        <div className="text-center font-bold text-white">Project</div>
      ),
      cell: ({ row }) => (
        <div className="text-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="text-white">
                {row.getValue("projectName")}
              </TooltipTrigger>

              <TooltipContent>
                <p>
                  <span className="font-bold">Total allotted:</span>{" "}
                  {row.original.projectMaxTime} hrs
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
    },
    {
      accessorKey: "userEmail",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="text-white font-bold"
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-center font-medium lowercase">
          {row.getValue("userEmail")}
        </div>
      ),
    },
    {
      accessorKey: "userName",
      header: () => (
        <div className="text-center font-bold text-white">User</div>
      ),
      cell: ({ row }) => (
        <div className="text-center font-medium">
          {row.getValue("userName")}
        </div>
      ),
    },
    {
      accessorKey: "checkInTime",
      header: () => (
        <div className="text-center font-bold text-white">Date</div>
      ),
      cell: ({ row }) => (
        <div className="text-center font-medium lowercase">
          {new Date(row.original.checkInTime).toLocaleString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      ),
    },
    {
      accessorKey: "hours",
      header: () => (
        <div className="text-center font-bold text-white">Hours</div>
      ),
      cell: ({ row }) => (
        <div className="text-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="text-white">
                {row.getValue("hours") === 0 ? (
                  <LiveTimer checkInTime={row.original.checkInTime} />
                ) : (
                  row.getValue("hours")
                )}
              </TooltipTrigger>

              <TooltipContent className="text-left">
                <p>
                  <span className="font-bold">Start time:</span>{" "}
                  {new Date(row.original.checkInTime).toLocaleString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </p>

                <p>
                  <span className="font-bold">End time: </span>{" "}
                  {row.original.checkOutTime
                    ? new Date(row.original.checkOutTime).toLocaleString(
                        "en-US",
                        {
                          hour: "numeric",
                          minute: "numeric",
                        }
                      )
                    : "Not ended"}
                </p>
                <p className="w-72">
                  <span className="font-bold">Description:</span>{" "}
                  {row.original.description || "NA"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        return row.original.hours === 0 ? (
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 bg-red-600"
            onClick={() => stop(row.original._id)}
          >
            <CircleStop className="h-4 w-4" />
          </Button>
        ) : (
          <></>
        );
      },
    },
  ];
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });
  React.useEffect(() => {
    if ((startDate && endDate) || (!startDate && !endDate)) {
      getTimes();
    }
  }, [startDate, endDate]);
  const format = (date: Date, format: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    return new Date(date).toLocaleDateString(undefined, options);
  };
  const stop = async (timeId: string) => {
    const stoppedTime = await stopTime(timeId);
    stoppedTime && getTimes();
  };
  const handleSelectDate = (date: Date) => {
    if (date > new Date()) {
      alert("Start date cannot be a future date.");
      return;
    }
    if (endDate && date > endDate) {
      alert("Start date cannot be later than end date.");
      return;
    }
    setStartDate(date);
    setIsPickUpStartOpen(false);
  };

  const handleSelectEndDate = (date: Date) => {
    if (date > new Date()) {
      alert("End date cannot be a future date.");
      return;
    }
    if (startDate && date < startDate) {
      alert("End date cannot be earlier than Start date.");
      return;
    }
    setEndDate(date);
    setIsEndDateOpen(false);
  };

  const downloadExcel = () => {
    const workbook = new XLSX.Workbook();
    const sheet = workbook.addWorksheet("TimeSheet");
    const columns = [
      "Client",
      "Project",
      "Max Hours",
      "Description",
      "User",
      "Date",
      "Hours",
    ];
    sheet.addRow(columns);
    table.getFilteredRowModel().rows.forEach((row) => {
      sheet.addRow([
        row.original.projectClient,
        row.original.projectName,
        row.original.projectMaxTime,
        row.original.description,
        row.original.userName,
        new Date(row.original.checkInTime).toLocaleString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
        }),
        row.original.hours,
      ]);
    });
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "TimeSheet.xlsx";
      a.click();
    });
  };
  return (
    <div className="w-full text-white">
      <UpdateProject refreshTime={getTimes} />
      <h1 className="text-2xl font-bold mt-4 text-white underline flex justify-center">
        Timesheet
      </h1>
      <div className="flex justify-between pt-8">
        <Popover open={isPickUpStartOpen} onOpenChange={setIsPickUpStartOpen}>
          <PopoverTrigger asChild>
            <Button variant={"outline"} className="w-1/4 text-black">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? (
                format(startDate, "PPP")
              ) : (
                <span>Pick start date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className={`w-auto p-0`}>
            <Calendar
              mode="single"
              selected={startDate ?? undefined}
              onSelect={(date) => date && handleSelectDate(date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Popover open={isEndDateOpen} onOpenChange={setIsEndDateOpen}>
          <PopoverTrigger asChild>
            <Button variant={"outline"} className="w-1/4 text-black">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? format(endDate, "PPP") : <span>Pick end date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className={`w-auto p-0`}>
            <Calendar
              mode="single"
              selected={endDate ?? undefined}
              onSelect={(date) => date && handleSelectEndDate(date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Button
          variant="outline"
          className="w-1/4 bg-red-600"
          onClick={() => {
            setStartDate(null);
            setEndDate(null);
          }}
        >
          Reset dates
        </Button>
      </div>
      <div className="flex items-center py-4">
        <span className="pr-4">Client:</span>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between text-black"
            >
              {selectedClient
                ? clients?.find((client) => client === selectedClient)
                : "Select client"}

              <ChevronDown className="ml-2 h-4 w-4 shrink-e opacity-50" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-full max-w-xs text-black">
            <Command>
              <CommandInput placeholder="Search client..." />

              <CommandList>
                <CommandEmpty>No client found.</CommandEmpty>

                <CommandGroup>
                  <CommandItem
                    key={""}
                    value={""}
                    onSelect={() => {
                      setSelectedClient("");
                      setSelectedProject(null);
                      table.getColumn("projectName")?.setFilterValue("");
                      table.getColumn("projectClient")?.setFilterValue("");
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",

                        selectedClient === "" ? "opacity-100" : "opacity-0"
                      )}
                    />
                    Select client
                  </CommandItem>
                  {clients?.map((client) => (
                    <CommandItem
                      key={client}
                      value={client}
                      onSelect={(currentValue) => {
                        setSelectedClient(currentValue);
                        setSelectedProject(null);
                        table.getColumn("projectName")?.setFilterValue("");
                        table
                          .getColumn("projectClient")
                          ?.setFilterValue(currentValue);
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
        <span className="pr-4 pl-3">Project:</span>
        <Popover open={openProject} onOpenChange={setOpenProject}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openProject}
              className="w-[200px] justify-between text-black"
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
                  <CommandItem
                    key={""}
                    value={""}
                    onSelect={() => {
                      table.getColumn("projectName")?.setFilterValue("");
                      setSelectedProject(null);
                      setOpenProject(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",

                        !selectedProject ? "opacity-100" : "opacity-0"
                      )}
                    />
                    Select project
                  </CommandItem>
                  {projects?.map((project) => (
                    <CommandItem
                      key={project.project}
                      value={project.project}
                      onSelect={(currentValue) => {
                        const projectSelected = projects.find(
                          (p) => p?.project === currentValue
                        );
                        table
                          .getColumn("projectName")
                          ?.setFilterValue(project?.project);
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
        <span className="pl-5 pr-4">User:</span>
        <Popover open={openUser} onOpenChange={setOpenUser}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openUser}
              className="w-[200px] justify-between text-black"
            >
              {selectedUser
                ? users?.find((user) => user === selectedUser)
                : "Select user"}

              <ChevronDown className="ml-2 h-4 w-4 shrink-e opacity-50" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-full max-w-xs text-black">
            <Command>
              <CommandInput placeholder="Search user..." />

              <CommandList>
                <CommandEmpty>No user found.</CommandEmpty>

                <CommandGroup>
                  <CommandItem
                    key={""}
                    value={""}
                    onSelect={() => {
                      setSelectedUser("");
                      table.getColumn("userName")?.setFilterValue("");
                      setOpenUser(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",

                        selectedUser === "" ? "opacity-100" : "opacity-0"
                      )}
                    />
                    Select user
                  </CommandItem>
                  {users?.map((user) => (
                    <CommandItem
                      key={user}
                      value={user}
                      onSelect={(currentValue) => {
                        setSelectedUser(currentValue);
                        table.getColumn("userName")?.setFilterValue(currentValue);
                        setOpenUser(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",

                          selectedUser === user
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {user}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-center">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex items-center justify-center h-full">
                    <Loader />
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-White">
          Total Hours:{" "}
          {table
            .getFilteredRowModel()
            .rows.reduce((total, row) => total + row.original.hours, 0)
            .toFixed(2)}
          <Button
            variant="outline"
            size="sm"
            className="ml-4 bg-red-600"
            onClick={downloadExcel}
          >
            Download
          </Button>
        </div>
        <div className="space-x-2 text-black">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
