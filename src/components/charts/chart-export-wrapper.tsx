import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { exportChartToPNG, exportChartToSVG } from '@/utils/pdf-export';
import { Image as ImageIcon, FileJson } from 'lucide-react';

interface ChartExportWrapperProps {
  children: React.ReactNode;
  filename?: string;
  showExportButtons?: boolean;
}

export function ChartExportWrapper({ 
  children, 
  filename = 'chart',
  showExportButtons = true 
}: ChartExportWrapperProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  const handleExportPNG = async () => {
    if (chartRef.current) {
      try {
        await exportChartToPNG(chartRef.current, filename);
      } catch (error) {
        console.error('Failed to export chart:', error);
        alert('Failed to export chart. Please try again.');
      }
    }
  };

  const handleExportSVG = () => {
    if (chartRef.current) {
      // Find the SVG element inside the chart container
      const svgElement = chartRef.current.querySelector('svg');
      if (svgElement) {
        try {
          exportChartToSVG(svgElement as SVGSVGElement, filename);
        } catch (error) {
          console.error('Failed to export SVG:', error);
          alert('Failed to export SVG. Please try again.');
        }
      } else {
        alert('No SVG chart found to export.');
      }
    }
  };

  if (!showExportButtons) {
    return <>{children}</>;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-end gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleExportPNG}
          className="gap-2"
        >
          <ImageIcon className="h-4 w-4" />
          Export PNG
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleExportSVG}
          className="gap-2"
        >
          <FileJson className="h-4 w-4" />
          Export SVG
        </Button>
      </div>
      <div ref={chartRef} className="w-full">
        {children}
      </div>
    </div>
  );
}
