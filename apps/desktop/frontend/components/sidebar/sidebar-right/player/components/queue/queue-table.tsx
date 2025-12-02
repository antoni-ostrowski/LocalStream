import { fuzzyFilter } from '@/components/track-table/table-utils'
import TrackInteractions from '@/components/track-table/track-interactions'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { makeArtworkUrl } from '@/lib/utils'
import type { TrackType } from '@/server/db/schema'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Trash2 } from 'lucide-react'
import { useRef } from 'react'

const columnHelper = createColumnHelper<TrackType>()

export default function QueueTable({
  tracks,
  deleteTrackFromQueue,
}: {
  tracks: TrackType[]
  deleteTrackFromQueue: (track: TrackType) => void
}) {
  const columns = [
    columnHelper.display({
      id: 'artwork',
      header: `(${tracks.length})`,
      maxSize: 0.01,
      cell: (props) => (
        <img className="w-10" src={makeArtworkUrl(props.row.original.path)} />
      ),
    }),

    columnHelper.accessor('title', {
      header: 'Title',
      size: 30,
      cell: ({
        row: {
          original: { title, artist },
        },
      }) => (
        <div className="flex flex-col">
          <p className="truncate">{title}</p>
          <p className="text-muted-foreground">{artist}</p>
        </div>
      ),
    }),
    columnHelper.accessor('album', {
      header: 'Album',
      size: 20,
      cell: (info) => <p className="truncate">{info.getValue()}</p>,
    }),

    columnHelper.display({
      id: 'queue-track-interactions',
      size: 20,
      cell: (props) => (
        <div className="flex flex-row items-center justify-center gap-2">
          <Button
            variant={'ghost'}
            className="text-destructive hover:text-destructive"
            onClick={() => deleteTrackFromQueue(props.row.original)}
          >
            <Trash2 size={20} />
          </Button>
          <TrackInteractions track={props.row.original} />
        </div>
      ),
    }),
  ]

  const table = useReactTable({
    columns,
    data: tracks,
    getCoreRowModel: getCoreRowModel(),
    filterFns: {
      fuzzy: fuzzyFilter,
    },
  })

  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: table.getRowModel().rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
    overscan: 20,
  })

  return (
    <div ref={parentRef}>
      <Table style={{ tableLayout: 'fixed', width: '100%' }}>
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
          {table.getRowModel().rows?.length ? (
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
                      }px)`,
                    }}
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
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
                Add something to queue.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
