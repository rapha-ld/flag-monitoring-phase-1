import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TelemetryBarChart from './charts/TelemetryBarChart';
import TelemetryLineChart from './charts/TelemetryLineChart';
import TelemetryAreaChart from './charts/TelemetryAreaChart';
import { useTelemetryData } from '@/hooks/useTelemetryData';
import { MoreVertical, FileDown, Download, Link as LinkIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface TelemetryChartProps {
  title: string;
  timeframe?: string;
  environment?: string;
  hoveredTimestamp?: string | null;
  onHoverTimestamp?: (timestamp: string | null) => void;
  height?: number;
}

const TelemetryChart: React.FC<TelemetryChartProps> = ({ 
  title, 
  timeframe = "7d",
  environment = "production",
  hoveredTimestamp,
  onHoverTimestamp,
  height = 228
}) => {
  const { data, calculateTotal } = useTelemetryData(title, timeframe, environment);
  
  useEffect(() => {
    if (hoveredTimestamp) {
      console.log(`TelemetryChart ${title} has hoveredTimestamp: ${hoveredTimestamp}`);
    }
  }, [hoveredTimestamp, title]);
  
  const handleHoverTimestamp = (timestamp: string | null) => {
    if (onHoverTimestamp) {
      console.log(`TelemetryChart ${title} forwarding hover: ${timestamp}`);
      onHoverTimestamp(timestamp);
    }
  };
  
  const displayTitle = title === "Error Rate" ? "Errors" : title;
  const useBarChart = title === "Error Rate" || title === "Errors";
  
  const chartColor = 
    title === "Error Rate" ? "#DB2251" : 
    title === "Largest Contentful Paint" ? "#8E9196" : 
    "#7861C6";

  const handleExportPDF = () => {
    toast.success(`Exporting ${displayTitle} chart as PDF`);
  };

  const handleExportJPEG = () => {
    toast.success(`Exporting ${displayTitle} chart as JPEG`);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => toast.success('Link copied to clipboard'))
      .catch(() => toast.error('Failed to copy link'));
  };

  return (
    <Card className="flex-1 bg-white">
      <CardHeader className="p-4 pb-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm font-medium">{displayTitle}</CardTitle>
            {(title === "Error Rate" || title === "Errors" || title === "Largest Contentful Paint") && (
              <DropdownMenu>
                <DropdownMenuTrigger className="h-8 w-8 p-0 flex items-center justify-center rounded-md hover:bg-slate-100">
                  <MoreVertical className="h-4 w-4 text-slate-500" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white">
                  <DropdownMenuItem onClick={handleExportPDF} className="cursor-pointer">
                    <FileDown className="mr-2 h-4 w-4" />
                    <span>Export as PDF</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportJPEG} className="cursor-pointer">
                    <Download className="mr-2 h-4 w-4" />
                    <span>Export as JPEG</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
                    <LinkIcon className="mr-2 h-4 w-4" />
                    <span>Copy Link</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {title === "Error Rate" ? (
              <span className="text-xs text-muted-foreground">{`Total: ${calculateTotal}`}</span>
            ) : (
              <span className="text-xs text-muted-foreground">{`Avg. ${calculateTotal}`}</span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div style={{ height: `${height}px` }}>
          {useBarChart ? (
            <TelemetryBarChart 
              data={data}
              title={title}
              chartColor={chartColor}
              hoveredTimestamp={hoveredTimestamp}
              onHoverTimestamp={handleHoverTimestamp}
              timeframe={timeframe}
              height={height}
            />
          ) : title === "Largest Contentful Paint" ? (
            <TelemetryLineChart 
              data={data}
              title={title}
              chartColor={chartColor}
              hoveredTimestamp={hoveredTimestamp}
              onHoverTimestamp={handleHoverTimestamp}
              timeframe={timeframe}
              height={height}
            />
          ) : (
            <TelemetryAreaChart 
              data={data}
              title={title}
              chartColor={chartColor}
              hoveredTimestamp={hoveredTimestamp}
              onHoverTimestamp={handleHoverTimestamp}
              timeframe={timeframe}
              height={height}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TelemetryChart;
