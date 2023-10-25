import { cn } from "@/lib/utils";
import { Patient } from "@/types/patient";
import { Button, IconButton, Table, TableHead, Tooltip } from "@mui/material";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AltArrowLeft as LeftIcon,
  AltArrowRight as RightIcon,
  PenNewRound as EditIcon,
  TrashBinMinimalistic as DeleteIcon,
} from "solar-icon-set";

const PatientTable = ({ data, query }: { data: Patient[]; query: string }) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const router = useRouter();

  const columns: ColumnDef<Patient>[] = [
    {
      header: ({ column }) => (
        <div
          className="flex items-center gap-1.5"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <p className="ml-3 tracking-wider">ID</p>
        </div>
      ),
      accessorKey: "id",
      id: "id",
      cell: ({ row }) => (
        <p className="text-sm text-blue-600 underline">
          {row.original.id || "-"}
        </p>
      ),
    },
    {
      header: ({ column }) => (
        <div
          className="flex items-center gap-1.5"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <p className="tracking-wider">Name</p>
        </div>
      ),
      accessorFn: (row) => `${row.first_name} ${row.last_name}`,
      id: "name",
      cell: ({ row }) => (
        <p className=" ">
          {`${row.original.first_name} ${row.original.last_name}`}
        </p>
      ),
    },
    {
      header: ({ column }) => (
        <div
          className="flex items-center gap-1.5 justify-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <p className="tracking-wider">Phone no.</p>
        </div>
      ),
      accessorKey: "phoneNo",
      id: "phoneNo",
      cell: ({ row }) => (
        <p className="font-normal tracking-wide text-center text-sm">
          {row.original.phone || "-"}
        </p>
      ),
    },
    {
      header: ({ column }) => (
        <div
          className="flex items-center gap-1.5 justify-center "
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <p className="tracking-wider">Address</p>
        </div>
      ),
      accessorKey: "address",
      id: "address",
      cell: ({ row }) => (
        <div className=" align-center w-full flex justify-center">
          <p className=" text-sm text-center w-[12rem] ">
            {row.original.address?.length === 0 ? "-" : row.original.address}
          </p>
        </div>
      ),
    },
    {
      header: ({ column }) => (
        <div
          className="flex items-center gap-1.5 justify-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <p className="tracking-wider">Prescription</p>
        </div>
      ),
      accessorKey: "prescription",
      id: "prescription",
      cell: ({ row }) => (
        <div>
          <p className="text-sm text-center">
            {row.original.prescription || "-"}
          </p>
          <p className="text-sm text-center text-gray-400">
            {row.original.dose || "-"}
          </p>
        </div>
      ),
    },
    {
      header: ({ column }) => (
        <div
          className="flex items-center gap-1.5 justify-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <p className="tracking-wider">Physician</p>
        </div>
      ),
      accessorKey: "physician",
      id: "physician",
      cell: ({ row }) => (
        <div className=" flex flex-col items-center justify-center text-sm">
          <p className="mb-1 font-medium ">
            {row.original.physician_first_name
              ? `${row.original.physician_first_name} ${row.original.physician_last_name}`
              : "-"}
          </p>
          <p className="bg-blue-50 py-1 px-3 rounded-lg text-xs text-blue-500 min-w-[6rem] text-center">
            {row.original.physician_id || "-"}
          </p>
        </div>
      ),
    },
    {
      header: ({ column }) => (
        <div
          className="flex items-center gap-1.5 justify-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <p className="tracking-wider"> Bill</p>
        </div>
      ),
      accessorKey: "bill",
      id: "bill",
      cell: ({ row }) => (
        <p className=" text-sm text-center">
          {row.original.physician_bill || "-"}
        </p>
      ),
    },
    {
      header: ({ column }) => (
        <div
          className="flex items-center gap-1.5 justify-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <p className="tracking-wider">Actions</p>
        </div>
      ),
      accessorKey: "actions",
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-2 items-center justify-center">
          <Tooltip title="Edit" arrow>
            <IconButton
              onClick={() => handleEditPatient(row.index, row.original)}
            >
              <EditIcon size={20} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete" arrow>
            <IconButton>
              <DeleteIcon size={20} />
            </IconButton>
          </Tooltip>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: { columnFilters, sorting },
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
  });

  useEffect(() => {
    table.getColumn("name")?.setFilterValue(query);
  }, [query]);

  const handleEditPatient = (index: number, patient: Patient) => {
    const rowNo = data.length - index + 1;

    router.push(`/dashboard/edit-patient?patientId=${patient.id}&row=${rowNo}`);
  };

  return (
    <div>
      <table className="w-full ">
        <thead className="border-b bg-cyan-50 ">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              key={headerGroup.id}
              className="h-10 capitalize hover:bg-card tracking-wide select-none  "
            >
              {headerGroup.headers.map((header) => {
                return (
                  <th
                    className="text-gray-500 uppercase text-xs"
                    key={header.id}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {" "}
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <tr
                //   onClick={() => navigateToCampaignDetails(row.original.id)}
                key={row.id}
                className="cursor-pointer border-b text-gray-600 "
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="py-3 px-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <th colSpan={columns.length} className="h-24 text-center">
                No results.
              </th>
            </tr>
          )}
        </tbody>
      </table>
      <div className="flex items-center justify-end gap-3 p-4 border-t">
        <Button
          variant="outlined"
          className="gap-2 rounded-xl normal-case"
          onClick={table.previousPage}
          disabled={!table.getCanPreviousPage()}
          startIcon={<LeftIcon className="w-4 h-4" />}
        >
          <span>Prev</span>
        </Button>
        <Button
          variant="outlined"
          className="gap-2 rounded-xl normal-case"
          onClick={table.nextPage}
          disabled={!table.getCanNextPage()}
          endIcon={<RightIcon className="w-4 h-4" />}
        >
          <span>Next</span>
        </Button>
      </div>
    </div>
  );
};

export default PatientTable;
