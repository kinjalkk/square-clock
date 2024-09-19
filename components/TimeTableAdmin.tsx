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
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
const data: URL[] = [
  {
    id: "m5gr84i9",
    userName: "kim",
    clientName: "Sugam",
    projectName: "abc",
    userMail: "ken99@yahoo.com",
    hours: 3,
    checkInTime: "2022-01-01T10:00:00.000Z",
    checkOutTime: "2022-01-01T13:00:00.000Z",
    description: "tvty uygyu yuguy uyg7y  uygukygyiu ",
  },
  {
    id: "m5gr84i9",
    userName: "kim",
    clientName: "Sugam",
    projectName: "abc",
    userMail: "wdr99@yahoo.com",
    hours: 3,
    checkInTime: "2022-01-04T10:00:00.000Z",
    checkOutTime: "2022-01-04T13:00:00.000Z",
    description: "tvty uygyu yuguy uyg7y  uygukygyiu ",
  },
  {
    id: "m5gr84i9",
    userName: "kim",
    clientName: "Sugam",
    projectName: "abc",
    userMail: "xyz99@yahoo.com",
    hours: 3,
    checkInTime: "2022-01-01T10:00:00.000Z",
    checkOutTime: "2022-01-01T13:00:00.000Z",
    description: "tvty uygyu yuguy uyg7y  uygukygyiu ",
  },
  {
    id: "m5gr84i9",
    userName: "kim",
    clientName: "Sugam",
    projectName: "abc",
    userMail: "mnh980@yahoo.com",
    hours: 3,
    checkInTime: "2022-01-01T10:00:00.000Z",
    checkOutTime: "2022-01-01T13:00:00.000Z",
    description: "tvty uygyu yuguy uyg7y  uygukygyiu ",
  },
];

export type URL = {
  id: string;
  userName: string;
  userMail: string;
  clientName: string;
  projectName: string;
  hours: number;
  checkInTime: string;
  checkOutTime: string;
  description: string;
};

export const columns: ColumnDef<URL>[] = [
  {
    accessorKey: "clientName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-white font-bold"
        >
          Client
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("clientName")}</div>
    ),
  },
  {
    accessorKey: "projectName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-white font-bold"
        >
          Project Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("projectName")}</div>
    ),
  },
  {
    accessorKey: "userMail",
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
        {row.getValue("userMail")}
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
    accessorKey: "hours",
    header: () => <div className="text-center font-boldtext-white">Hours</div>,
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
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                })}
              </p>

              <p>
                <span className="font-bold">End Time: </span>{" "}
                {new Date(row.original.checkOutTime).toLocaleString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
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
];

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
    pageSize: 20,
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
        <span className="pl-5 pr-4">Search User</span>
        <Input
          placeholder="Filter emails..."
          value={
            (table.getColumn("userMail")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("userMail")?.setFilterValue(event.target.value)
          }
          className="max-w-sm text-black mr-8"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto text-black">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
            .getRowModel()
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
