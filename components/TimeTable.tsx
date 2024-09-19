"use client"

import * as React from "react"
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
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const data: URL[] = [
  {
    id: "m5gr84i9",
    userName: "kim",
    clientName:"Sugam",
    projectName:"abc"
    userMail: "ken99@yahoo.com",
    hours:3,
    checkInTime:"2022-01-01T10:00:00.000Z",
    checkOutTime:"2022-01-01T13:00:00.000Z",
    description:"tvty uygyu yuguy uyg7y  uygukygyiu "
  },
  {
    id: "m5gr84i9",
    userName: "kim",
    clientName:"Sugam",
    projectName:"abc"
    userMail: "wdr99@yahoo.com",
    hours:3,
    checkInTime:"2022-01-04T10:00:00.000Z",
    checkOutTime:"2022-01-04T13:00:00.000Z",
    description:"tvty uygyu yuguy uyg7y  uygukygyiu "
  },
  {
    id: "m5gr84i9",
    userName: "kim",
    clientName:"Sugam",
    projectName:"abc"
    userMail: "xyz99@yahoo.com",
    hours:3,
    checkInTime:"2022-01-01T10:00:00.000Z",
    checkOutTime:"2022-01-01T13:00:00.000Z",
    description:"tvty uygyu yuguy uyg7y  uygukygyiu "
  },
  {
    id: "m5gr84i9",
    userName: "kim",
    clientName:"Sugam",
    projectName:"abc"
    userMail: "mnh980@yahoo.com",
    hours:3,
    checkInTime:"2022-01-01T10:00:00.000Z",
    checkOutTime:"2022-01-01T13:00:00.000Z",
    description:"tvty uygyu yuguy uyg7y  uygukygyiu "
  },
]

export type URL = {
  id: string;
  userName: string;
  userEmail:string;
  clientName:string;
  projectName:string;
  hours:number;
  checkInTime:string;
  checkOutTime:string;
  description:string;
}

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
        )
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
      )
    },
    cell: ({ row }) => <div className="capitalize">{row.getValue("projectName")}</div>,
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
      )
    },
    cell: ({ row }) =><div className="text-center font-medium lowercase">{row.getValue("userMail")}</div>,
  },
  {
    accessorKey: "userName",
    header: ()=><div className="text-center font-bold text-white">User</div>,
    cell: ({ row }) =><div className="text-center font-medium">{row.getValue("userName")}</div>,
  },
  {
    accessorkey: "hours",
    header: () => <div className="text-center font-boldtext-white">Hours</div>,
    cell: ({ row }) => <div className="text-center">
      <TooltipProvider>
<Tooltip>

<TooltipTrigger className="text-white">

{row.getValue("hours")}

</TooltipTrigger>

<TooltipContent>

<p><span className="font-bold">Start Time:</span> {new Date(row.original.checkInTime).toLocaleString('en-US', {

weekday: 'long',
month: 'long',

day: 'numeric',

year: 'numeric',

hour: 'numeric',

})}</p>

<p><span className="font-bold">End Time: </span> {new Date(row.original.checkOutTime).toLocaleString('en-US', {

weekday: 'long',
month: 'long',

day: 'numeric',

year: 'numeric',

hour: 'numeric',

})}</p>

<p className="w-72"><span className="font-bold">Description:</span> {row.original.description}</p>

</TooltipContent>

</Tooltip>

</TooltipProvider>

</div>,

},
];

export function TimeTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
const [rowSelection,setRowSelection]=React.useState({});
  const [pagination,setPagination]=React.useState({
    pageIndex:0,
    pageSize:20,
  });

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
    onPaginationChange:setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination:pagination,
    },
  });

  return (
    <div className="w-full text-white">
      <div className="flex items-center py-4">
        <span className="pr-4">Search Client:-</span>
      <Input
          placeholder="Filter client..."
          value={(table.getColumn("clientName")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("clientName")?.setFilterValue(event.target.value)
          }
          className="max-w-sm text-black"
        />
        <span className="pl-5 pr-4">Search User</span>
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn("userMail")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("userMail")?.setFilterValue(event.target.value)
          }
          className="max-w-sm text-black"
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
                )
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
                  )
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
            Total Hours: {table.getRowModel().rows.reduce((total,row)=>total+row.original.hours,0)}
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
  )
}
