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
import LiveTimer from "@/components/LiveTimer";


export type TimeSchemaUser = {
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
};



export function TimeTable({stop,times,startDate,setStartDate,endDate,setEndDate}:{stop:(timeId:string)=>void,
  times:TimeSchemaUser[],
  startDate:Date |null,
  setStartDate:React.Dispatch<React.SetStateAction<Date|null>>,
  endDate:Date | null,
  setEndDate:React.Dispatch<React.SetStateAction<Date|null>>,
}) {
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
  const [data,setData]=React.useState<TimeSchemaUser[]>(times);
  const [isPickUpStartOpen,setIsPickUpStartOpen]=React.useState<boolean>(false);
  const [isEndDateOpen,setIsEndDateOpen]=React.useState<boolean>(false);
  React.useEffect(()=>{
    setData(times);
  },[times]);
  const columns: ColumnDef<TimeSchemaUser>[] = [
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
      header: () => <div className="text-center font-bold text-white">Project</div>,
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
                    minute:"numeric"
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
  const format = (date: Date, format: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    return new Date(date).toLocaleDateString(undefined, options);
  };
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
    setIsPickUpStartOpen(false)
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
    setIsEndDateOpen(false)
  };
  return (
    <div className="w-full text-white">
<div className="flex justify-between pt-8">
      <Popover open={isPickUpStartOpen} onOpenChange={setIsPickUpStartOpen}>
        <PopoverTrigger asChild>
          <Button variant={"outline"} className="w-1/4 text-black">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {startDate ? format(startDate, "PPP") : <span>Pick start date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className={`w-auto p-0`}>
          <Calendar
            mode="single"
            selected={startDate}
            onSelect={(date) => handleSelectDate(date)}
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
        <PopoverContent className={`w-auto p-0 `}>
          <Calendar
            mode="single"
            selected={endDate}
            onSelect={(date) => handleSelectEndDate(date)}
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
          placeholder="Filter Project..."
          value={
            (table.getColumn("projectName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("projectName")?.setFilterValue(event.target.value)
          }
          className="max-w-sm text-black"
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
