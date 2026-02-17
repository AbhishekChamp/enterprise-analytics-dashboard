import { memo, useMemo, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  Brush
} from 'recharts';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

interface LineChartProps {
  data: Array<{ timestamp: string; value: number; name?: string }>;
  yKey?: string;
  color?: string;
  showArea?: boolean;
  height?: number;
  enableZoom?: boolean;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export const LineChartComponent = memo(({
  data,
  yKey = 'value',
  color = '#3b82f6',
  showArea = false,
  height = 300,
  enableZoom = true
}: LineChartProps) => {
  const [zoomDomain, setZoomDomain] = useState<{ startIndex?: number; endIndex?: number } | null>(null);

  const formattedData = useMemo(() => 
    data.map(item => ({
      ...item,
      displayTime: format(new Date(item.timestamp), 'HH:mm')
    })),
    [data]
  );

  const resetZoom = () => setZoomDomain(null);

  return (
    <div className="space-y-2">
      {enableZoom && zoomDomain && (
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={resetZoom} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset Zoom
          </Button>
        </div>
      )}
      <ResponsiveContainer width="100%" height={height}>
        {showArea ? (
          <AreaChart data={formattedData}>
            <defs>
              <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="displayTime" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              domain={['auto', 'auto']}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px'
              }}
            />
            <Area
              type="monotone"
              dataKey={yKey}
              stroke={color}
              fill={`url(#gradient-${color})`}
            />
            {enableZoom && (
              <Brush 
                dataKey="displayTime" 
                height={30} 
                stroke={color}
                onChange={(e) => {
                  if (e) {
                    setZoomDomain({ startIndex: e.startIndex, endIndex: e.endIndex });
                  }
                }}
              />
            )}
          </AreaChart>
        ) : (
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="displayTime" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              domain={['auto', 'auto']}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px'
              }}
            />
            <Line
              type="monotone"
              dataKey={yKey}
              stroke={color}
              strokeWidth={2}
              dot={false}
            />
            {enableZoom && (
              <Brush 
                dataKey="displayTime" 
                height={30} 
                stroke={color}
                onChange={(e) => {
                  if (e) {
                    setZoomDomain({ startIndex: e.startIndex, endIndex: e.endIndex });
                  }
                }}
              />
            )}
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
});

LineChartComponent.displayName = 'LineChartComponent';

interface BarChartProps {
  data: Array<{ name: string; value: number; [key: string]: string | number }>;
  yKey?: string;
  height?: number;
  enableZoom?: boolean;
}

export const BarChartComponent = memo(({
  data,
  yKey = 'value',
  height = 300,
  enableZoom = false
}: BarChartProps) => {
  const [zoomDomain, setZoomDomain] = useState<{ startIndex?: number; endIndex?: number } | null>(null);

  const resetZoom = () => setZoomDomain(null);

  return (
    <div className="space-y-2">
      {enableZoom && zoomDomain && (
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={resetZoom} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="name" 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            domain={['auto', 'auto']}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '6px'
            }}
          />
          <Bar dataKey={yKey} fill="#3b82f6" radius={[4, 4, 0, 0]} />
          {enableZoom && data.length > 10 && (
            <Brush 
              dataKey="name" 
              height={30} 
              stroke="#3b82f6"
              onChange={(e) => {
                if (e) {
                  setZoomDomain({ startIndex: e.startIndex, endIndex: e.endIndex });
                }
              }}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});

BarChartComponent.displayName = 'BarChartComponent';

interface PieChartProps {
  data: Array<{ name: string; value: number }>;
  height?: number;
}

export const PieChartComponent = memo(({
  data,
  height = 300
}: PieChartProps) => {
  const cells = useMemo(() => 
    data.map((_entry, index) => (
      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
    )),
    [data]
  );

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="40%"
          innerRadius={45}
          outerRadius={70}
          paddingAngle={2}
          dataKey="value"
        >
          {cells}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px',
            color: 'hsl(var(--foreground))'
          }}
          itemStyle={{ color: 'hsl(var(--foreground))' }}
          formatter={(value, name, props) => {
            const displayName = (props?.payload as { name?: string })?.name || name;
            return [`${value || 0}`, displayName];
          }}
        />
        <Legend 
          verticalAlign="bottom" 
          height={60}
          wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
          iconSize={10}
          iconType="circle"
        />
      </PieChart>
    </ResponsiveContainer>
  );
});

PieChartComponent.displayName = 'PieChartComponent';

interface MultiLineChartProps {
  data: Array<{ timestamp: string; [key: string]: number | string }>;
  lines: Array<{ key: string; name: string; color: string }>;
  height?: number;
  enableZoom?: boolean;
}

export const MultiLineChartComponent = memo(({
  data,
  lines,
  height = 300,
  enableZoom = true
}: MultiLineChartProps) => {
  const [zoomDomain, setZoomDomain] = useState<{ startIndex?: number; endIndex?: number } | null>(null);

  const formattedData = useMemo(() => 
    data.map(item => ({
      ...item,
      displayTime: format(new Date(item.timestamp), 'HH:mm')
    })),
    [data]
  );

  const resetZoom = () => setZoomDomain(null);

  return (
    <div className="space-y-2">
      {enableZoom && zoomDomain && (
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={resetZoom} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset Zoom
          </Button>
        </div>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="displayTime" 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            domain={['auto', 'auto']}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '6px'
            }}
          />
          <Legend />
          {lines.map(line => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              name={line.name}
              stroke={line.color}
              strokeWidth={2}
              dot={false}
            />
          ))}
          {enableZoom && (
            <Brush 
              dataKey="displayTime" 
              height={30} 
              stroke="#3b82f6"
              onChange={(e) => {
                if (e) {
                  setZoomDomain({ startIndex: e.startIndex, endIndex: e.endIndex });
                }
              }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
});

MultiLineChartComponent.displayName = 'MultiLineChartComponent';
