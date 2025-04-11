
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import MetricCardHeader from './MetricCardHeader';
import MetricCardContent from './MetricCardContent';
import MetricCardControls from './MetricCardControls';

interface MetricCardProps {
  title: string;
  description?: string;
  value?: string | number;
  trend?: string;
  trendValue?: string;
  chartData?: any[];
  versionChanges?: any[];
  barColor?: string;
  valueFormatter?: (value: number) => string;
  tooltipValueFormatter?: (value: number) => string;
  tooltipLabelFormatter?: (label: string) => string;
  trendDirection?: 'up' | 'down' | 'neutral';
  chartType?: 'stacked' | 'mixed';
  metricType?: 'evaluations' | 'conversion' | 'errorRate';
  selectedTimestamp?: Date | null;
  selectedTimestamps?: Date[] | null;
  hoveredTimestamp?: string | null;
  onHoverTimestamp?: (timestamp: string | null) => void;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  description,
  value,
  trend,
  trendValue,
  chartData,
  versionChanges,
  barColor,
  valueFormatter,
  tooltipValueFormatter,
  tooltipLabelFormatter,
  trendDirection = 'up',
  chartType,
  metricType,
  selectedTimestamp,
  selectedTimestamps,
  hoveredTimestamp,
  onHoverTimestamp
}) => {
  const [breakdownEnabled, setBreakdownEnabled] = useState(false);
  const [breakdownType, setBreakdownType] = useState<'application' | 'sdk'>('application');
  const [showTrue, setShowTrue] = useState(true);
  const [showFalse, setShowFalse] = useState(true);

  const toggleBreakdown = () => {
    setBreakdownEnabled(!breakdownEnabled);
  };

  const handleBreakdownTypeChange = (type: 'application' | 'sdk') => {
    setBreakdownType(type);
  };

  const toggleTrue = () => {
    setShowTrue(!showTrue);
  };

  const toggleFalse = () => {
    setShowFalse(!showFalse);
  };

  const handleHoverTimestamp = (timestamp: string | null) => {
    if (onHoverTimestamp) {
      onHoverTimestamp(timestamp);
    }
  };

  return (
    <Card className={cn(
      "bg-white overflow-hidden transition-all duration-300 ease-in-out",
      breakdownEnabled ? "h-[522px]" : "h-[350px]"
    )}>
      <CardHeader className="p-4 pb-0">
        <MetricCardHeader
          title={title}
          description={description || ""}
          value={value}
          trend={trend}
          trendValue={trendValue}
          trendDirection={trendDirection}
          breakdownEnabled={breakdownEnabled}
          toggleBreakdown={toggleBreakdown}
        />
      </CardHeader>
      
      <CardContent className="p-0 overflow-hidden">
        <MetricCardControls
          breakdownEnabled={breakdownEnabled}
          breakdownType={breakdownType}
          onBreakdownTypeChange={handleBreakdownTypeChange}
          showTrue={showTrue}
          showFalse={showFalse}
          toggleTrue={toggleTrue}
          toggleFalse={toggleFalse}
          metricType={metricType}
        />
        
        <div className="p-4 pt-0">
          <MetricCardContent
            breakdownEnabled={breakdownEnabled}
            breakdownType={breakdownType}
            chartData={chartData}
            versionChanges={versionChanges}
            barColor={barColor}
            valueFormatter={valueFormatter}
            tooltipValueFormatter={tooltipValueFormatter}
            tooltipLabelFormatter={tooltipLabelFormatter}
            showTrue={showTrue}
            showFalse={showFalse}
            chartType={chartType}
            metricType={metricType}
            selectedTimestamp={selectedTimestamp}
            selectedTimestamps={selectedTimestamps}
            hoveredTimestamp={hoveredTimestamp}
            onHoverTimestamp={handleHoverTimestamp}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
