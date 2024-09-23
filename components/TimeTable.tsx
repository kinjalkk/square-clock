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
const data: TimeSchemaUser[] = [
  {
    "id": "2q49t8n3",
    "clientName": "GreenTech Inc.",
    "projectName": "Solar Roof Design",
    "hours": 7,
    "checkInTime": "2024-09-18T09:15:00.000Z",
    "checkOutTime": "2024-09-18T16:30:00.000Z",
    "description": "Reviewing construction plans and material selection",
    "maxHours": 80
    },
    {
      "id": "1pbz07nl",
      "clientName": "Happy Homes",
      "projectName": "Kitchen Renovation",
      "hours": 2,
      "checkInTime": "2024-09-19T14:00:00.000Z",
      "checkOutTime": "2024-09-19T16:00:00.000Z",
      "description": "Client meeting to finalize design details",
      "maxHours": 25
    },
    {
    "id": "9x8fr5tm",
    "clientName": "Central Park",
    "projectName": "Landscape Design",
    "hours": 0,
    "checkInTime": "2024-09-17T11:00:00.000Z",
    "checkOutTime": "2024-09-17T16:00:00.000Z",
    "description": "Site visit and initial design sketches",
    "maxHours": 120
    },
    {
      "id": "0w3ei1un",
      "clientName": "City Museum",
      "projectName": "Expansion Wing",
      "hours": 8,
      "checkInTime": "2024-09-16T08:30:00.000Z",
      "checkOutTime": "2024-09-16T17:00:00.000Z",
      "description": "Creating 3D models and structural calculations",
      "maxHours": 200
    },
    {
    "id": "az7tm2qp",
    "clientName": "Sun and Sand Resorts",
    "projectName": "Pool Deck Design",
    "hours": 4,
    "checkInTime": "2024-09-20T10:00:00.000Z",  // Today's date
    "checkOutTime": "2024-09-20T14:00:00.000Z",  // Today's date
    "description": "Preparing renderings and material samples",
    "maxHours": 30
    },
    {
      "id": "8y5xn0kl",
      "clientName": "Tech Startup HQ",
      "projectName": "Open Office Layout",
      "hours": 1,
      "checkInTime": "2024-09-19T17:00:00.000Z",
      "checkOutTime": "2024-09-19T18:00:00.000Z",
      "description": "Internal team meeting on project progress",
      "maxHours": 70
    },

{
  "id": "8y5xn0kl",
  "clientName": "Tech Startup HQ",
  "projectName": "Open Office Layout",
  "hours": 1,
  "checkInTime": "2024-09-19T17:00:00.000Z",
  "checkOutTime": "2024-09-19T18:00:00.000Z",
  "description": "Internal team meeting on project progress",
  "maxHours": 15
  },
  {
  "id": "4p3w06t2",
  "clientName": "Historic Preservation Society",
  "projectName": "Building Restoration",
  "hours": 6,
  "checkInTime": "2024-09-17T09:00:00.000Z",
  "checkOutTime": "2024-09-17T15:00:00.000Z",
  "description": "Researching historical building codes and materials",
  "maxHours": 100
  },
  {
  "id": "7z6q18n5",
  "clientName": "Luxury Condominium Developer",
  "projectName": "Interior Design",
  "hours": 3,
  "checkInTime": "2024-09-20T11:00:00.000Z",
  "checkOutTime": "2024-09-20T14:00:00.000Z",
  "description": "Selecting furniture and finishes for model unit",
  "maxHours": 40
  },
  {
  "id": "2x9y07t4",
  "clientName": "Sustainable Living Center",
  "projectName": "Green Building Design",
  "hours": 5,
  "checkInTime": "2024-09-18T10:00:00.000Z",
  "checkOutTime": "2024-09-18T15:00:00.000Z",
  "description": "Calculating energy efficiency and environmental impact",
  "maxHours": 80
  },
  {
  "id": "5w8e19n3",
  "clientName": "Educational Institution",
  "projectName": "Classroom Layout",
  "hours": 2,
  "checkInTime": "2024-09-20T15:00:00.000Z",
  "checkOutTime": "2024-09-20T17:00:00.000Z",
  "description": "Meeting with teachers to discuss classroom needs",
  "maxHours": 20
  }
 
];

export type TimeSchemaUser = {
  id: string;
  clientName: string;
  projectName: string;
  hours: number;
  checkInTime: string;
  checkOutTime: string;
  description: string;
  maxHours:number;
};

export const columns: ColumnDef<TimeSchemaUser>[] = [
  {
    accessorKey: "clientName",
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
      <div className="capitalize text-center">{row.getValue("clientName")}</div>
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
              {row.getValue("hours")}
            </TooltipTrigger>

            <TooltipContent>
              <p>
                <span className="font-bold">Total alotted:</span>{" "}
                {row.original.maxHours} hrs
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
              {row.getValue("hours")}
            </TooltipTrigger>

            <TooltipContent>
              <p>
                <span className="font-bold">Start Time:</span>{" "}
                {new Date(row.original.checkInTime).toLocaleString("en-US", {
                  hour: "numeric",
                })}
              </p>

              <p>
                <span className="font-bold">End Time: </span>{" "}
                {new Date(row.original.checkOutTime).toLocaleString("en-US", {
                  hour: "numeric",
                })}
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
      const payment = row.original
 
      return (
        row.original.hours===0? <Button variant="ghost" className="h-8 w-8 p-0" onClick={stop}>
              <CircleStop className="h-4 w-4" />
            </Button>:<></>
        
      )
    },
  },
];

export function TimeTable() {
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
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);
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
    setIsCalendarOpen(false);
    setStartDate(date);
  };

  const handleSelectEndDate = (date: Date) => {
    setIsCalendarOpen(false);
    setEndDate(date);
  };
  const handleToggleCalendar = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };
  return (
    <div className="w-full text-white">
<div className="flex justify-between pt-8">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant={"outline"} className="w-1/4 text-black" onClick={handleToggleCalendar}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            {startDate ? format(startDate, "PPP") : <span>Pick start date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className={`w-auto p-0 ${isCalendarOpen ? '' : 'hidden'}`}>
          <Calendar
            mode="single"
            selected={startDate}
            onSelect={(date) => handleSelectDate(date)}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant={"outline"} className="w-1/4 text-black" onClick={handleToggleCalendar}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            {endDate ? format(endDate, "PPP") : <span>Pick end date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className={`w-auto p-0 ${isCalendarOpen ? '' : 'hidden'}`}>
          <Calendar
            mode="single"
            selected={endDate}
            onSelect={(date) => handleSelectEndDate(date)}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
      <div className="flex items-center py-4">
        <span className="pr-4">Search Client:-</span>
        <Input
          placeholder="Filter client..."
          value={
            (table.getColumn("clientName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("clientName")?.setFilterValue(event.target.value)
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
