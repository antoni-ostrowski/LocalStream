import { createArtworkLink, formatSongLength } from "@/lib/utils"
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
import { ReactNode, useEffect, useRef, useState } from "react"
import DebouncedInput from "../debounced-input"
import { fuzzyFilter, fuzzySort } from "./table-utils"
import TrackInteractions, { PlayNowBtn } from "./track-interactions"

const columnHelper = createColumnHelper<sqlcDb.Track>()

export default function TrackTable({
  tracks,
  filters
}: {
  tracks: sqlcDb.Track[]
  filters?: ReactNode
}) {
  const columns = [
    columnHelper.display({
      id: "artwork",
      header: `(${tracks?.length?.toString()})`,
      size: 30,
      cell: (info) => (
        <>
          <div className="relative flex items-center justify-center">
            <p className="text-muted-foreground transition-opacity duration-200 hover:opacity-0">
              {info.row.index + 1}
            </p>

            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-100 hover:opacity-100">
              <PlayNowBtn {...{ track: info.row.original }} />
            </div>
          </div>
        </>
      )
    }),

    columnHelper.accessor("title", {
      header: "Title",
      size: 350,
      cell: (info) => (
        <div className="flex flex-row items-center justify-start gap-4">
          <RenderTableArtwork track={info.row.original} />
          <p className="truncate">{info.getValue()}</p>
        </div>
      ),
      filterFn: "fuzzy",
      sortingFn: fuzzySort
    }),

    columnHelper.accessor("artist", {
      header: "Artist",
      size: 150,
      cell: (info) => <p className="truncate">{info.getValue()}</p>
    }),

    columnHelper.accessor("album", {
      header: "Album",
      size: 150,
      cell: (info) => <p className="truncate">{info.getValue()}</p>
    }),

    columnHelper.accessor("duration_seconds", {
      header: "Duration",
      size: 50,
      cell: (info) => (
        <p className="text-muted-foreground truncate">
          {formatSongLength(info.getValue().Int64)}
        </p>
      )
    }),

    columnHelper.display({
      id: "btns",
      size: 100,
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
  const { rows } = table.getRowModel()

  const virtualizer = useVirtualizer({
    count: rows.length,
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
    <div>
      <div className="mb-4 flex flex-row gap-2">
        <DebouncedInput
          value={globalFilter}
          onChange={(value) => {
            setGlobalFilter(String(value))
          }}
          placeholder="Search ..."
        />
        {filters}
      </div>
      <div ref={parentRef} className="container h-screen overflow-auto">
        <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
          <table className="w-full table-fixed">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <th
                        key={header.id}
                        colSpan={header.colSpan}
                        style={{ width: header.getSize() }}
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            {...{
                              className: header.column.getCanSort()
                                ? "cursor-pointer select-none"
                                : "",
                              onClick: header.column.getToggleSortingHandler()
                            }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {{
                              asc: " 🔼",
                              desc: " 🔽"
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                        )}
                      </th>
                    )
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {virtualizer.getVirtualItems().map((virtualRow, index) => {
                const row = rows[virtualRow.index]
                return (
                  <tr
                    key={row.id}
                    style={{
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${
                        virtualRow.start - index * virtualRow.size
                      }px)`
                    }}
                  >
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <td key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export function RenderTableArtwork({ track }: { track: sqlcDb.Track }) {
  return <img src={createArtworkLink(track.path)} className="w-10 bg-red-500" />
}
