import { cn } from "@/utils/formatting";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted",
        className
      )}
    />
  );
}

// Card Skeleton
export function CardSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-card p-6 space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-lg" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="h-3 w-full" />
    </div>
  );
}

// KPI Card Skeleton
export function KpiCardSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-card p-6 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-3 w-32" />
    </div>
  );
}

// Table Skeleton
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-md border space-y-4 p-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-24" />
      </div>
      <div className="space-y-2">
        {/* Header */}
        <div className="flex gap-4 pb-2 border-b">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-32 flex-1" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
        {/* Rows */}
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-4 py-3">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-32 flex-1" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Chart Skeleton
export function ChartSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-8 w-24" />
      </div>
      <Skeleton className="h-[200px] w-full rounded-lg" />
      <div className="flex justify-center gap-4">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}

// Pipeline Card Skeleton
export function PipelineCardSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="flex gap-4">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
      <Skeleton className="h-2 w-full rounded-full" />
    </div>
  );
}

// Activity Item Skeleton
export function ActivityItemSkeleton() {
  return (
    <div className="flex items-start gap-3 py-3">
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}

// Dashboard Skeleton (Full page)
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCardSkeleton />
        <KpiCardSkeleton />
        <KpiCardSkeleton />
        <KpiCardSkeleton />
      </div>
      
      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
      
      {/* Table */}
      <TableSkeleton rows={5} />
    </div>
  );
}

// Search Results Skeleton
export function SearchResultsSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-64" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-lg border border-border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-5 w-20" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ))}
    </div>
  );
}
