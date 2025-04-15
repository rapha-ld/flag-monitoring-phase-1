import React, { useState, useEffect } from 'react';
import { DataPoint, VersionChange } from '@/components/BarChart';
import { cn } from '@/lib/utils';
import EvaluationsCard from './cards/EvaluationsCard';
import ImpactCard from './cards/ImpactCard';
import TimeframeSelector from '@/components/header/TimeframeSelector';
import { Share } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface DashboardMetricsProps {
  selectedMetrics: string[];
  currentMetrics: {
    evaluations: { value: number, change: { value: number, trend: 'up' | 'down' } },
    conversion: { value: number, change: { value: number, trend: 'up' | 'down' } },
    errorRate: { value: number, change: { value: number, trend: 'up' | 'down' } }
  };
  filteredEvaluationData: DataPoint[];
  filteredConversionData: DataPoint[];
  filteredErrorRateData: DataPoint[];
  evaluationVersionChanges: VersionChange[];
  conversionVersionChanges: VersionChange[];
  errorRateVersionChanges: VersionChange[];
  showTrue: boolean;
  showFalse: boolean;
  timeframe: string;
  selectedTimestamp?: Date | null;
  selectedTimestamps?: Date[] | null;
  onHoverTimestamp?: (timestamp: string | null) => void;
  onToggleTrue?: () => void;
  onToggleFalse?: () => void;
  hoveredTimestamp?: string | null;
  onTimeframeChange?: (timeframe: string) => void;
}

const DashboardMetrics: React.FC<DashboardMetricsProps> = ({
  selectedMetrics,
  currentMetrics,
  filteredEvaluationData,
  filteredConversionData,
  filteredErrorRateData,
  evaluationVersionChanges,
  conversionVersionChanges,
  errorRateVersionChanges,
  showTrue,
  showFalse,
  timeframe,
  selectedTimestamp,
  selectedTimestamps,
  onHoverTimestamp,
  onToggleTrue,
  onToggleFalse,
  hoveredTimestamp,
  onTimeframeChange
}) => {
  const [isBreakdownEnabled, setIsBreakdownEnabled] = useState(false);
  
  const handleBreakdownToggle = (enabled: boolean) => {
    setIsBreakdownEnabled(enabled);
  };
  
  useEffect(() => {
    console.log(`DashboardMetrics detected hoveredTimestamp: ${hoveredTimestamp}`);
  }, [hoveredTimestamp]);
  
  const handleHoverEvent = (timestamp: string | null) => {
    if (onHoverTimestamp) {
      console.log(`DashboardMetrics forwarding hover: ${timestamp}`);
      onHoverTimestamp(timestamp);
    }
  };
  
  const handleExportPDF = () => {
    toast.success('Exporting chart as PDF');
  };

  const handleExportJPEG = () => {
    toast.success('Exporting chart as JPEG');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => toast.success('Link copied to clipboard'))
      .catch(() => toast.error('Failed to copy link'));
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-4">
          <h2 className="text-base font-medium text-gray-800">Flag-specific metrics</h2>
          <TimeframeSelector 
            timeframe={timeframe} 
            onTimeframeChange={onTimeframeChange} 
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <Share className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white">
            <DropdownMenuItem onClick={handleExportPDF} className="cursor-pointer">
              <span>Export as PDF</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportJPEG} className="cursor-pointer">
              <span>Export as JPEG</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
              <span>Copy Link</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className={cn(
        "grid gap-4",
        isBreakdownEnabled
          ? "grid-cols-3"
          : "grid-cols-2"
      )}>
        {selectedMetrics.includes('evaluations') && (
          <EvaluationsCard
            value={currentMetrics.evaluations.value}
            change={currentMetrics.evaluations.change}
            chartData={filteredEvaluationData}
            versionChanges={evaluationVersionChanges}
            showTrue={showTrue}
            showFalse={showFalse}
            timeframe={timeframe}
            selectedTimestamp={selectedTimestamp}
            selectedTimestamps={selectedTimestamps}
            isBreakdownEnabled={isBreakdownEnabled}
            onBreakdownToggle={handleBreakdownToggle}
            hoveredTimestamp={hoveredTimestamp}
            onHoverTimestamp={handleHoverEvent}
            onToggleTrue={onToggleTrue}
            onToggleFalse={onToggleFalse}
          />
        )}
        
        <ImpactCard
          chartData={filteredConversionData}
          isBreakdownEnabled={isBreakdownEnabled}
          selectedTimestamp={selectedTimestamp}
          selectedTimestamps={selectedTimestamps}
          timeframe={timeframe}
          hoveredTimestamp={hoveredTimestamp}
          onHoverTimestamp={handleHoverEvent}
        />
      </div>
    </div>
  );
};

export default DashboardMetrics;
