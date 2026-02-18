import { useState, useCallback, useMemo } from "react";
import { cn } from "@/utils/formatting";
import { exportToCSV, exportToJSON } from "@/utils/export";
import { exportToPDF } from "@/utils/pdf-export";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    ChevronLeft,
    ChevronRight,
    Grid3X3,
    List,
    ChevronUp,
    ChevronDown,
    Eye,
    EyeOff,
    Settings2,
    FileJson,
    FileSpreadsheet,
    FileText,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type SortDirection = "asc" | "desc" | null;

interface SortState {
    key: string | null;
    direction: SortDirection;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface TableColumn<T = any> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    key: any;
    header: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render?: (value: any, item: T) => React.ReactNode;
    exportable?: boolean;
    sortable?: boolean;
    filterable?: boolean;
    filterType?: "text" | "select" | "date";
    filterOptions?: { label: string; value: string }[];
    hidden?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface TableProps<T = any> {
    data: T[];
    columns: TableColumn<T>[];
    className?: string;
    onRowClick?: (item: T) => void;
    enableExport?: boolean;
    enableJSONExport?: boolean;
    exportFileName?: string;
    enableSelection?: boolean;
    selectedIds?: string[];
    onSelectionChange?: (ids: string[]) => void;
    getRowId: (item: T) => string;
    enableVirtualScroll?: boolean;
    pageSize?: number;
    enablePagination?: boolean;
    enableSorting?: boolean;
    enableColumnVisibility?: boolean;
    onSort?: (sort: SortState) => void;
}

export function EnhancedTable<T extends object>({
    data,
    columns: initialColumns,
    className,
    onRowClick,
    enableExport = false,
    enableJSONExport = false,
    exportFileName = "export",
    enableSelection = false,
    selectedIds = [],
    onSelectionChange,
    getRowId,
    enableVirtualScroll = false,
    pageSize = 10,
    enablePagination = false,
    enableSorting = false,
    enableColumnVisibility = false,
    onSort,
}: TableProps<T>) {
    const [currentPage, setCurrentPage] = useState(0);
    const [isVirtualScroll, setIsVirtualScroll] = useState(enableVirtualScroll);
    const [sort, setSort] = useState<SortState>({ key: null, direction: null });
    const [columns, setColumns] = useState<TableColumn<T>[]>(initialColumns);
    const [filters, setFilters] = useState<Record<string, string>>({});

    // Handle sorting
    const handleSort = useCallback(
        (key: string) => {
            setSort((prev) => {
                let newSort: SortState;
                if (prev.key === key) {
                    if (prev.direction === "asc") {
                        newSort = { key, direction: "desc" };
                    } else if (prev.direction === "desc") {
                        newSort = { key: null, direction: null };
                    } else {
                        newSort = { key, direction: "asc" };
                    }
                } else {
                    newSort = { key, direction: "asc" };
                }
                onSort?.(newSort);
                return newSort;
            });
        },
        [onSort],
    );

    // Handle filtering
    const handleFilterChange = useCallback((key: string, value: string) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
        setCurrentPage(0);
    }, []);

    // Toggle column visibility
    const toggleColumnVisibility = useCallback((index: number) => {
        setColumns((prev) =>
            prev.map((col, i) =>
                i === index ? { ...col, hidden: !col.hidden } : col,
            ),
        );
    }, []);

    // Filter and sort data
    const processedData = useMemo(() => {
        let result = [...data];

        // Apply filters
        Object.entries(filters).forEach(([key, value]) => {
            if (value) {
                result = result.filter((item) => {
                    const itemValue = (item as Record<string, unknown>)[key];
                    if (itemValue === null || itemValue === undefined)
                        return false;
                    return String(itemValue)
                        .toLowerCase()
                        .includes(value.toLowerCase());
                });
            }
        });

        // Apply sorting
        if (sort.key && sort.direction) {
            result.sort((a, b) => {
                const aValue = (a as Record<string, unknown>)[sort.key!];
                const bValue = (b as Record<string, unknown>)[sort.key!];

                if (aValue === null || aValue === undefined) return 1;
                if (bValue === null || bValue === undefined) return -1;

                let comparison = 0;
                if (typeof aValue === "number" && typeof bValue === "number") {
                    comparison = aValue - bValue;
                } else if (
                    typeof aValue === "string" &&
                    typeof bValue === "string"
                ) {
                    comparison = aValue.localeCompare(bValue);
                } else {
                    comparison = String(aValue).localeCompare(String(bValue));
                }

                return sort.direction === "asc" ? comparison : -comparison;
            });
        }

        return result;
    }, [data, filters, sort]);

    const handleExportCSV = useCallback(() => {
        const visibleColumns = columns
            .filter((col) => !col.hidden && col.exportable !== false)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((col) => ({ key: col.key as any, header: col.header }));

        exportToCSV(processedData, visibleColumns, exportFileName);
    }, [processedData, columns, exportFileName]);

    const handleExportJSON = useCallback(() => {
        exportToJSON(processedData, exportFileName);
    }, [processedData, exportFileName]);

    const handleExportPDF = useCallback(() => {
        const visibleColumns = columns
            .filter((col) => !col.hidden && col.exportable !== false)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((col) => ({ key: col.key as any, header: col.header }));

        exportToPDF(processedData, visibleColumns, {
            title: exportFileName,
            filename: exportFileName,
        });
    }, [processedData, columns, exportFileName]);

    const handleSelectAll = useCallback(() => {
        if (!onSelectionChange) return;

        const allIds = processedData.map(getRowId);
        const allSelected = allIds.every((id) => selectedIds.includes(id));

        if (allSelected) {
            onSelectionChange([]);
        } else {
            onSelectionChange(allIds);
        }
    }, [processedData, selectedIds, onSelectionChange, getRowId]);

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
        if (!enablePagination) return processedData;

