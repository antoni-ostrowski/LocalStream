import { queries } from "@/src/api/queries"
import { sqlcDb } from "@/wailsjs/go/models"
import { useQuery } from "@tanstack/react-query"
import {
  ColumnFiltersState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Dot } from "lucide-react"
import { useState } from "react"
import { fuzzyFilter, fuzzySort } from "../track-table/table-utils"
import TrackInteractions from "../track-table/track-interactions"
import { RenderTableArtwork } from "../track-table/track-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"

const columnHelper = createColumnHelper<sqlcDb.Track>()

export default function QueueTrackTable() {
  const { data: queueTracks } = useQuery(queries.player.listQueue())
  console.log({ queueTracks })

  return <>{queueTracks && <QueueTable queueTracks={queueTracks} />}</>
}

function QueueTable({ queueTracks }: { queueTracks: sqlcDb.Track[] }) {
  const columns = [
    columnHelper.display({
      id: "artwork",
      header: `(${queueTracks.length.toString()})`,
      maxSize: 0.01,
      cell: (props) => <RenderTableArtwork track={props.row.original} />,
    }),

    columnHelper.accessor("title", {
      header: "Title",
      size: 30,
      cell: ({
        row: {
          original: { title, artist, album },
        },
      }) => (
        <div className="flex flex-col">
          <div className="flex w-full flex-col items-start justify-start">
            <h1 className="text-md">{title}</h1>
            <div className="flex flex-row items-center justify-center gap-0">
              <h2 className="text-muted-foreground">{artist}</h2>
              <Dot className="text-muted-foreground" />
              <h2 className="text-muted-foreground">{album}</h2>
            </div>
          </div>
        </div>
      ),
      filterFn: "fuzzy",
      sortingFn: fuzzySort,
    }),

    columnHelper.display({
      id: "btns",
      size: 20,
      cell: (props) => (
        <div
          className="flex flex-row items-center justify-end"
          onClick={() => console.log("div")}
        >
          <TrackInteractions
            {...{ track: props.row.original, showPlayNow: false }}
          />
        </div>
      ),
    }),
  ]
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState("")

  const table = useReactTable({
    columns,
    data: queueTracks,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      columnFilters,
      globalFilter,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "fuzzy",
  })

  return (
    <Table style={{ tableLayout: "fixed", width: "100%" }}>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead key={header.id} style={{ width: header.getSize() }}>
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
            {table.getRowModel().rows.map((row) => {
              return (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
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
  )
}
