import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/app-store";
import { formatDistanceToNow } from "@/utils/formatting";
import {
    CheckCircle,
    AlertCircle,
    RefreshCw,
    Database,
    Bell,
    Trash2,
    Activity,
} from "lucide-react";

const getActivityIcon = (type: string) => {
    switch (type) {
        case "pipeline_retry":
        case "pipeline_run":
            return <RefreshCw className='h-4 w-4' />;
        case "incident_resolved":
            return <CheckCircle className='h-4 w-4' />;
        case "incident_created":
            return <AlertCircle className='h-4 w-4' />;
        case "dataset_updated":
            return <Database className='h-4 w-4' />;
        case "alert_triggered":
            return <Bell className='h-4 w-4' />;
        default:
            return <Activity className='h-4 w-4' />;
    }
};

const getActivityColor = (severity?: string) => {
    switch (severity) {
        case "success":
            return "bg-green-500/10 text-green-600 border-green-500/20";
        case "error":
            return "bg-red-500/10 text-red-600 border-red-500/20";
        case "warning":
            return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
        default:
            return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    }
};

export const RecentActivity = () => {
    const { activities, clearActivities } = useAppStore();

    return (
        <Card>
            <CardHeader className='flex flex-row items-center justify-between'>
                <CardTitle className='flex items-center gap-2'>
                    <Activity className='h-5 w-5' />
                    Recent Activity
                </CardTitle>
                {activities.length > 0 && (
                    <Button
                        variant='ghost'
                        size='sm'
                        onClick={clearActivities}
                        className='gap-2'
                    >
                        <Trash2 className='h-4 w-4' />
                        Clear
                    </Button>
                )}
            </CardHeader>
            <CardContent>
                <div className='space-y-3 max-h-100 overflow-y-auto'>
                    {activities.length === 0 ? (
                        <div className='text-center py-8 text-muted-foreground'>
                            <Activity className='h-8 w-8 mx-auto mb-2 opacity-50' />
                            <p className='text-sm'>No recent activity</p>
                            <p className='text-xs mt-1'>
                                Activities will appear here as you interact with
                                the dashboard
                            </p>
                        </div>
                    ) : (
                        activities.slice(0, 20).map((activity) => (
                            <div
                                key={activity.id}
                                className={`flex items-start gap-3 p-3 rounded-lg border ${getActivityColor(activity.severity)}`}
                            >
                                <div className='mt-0.5'>
                                    {getActivityIcon(activity.type)}
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <p className='font-medium text-sm'>
                                        {activity.title}
                                    </p>
                                    <p className='text-xs opacity-80 mt-0.5'>
                                        {activity.description}
                                    </p>
                                    <p className='text-xs opacity-60 mt-1'>
                                        {formatDistanceToNow(
                                            activity.timestamp,
                                        )}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
