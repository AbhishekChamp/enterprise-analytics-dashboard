import { cn } from '@/utils/formatting';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface TableColumn<T = any> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  key: any;
  header: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (value: any, item: T) => React.ReactNode;
}

interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  className?: string;
  onRowClick?: (item: T) => void;
}

export const Table = <T extends object>({
  data,
  columns,
  className,
  onRowClick
}: TableProps<T>) => {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full text-sm">
        <thead className="border-b border-border bg-muted/50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className="px-4 py-3 text-left font-medium text-muted-foreground"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.map((item, rowIndex) => (
            <tr
              key={rowIndex}
              className={cn(
                "bg-card hover:bg-muted/50 transition-colors",
                onRowClick && "cursor-pointer"
              )}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((column, colIndex) => (
                <td key={colIndex} className="px-4 py-3">
                  {column.render
                    ? column.render(item[column.key as keyof T], item)
                    : String(item[column.key as keyof T] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Export enhanced table
export { EnhancedTable } from './enhanced-table';
