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
import { ArrowUpDown, ChevronDown, CircleStop, MoreHorizontal } from "lucide-react";
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
import { getAllTimes,getTimeByDateRange, stopTime } from "@/lib/actions/time.actions";
import LiveTimer from "./LiveTimer";
import UpdateProject from "./UpdateProject";


export type TimeSchema = {
  _id: string;
  user:string;
  project:string;
  hours: number;
  description:string;
  checkInTime: string;
  checkOutTime: string;
  __v:number;
  projectClient:string;
  projectName:string;
  projectMaxTime:number;
  userName:string;
  userEmail:string;
};


export function TimeTableAdmin() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 6,
  });
  const [startDate, setStartDate] = React.useState<Date | null>(null);
  const [endDate, setEndDate] = React.useState<Date | null>(null);
  const [data,setData]=React.useState<TimeSchema[]>([]);
  const [isPickUpStartOpen,setIsPickUpStartOpen]=React.useState<boolean>(false);
  const [isEndDateOpen,setIsEndDateOpen]=React.useState<boolean>(false);
  const getTimes=async ()=>{
    let allTimes:TimeSchema[];
    if(startDate && endDate){
      allTimes= await getTimeByDateRange(startDate,endDate);
    } else{
      allTimes=await getAllTimes();
    }
    setData(allTimes);
  }

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
        <div className="capitalize text-center">{row.getValue("projectClient")}</div>
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
                  <span className="font-bold">Total alotted:</span>{" "}
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
            User Mail
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
      header: () => <div className="text-center font-bold text-white">User</div>,
      cell: ({ row }) => (
        <div className="text-center font-medium">{row.getValue("userName")}</div>
      ),
    },
    {
      accessorKey: "checkInTime",
      header: () => <div className="text-center font-bold text-white">date</div>,
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
      header: () => <div className="text-center font-bold text-white">Hours</div>,
      cell: ({ row }) => (
        <div className="text-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="text-white">
              {row.getValue("hours")===0?(
                  <LiveTimer checkInTime={row.original.checkInTime}/>):(
                    row.getValue("hours")
                )}
              </TooltipTrigger>
  
              <TooltipContent>
                <p>
                  <span className="font-bold">Start Time:</span>{" "}
                  {new Date(row.original.checkInTime).toLocaleString("en-US", {
                    hour: "numeric",
                    minute:"numeric",
                  })}
                </p>
  
                <p>
                  <span className="font-bold">End Time: </span>{" "}
                  {row.original.checkOutTime?new Date(row.original.checkOutTime).toLocaleString("en-US", {
                    hour: "numeric",
                    minute:"numeric",
                  }):"Not ended"}
                </p>
                <p className="w-72">
                  <span className="font-bold">Description:</span>{" "}
                  {row.original.description}
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
        return (
          row.original.hours===0? (
          <Button variant="ghost" className="h-8 w-8 p-0" onClick={()=>stop(row.original._id)}>
                <CircleStop className="h-4 w-4" />
              </Button>):(<></>)
          
        )
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
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: pagination,
    },
  });
  React.useEffect(()=>{
    getTimes();
  },[startDate,endDate])
  const format = (date: Date, format: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    return new Date(date).toLocaleDateString(undefined, options);
  };
  const stop=async (timeId:string)=>{
    const stoppedTime=await stopTime(timeId);
    stoppedTime && getTimes()
  }
  const handleSelectDate = (date: Date) => {
    if(date>new Date()){
      alert("Start date cannot be a future date.");
      return;
    }
    if(endDate && date>endDate){
      alert("Start date cannot be later than end date.");
      return;
    }
    setStartDate(date);
    setIsPickUpStartOpen(false);
  };

  const handleSelectEndDate = (date: Date) => {
    if(date> new Date()){
      alert("End date cannot be a future date.");
      return;
    }
    if(startDate && date<startDate){
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
        <UpdateProject refreshTime={getTimes}/>
        <h1 className="text-2xl font-bold mt-4 text-white underline flex justify-center">TimeSheet</h1>
      <div className="flex justify-between pt-8">
        <Popover open={isPickUpStartOpen} onOpenChange={setIsPickUpStartOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className="w-1/4 text-black"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? (
                format(startDate, "PPP")
              ) : (
                <span>Pick start date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className={`w-auto p-0`}
          >
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
            <Button
              variant={"outline"}
              className="w-1/4 text-black"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? format(endDate, "PPP") : <span>Pick end date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className={`w-auto p-0`}
          >
            <Calendar
              mode="single"
              selected={endDate ?? undefined}
              onSelect={(date) => date && handleSelectEndDate(date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Button variant="outline" className="w-1/4 text-black" onClick={()=>{
        setStartDate(null);
        setEndDate(null);
      }}>Reset Dates</Button>
      </div>
      <div className="flex items-center py-4">
      <span className="pr-4">Search Client:-</span>
        <Input
          placeholder="Filter client..."
          value={
            (table.getColumn("projectClient")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("projectClient")?.setFilterValue(event.target.value)
          }
          className="max-w-sm text-black"
        />
        <span className="pr-4 pl-3">Search Project:-</span>
        <Input
          placeholder="Filter project..."
          value={
            (table.getColumn("projectName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("projectName")?.setFilterValue(event.target.value)
          }
          className="max-w-sm text-black"
        />
        <span className="pl-5 pr-4">Search User:-</span>
        <Input
          placeholder="Filter user..."
          value={
            (table.getColumn("userName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("userName")?.setFilterValue(event.target.value)
          }
          className="max-w-sm text-black mr-8"
        />
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
            {table.getRowModel().rows?.length ? (
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
            .rows.reduce((total, row) => total + row.original.hours, 0)}
          <Button
            variant="outline"
            size="sm"
            className="ml-4 text-black"
            onClick={downloadExcel}
          >
            DownLoad
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