        const start = currentPage * pageSize;
        return processedData.slice(start, start + pageSize);
    }, [processedData, currentPage, pageSize, enablePagination]);

    const totalPages = Math.ceil(processedData.length / pageSize);
    const visibleColumns = columns.filter((col) => !col.hidden);

    const renderTableBody = () => {
        if (isVirtualScroll && processedData.length > pageSize) {
            return (
                <div className='max-h-100 overflow-y-auto'>
                    <table className='w-full text-sm'>
                        <tbody className='divide-y divide-border'>
                            {processedData.map((item) => (
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
                                    {visibleColumns.map((column, colIndex) => (
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
                        {visibleColumns.map((column, colIndex) => (
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

    const renderSortIcon = (column: TableColumn<T>) => {
        if (!enableSorting || column.sortable === false) return null;

        if (sort.key !== column.key) {
            return (
                <ChevronUp className='ml-1 h-3 w-3 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity' />
            );
        }

        return sort.direction === "asc" ? (
            <ChevronUp className='ml-1 h-3 w-3 text-primary' />
        ) : (
            <ChevronDown className='ml-1 h-3 w-3 text-primary' />
        );
    };

    return (
        <div className={cn("space-y-4", className)}>
            {/* Toolbar */}
            <div className='flex items-center justify-between flex-wrap gap-2'>
                <div className='flex items-center gap-2'>
                    {/* Export Buttons - Individual */}
                    {enableExport && (
                        <Button
                            variant='outline'
                            size='sm'
                            onClick={handleExportCSV}
                            className='gap-2'
                        >
                            <FileSpreadsheet className='h-4 w-4' />
                            Export CSV
                        </Button>
                    )}
                    {enableExport && (
                        <Button
                            variant='outline'
                            size='sm'
                            onClick={handleExportPDF}
                            className='gap-2'
                        >
                            <FileText className='h-4 w-4' />
                            Export PDF
                        </Button>
                    )}
                    {enableJSONExport && (
                        <Button
                            variant='outline'
                            size='sm'
                            onClick={handleExportJSON}
                            className='gap-2'
                        >
                            <FileJson className='h-4 w-4' />
                            Export JSON
                        </Button>
                    )}
                    {enableSelection && (
                        <span className='text-sm text-muted-foreground'>
                            {selectedIds.length} selected
                        </span>
                    )}
                </div>
                <div className='flex items-center gap-2'>
                    {enableColumnVisibility && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant='outline'
                                    size='sm'
                                    className='gap-2'
                                >
                                    <Settings2 className='h-4 w-4' />
                                    Columns
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end' className='w-48'>
                                {columns.map((column, index) => (
                                    <DropdownMenuItem
                                        key={index}
                                        onClick={() =>
                                            toggleColumnVisibility(index)
                                        }
                                        className='flex items-center justify-between'
                                    >
                                        <span>{column.header}</span>
                                        {!column.hidden ? (
                                            <Eye className='h-4 w-4 text-primary' />
                                        ) : (
                                            <EyeOff className='h-4 w-4 text-muted-foreground' />
                                        )}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                    {processedData.length > pageSize && (
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

            {/* Column Filters */}
            {columns.some((col) => col.filterable) && (
                <div className='flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg'>
                    {columns
                        .filter((col) => col.filterable && !col.hidden)
                        .map((column, index) => (
                            <div key={index} className='flex-1 min-w-37.5'>
                                {column.filterType === "select" &&
                                column.filterOptions ? (
                                    <select
                                        value={
                                            filters[column.key as string] || ""
                                        }
                                        onChange={(e) =>
                                            handleFilterChange(
                                                column.key as string,
                                                e.target.value,
                                            )
                                        }
                                        className='w-full px-3 py-1.5 text-sm border rounded-md bg-background'
                                    >
                                        <option value=''>
                                            All {column.header}
                                        </option>
                                        {column.filterOptions.map((option) => (
                                            <option
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type='text'
                                        placeholder={`Filter ${column.header.toLowerCase()}...`}
                                        value={
                                            filters[column.key as string] || ""
                                        }
                                        onChange={(e) =>
                                            handleFilterChange(
                                                column.key as string,
                                                e.target.value,
                                            )
                                        }
                                        className='w-full px-3 py-1.5 text-sm border rounded-md bg-background'
                                    />
                                )}
                            </div>
                        ))}
                </div>
            )}

            {/* Table */}
            <div className='overflow-x-auto rounded-md border'>
                <table className='w-full text-sm'>
                    <thead className='border-b border-border bg-muted/50'>
                        <tr>
                            {enableSelection && (
                                <th className='px-4 py-3 w-10'>
                                    <Checkbox
                                        checked={
                                            processedData.length > 0 &&
                                            processedData.every((item) =>
                                                selectedIds.includes(
                                                    getRowId(item),
                                                ),
                                            )
                                        }
                                        onCheckedChange={handleSelectAll}
                                    />
                                </th>
                            )}
                            {visibleColumns.map((column, index) => (
                                <th
                                    key={index}
                                    className={cn(
                                        "px-4 py-3 text-left font-medium text-muted-foreground",
                                        enableSorting &&
                                            column.sortable !== false &&
                                            "cursor-pointer hover:text-foreground group",
                                    )}
                                    onClick={() =>
                                        enableSorting &&
                                        column.sortable !== false &&
                                        handleSort(column.key as string)
                                    }
                                >
                                    <div className='flex items-center'>
                                        {column.header}
                                        {renderSortIcon(column)}
                                    </div>
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
                        {Math.min(
                            (currentPage + 1) * pageSize,
                            processedData.length,
                        )}{" "}
                        of {processedData.length} entries
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
