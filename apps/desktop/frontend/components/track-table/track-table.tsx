import { queries } from "@/src/api/queries"
import { AddToQueue, PauseResume, PlayTrack } from "@/wailsjs/go/main/App"
import { sqlcDb } from "@/wailsjs/go/models"
import { useQueryClient } from "@tanstack/react-query"
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
} from "@tanstack/react-table"
import { useVirtualizer } from "@tanstack/react-virtual"
import { useEffect, useRef, useState } from "react"
import DebouncedInput from "../debounced-input"
import { Button } from "../ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import { fuzzyFilter, fuzzySort } from "./table-utils"
import TrackContextMenu from "./track-context-menu"
import TrackInteractions from "./track-interactions"

const columnHelper = createColumnHelper<sqlcDb.Track>()

export default function TrackTable({ tracks }: { tracks: sqlcDb.Track[] }) {
  const qc = useQueryClient()
  const columns = [
    columnHelper.display({
      id: "artwork",
      header: `(${tracks.length.toString()})`,
      maxSize: 0.01,
      // cell: (props) => (
      //   <img className="w-10" src={makeArtworkUrl(props.row.original.path)} />
      // ),
    }),

    columnHelper.accessor("title", {
      header: "Title",
      size: 30,
      cell: ({
        row: {
          original: { title, artist, is_missing },
        },
      }) => (
        <div className="flex flex-col">
          <p className="truncate">{title}</p>
          <p className="text-muted-foreground">{artist}</p>
          <p className="text-muted-foreground">
            {is_missing.Valid && is_missing.Bool && "missing"}
          </p>
        </div>
      ),
      filterFn: "fuzzy", //using our custom fuzzy filter function
      // filterFn: fuzzyFilter, //or just define with the function
      sortingFn: fuzzySort, //sort by fuzzy rank (falls back to alphanumeric)
    }),
    columnHelper.accessor("album", {
      header: "Album",
      size: 20,
      cell: (info) => <p className="truncate">{info.getValue()}</p>,
    }),

    columnHelper.display({
      id: "btns",
      size: 20,
      cell: (props) => (
        <div className="flex flex-row items-center justify-end">
          <TrackInteractions {...{ track: props.row.original }} />
          <Button
            onClick={async () => {
              await PlayTrack(props.row.original)
              await qc.invalidateQueries({ queryKey: queries.player._def })
            }}
          >
            play
          </Button>
          <Button
            onClick={async () => {
              await PauseResume()
            }}
          >
            pause
          </Button>
          <Button
            onClick={async () => {
              await AddToQueue(props.row.original)
              await qc.invalidateQueries({ queryKey: queries.player._def })
            }}
          >
            add to q
          </Button>
        </div>
      ),
    }),
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
      fuzzy: fuzzyFilter, //define as a filter function that can be used in column definitions
    },
    state: {
      columnFilters,
      globalFilter,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "fuzzy", //apply fuzzy filter to the global filter (most common use case for fuzzy filter)
  })

  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: table.getRowModel().rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
    overscan: 20,
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
                          header.getContext(),
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
                {
                  /* if (!row) return null */
                }
                return (
                  <TableRow
                    onDoubleClick={() => {
                      handlePlayNewTrack(row.original)
                    }}
                    style={{
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${
                        virtualRow.start - index * virtualRow.size
                      }px)`,
                    }}
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        <TrackContextMenu track={row.original}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TrackContextMenu>
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
