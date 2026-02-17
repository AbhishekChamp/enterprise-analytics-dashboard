import { useState, useCallback, useMemo } from "react";
import { cn } from "@/utils/formatting";
import { exportToCSV } from "@/utils/export";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Download,
    ChevronLeft,
    ChevronRight,
    Grid3X3,
    List,
} from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface TableColumn<T = any> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    key: any;
    header: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render?: (value: any, item: T) => React.ReactNode;
    exportable?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface TableProps<T = any> {
    data: T[];
    columns: TableColumn<T>[];
    className?: string;
    onRowClick?: (item: T) => void;
    enableExport?: boolean;
    exportFileName?: string;
    enableSelection?: boolean;
    selectedIds?: string[];
    onSelectionChange?: (ids: string[]) => void;
    getRowId: (item: T) => string;
    enableVirtualScroll?: boolean;
    pageSize?: number;
    enablePagination?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function EnhancedTable<T extends object>({
    data,
    columns,
    className,
    onRowClick,
    enableExport = false,
    exportFileName = "export",
    enableSelection = false,
    selectedIds = [],
    onSelectionChange,
    getRowId,
    enableVirtualScroll = false,
    pageSize = 10,
    enablePagination = false,
}: TableProps<T>) {
    const [currentPage, setCurrentPage] = useState(0);
    const [isVirtualScroll, setIsVirtualScroll] = useState(enableVirtualScroll);

    const handleExport = useCallback(() => {
        const exportColumns = columns
            .filter((col) => col.exportable !== false)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((col) => ({ key: col.key as any, header: col.header }));

        exportToCSV(data, exportColumns, exportFileName);
    }, [data, columns, exportFileName]);

    const handleSelectAll = useCallback(() => {
        if (!onSelectionChange) return;

        const allIds = data.map(getRowId);
        const allSelected = allIds.every((id) => selectedIds.includes(id));

        if (allSelected) {
            onSelectionChange([]);
        } else {
            onSelectionChange(allIds);
        }
    }, [data, selectedIds, onSelectionChange, getRowId]);

    const handleSelectRow = useCallback(
        (id: string) => {
            if (!onSelectionChange) return;

            if (selectedIds.includes(id)) {
                onSelectionChange(selectedIds.filter((sid) => sid !== id));
            } else {
                onSelectionChange([...selectedIds, id]);
            }
        },
        [selectedIds, onSelectionChange],
    );

    const paginatedData = useMemo(() => {
        if (!enablePagination) return data;

        const start = currentPage * pageSize;
        return data.slice(start, start + pageSize);
    }, [data, currentPage, pageSize, enablePagination]);

    const totalPages = Math.ceil(data.length / pageSize);

    const renderTableBody = () => {
        if (isVirtualScroll && data.length > pageSize) {
            return (
                <div className='max-h-100 overflow-y-auto'>
                    <table className='w-full text-sm'>
                        <tbody className='divide-y divide-border'>
                            {data.map((item) => (
                                <tr
                                    key={getRowId(item)}
                                    className={cn(
                                        "bg-card hover:bg-muted/50 transition-colors",
                                        onRowClick && "cursor-pointer",
                                    )}
                                    onClick={() => onRowClick?.(item)}
                                >
                                    {enableSelection && (
                                        <td className='px-4 py-3 w-10'>
                                            <Checkbox
                                                checked={selectedIds.includes(
                                                    getRowId(item),
                                                )}
                                                onCheckedChange={() =>
                                                    handleSelectRow(
                                                        getRowId(item),
                                                    )
                                                }
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                            />
                                        </td>
                                    )}
                                    {columns.map((column, colIndex) => (
                                        <td
                                            key={colIndex}
                                            className='px-4 py-3'
                                        >
                                            {column.render
                                                ? column.render(
                                                      (
                                                          item as Record<
                                                              string,
                                                              unknown
                                                          >
                                                      )[column.key as string],
                                                      item,
                                                  )
                                                : String(
                                                      (
                                                          item as Record<
                                                              string,
                                                              unknown
                                                          >
                                                      )[column.key as string] ??
                                                          "",
                                                  )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        }

        return (
            <tbody className='divide-y divide-border'>
                {paginatedData.map((item) => (
                    <tr
                        key={getRowId(item)}
                        className={cn(
                            "bg-card hover:bg-muted/50 transition-colors",
                            onRowClick && "cursor-pointer",
                            selectedIds.includes(getRowId(item)) &&
                                "bg-primary/5",
                        )}
                        onClick={() => onRowClick?.(item)}
                    >
                        {enableSelection && (
                            <td className='px-4 py-3 w-10'>
                                <Checkbox
                                    checked={selectedIds.includes(
                                        getRowId(item),
                                    )}
                                    onCheckedChange={() =>
                                        handleSelectRow(getRowId(item))
                                    }
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </td>
                        )}
                        {columns.map((column, colIndex) => (
                            <td key={colIndex} className='px-4 py-3'>
                                {column.render
                                    ? column.render(
                                          (item as Record<string, unknown>)[
                                              column.key as string
                                          ],
                                          item,
                                      )
                                    : String(
                                          (item as Record<string, unknown>)[
                                              column.key as string
                                          ] ?? "",
                                      )}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        );
    };

    return (
        <div className={cn("space-y-4", className)}>
            {/* Toolbar */}
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    {enableExport && (
                        <Button
                            variant='outline'
                            size='sm'
                            onClick={handleExport}
                            className='gap-2'
                        >
                            <Download className='h-4 w-4' />
                            Export CSV
                        </Button>
                    )}
                    {enableSelection && (
                        <span className='text-sm text-muted-foreground'>
                            {selectedIds.length} selected
                        </span>
                    )}
                </div>
                <div className='flex items-center gap-2'>
                    {data.length > pageSize && (
                        <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => setIsVirtualScroll(!isVirtualScroll)}
                            className='gap-2'
                        >
                            {isVirtualScroll ? (
                                <>
                                    <List className='h-4 w-4' />
                                    Paginated
                                </>
                            ) : (
                                <>
                                    <Grid3X3 className='h-4 w-4' />
                                    Virtual Scroll
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className='overflow-x-auto rounded-md border'>
                <table className='w-full text-sm'>
                    <thead className='border-b border-border bg-muted/50'>
                        <tr>
                            {enableSelection && (
                                <th className='px-4 py-3 w-10'>
                                    <Checkbox
                                        checked={
                                            data.length > 0 &&
                                            data.every((item) =>
                                                selectedIds.includes(
                                                    getRowId(item),
                                                ),
                                            )
                                        }
                                        onCheckedChange={handleSelectAll}
                                    />
                                </th>
                            )}
                            {columns.map((column, index) => (
                                <th
                                    key={index}
                                    className='px-4 py-3 text-left font-medium text-muted-foreground'
                                >
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    {!isVirtualScroll && renderTableBody()}
                </table>
                {isVirtualScroll && (
                    <div className='border-t'>{renderTableBody()}</div>
                )}
            </div>

            {/* Pagination */}
            {enablePagination && totalPages > 1 && (
                <div className='flex items-center justify-between'>
                    <p className='text-sm text-muted-foreground'>
                        Showing {currentPage * pageSize + 1} to{" "}
                        {Math.min((currentPage + 1) * pageSize, data.length)} of{" "}
                        {data.length} entries
                    </p>
                    <div className='flex items-center gap-2'>
                        <Button
                            variant='outline'
                            size='sm'
                            onClick={() =>
                                setCurrentPage((p) => Math.max(0, p - 1))
                            }
                            disabled={currentPage === 0}
                        >
                            <ChevronLeft className='h-4 w-4' />
                        </Button>
                        <span className='text-sm'>
                            Page {currentPage + 1} of {totalPages}
                        </span>
                        <Button
                            variant='outline'
                            size='sm'
                            onClick={() =>
                                setCurrentPage((p) =>
                                    Math.min(totalPages - 1, p + 1),
                                )
                            }
                            disabled={currentPage === totalPages - 1}
                        >
                            <ChevronRight className='h-4 w-4' />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
