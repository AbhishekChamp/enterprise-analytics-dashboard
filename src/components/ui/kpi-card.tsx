import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/utils/formatting";
import { TrendingUp, TrendingDown, Info } from "lucide-react";

interface KpiCardProps {
    title: string;
    value: string | number;
    description?: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    icon?: React.ReactNode;
    className?: string;
    tooltip?: string;
}

export const KpiCard = ({
    title,
    value,
    description,
    trend,
    icon,
    className,
    tooltip,
}: KpiCardProps) => {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <Card className={cn("relative", className)}>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <div className='flex items-center gap-2'>
                    <CardTitle className='text-sm font-medium'>
                        {title}
                    </CardTitle>
                    {tooltip && (
                        <div
                            className='relative'
                            onMouseEnter={() => setShowTooltip(true)}
                            onMouseLeave={() => setShowTooltip(false)}
                        >
                            <Info className='h-4 w-4 text-muted-foreground cursor-help' />
                            {showTooltip && (
                                <div className='absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-popover text-popover-foreground text-xs rounded-lg shadow-lg border z-50 max-w-50 wrap-break-words whitespace-normal'>
                                    {tooltip}
                                    <div className='absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-popover' />
                                </div>
                            )}
                        </div>
                    )}
                </div>
                {icon && (
                    <div className='h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center'>
                        {icon}
                    </div>
                )}
            </CardHeader>
            <CardContent>
                <div className='text-2xl font-bold'>{value}</div>
                {(description || trend) && (
                    <div className='flex items-center gap-2 mt-1'>
                        {trend && (
                            <div
                                className={cn(
                                    "flex items-center text-xs",
                                    trend.isPositive
                                        ? "text-green-600"
                                        : "text-red-600",
                                )}
                            >
                                {trend.isPositive ? (
                                    <TrendingUp className='h-3 w-3 mr-1' />
                                ) : (
                                    <TrendingDown className='h-3 w-3 mr-1' />
                                )}
                                {Math.abs(trend.value)}%
                            </div>
                        )}
                        {description && (
                            <p className='text-xs text-muted-foreground'>
                                {description}
                            </p>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

interface KpiGridProps {
    children: React.ReactNode;
}

export const KpiGrid = ({ children }: KpiGridProps) => {
    return (
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
            {children}
        </div>
    );
};
