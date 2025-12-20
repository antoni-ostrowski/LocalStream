import { useTrackArtwork } from "@/lib/hooks/get-artwork"
import { sqlcDb } from "@/wailsjs/go/models"
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState
} from "@tanstack/react-table"
import { useVirtualizer } from "@tanstack/react-virtual"
import { useEffect, useRef, useState } from "react"
import DebouncedInput from "../debounced-input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../ui/table"
import { fuzzyFilter, fuzzySort } from "./table-utils"
import TrackInteractions from "./track-interactions"

const columnHelper = createColumnHelper<sqlcDb.Track>()

export default function TrackTable({ tracks }: { tracks: sqlcDb.Track[] }) {
  const columns = [
    columnHelper.display({
      id: "artwork",
      header: `(${tracks.length.toString()})`,
      maxSize: 0.01,
      cell: (props) => <RenderTableArtwork track={props.row.original} />
    }),

    columnHelper.accessor("title", {
      header: "Title",
      size: 30,
      cell: (info) => (
        <div className="flex flex-col">
          <p className="truncate">{info.getValue()}</p>
        </div>
      ),
      filterFn: "fuzzy",
      sortingFn: fuzzySort
    }),

    columnHelper.accessor("artist", {
      header: "Artist",
      size: 20,
      cell: (info) => <p className="truncate">{info.getValue()}</p>
    }),

    columnHelper.accessor("album", {
      header: "Album",
      size: 20,
      cell: (info) => <p className="truncate">{info.getValue()}</p>
    }),

    columnHelper.accessor("is_missing", {
      header: "Available",
      size: 20,
      cell: (info) => (
        <p className="text-muted-foreground truncate">
          {info.getValue().Bool && "N/A"}
        </p>
      )
    }),

    columnHelper.display({
      id: "btns",
      size: 20,
      cell: (props) => (
        <div className="flex flex-row items-center justify-end">
          <TrackInteractions {...{ track: props.row.original }} />
        </div>
      )
    })
  ]

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState("")

  const table = useReactTable({
    columns,
    data: tracks,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    filterFns: {
      fuzzy: fuzzyFilter //define as a filter function that can be used in column definitions
    },
    state: {
      columnFilters,
      globalFilter
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "fuzzy" //apply fuzzy filter to the global filter (most common use case for fuzzy filter)
  })

  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: table.getRowModel().rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
    overscan: 20
  })

  useEffect(() => {
    if (table.getState().columnFilters[0]?.id === "title") {
      if (table.getState().sorting[0]?.id !== "title") {
        table.setSorting([{ id: "title", desc: false }])
      }
    }
  }, [table.getState().columnFilters[0]?.id, table])

  return (
    <div ref={parentRef} className="">
      <div>
        <DebouncedInput
          value={globalFilter}
          onChange={(value) => {
            setGlobalFilter(String(value))
          }}
          placeholder="Search ..."
        />
      </div>
      <Table style={{ tableLayout: "fixed", width: "100%" }}>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    style={{ width: header.getSize() }}
                  >
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
          {table.getRowModel().rows.length ? (
            <>
              {virtualizer.getVirtualItems().map((virtualRow, index) => {
                const row = table.getRowModel().rows[virtualRow.index]
                if (!row) return null
                return (
                  <TableRow
                    style={{
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${
                        virtualRow.start - index * virtualRow.size
                      }px)`
                    }}
                    key={row.original.id}
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
                )
              })}
            </>
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export function RenderTableArtwork({ track }: { track: sqlcDb.Track }) {
  const { renderArtworkOrFallback } = useTrackArtwork(track)
  return <>{renderArtworkOrFallback()}</>
}
