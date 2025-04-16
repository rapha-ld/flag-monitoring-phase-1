
import React, { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';
import CustomTooltip from '../chart/CustomTooltip';
import { format } from 'date-fns';
import { determineEventName } from '@/utils/eventUtils';
import { Progress } from '@/components/ui/progress';
import { getBarSize } from '@/utils/chartUtils';
import { formatTimestamp } from '../chart/charts/chartUtils';
import { ChartAnnotation } from '@/data/annotationData';

interface MiniChartProps { 
  title: string; 
  version: string; 
  data: any[];
  showTrue: boolean;
  showFalse: boolean;
  trueColor: string;
  falseColor: string;
  factor: number;
  maxYValue?: number; // Optional prop for shared y-axis scaling
  selectedTimestamp?: Date | null;
  selectedTimestamps?: Date[] | null;
  hoveredTimestamp?: string | null;
  onHoverTimestamp?: (timestamp: string | null) => void;
  percentage?: number; // New prop for the percentage
  timeframe?: string; // Optional timeframe prop
  annotations?: ChartAnnotation[]; // Annotations data
}

const MiniChart: React.FC<MiniChartProps> = ({ 
  title, 
  version, 
  data, 
  showTrue,
  showFalse,
  trueColor,
  falseColor,
  factor,
  maxYValue,
  selectedTimestamp,
  selectedTimestamps,
  hoveredTimestamp,
  onHoverTimestamp,
  percentage = 0, // Default to 0 if not provided
  timeframe,
  annotations = []
}) => {
  useEffect(() => {
    if (hoveredTimestamp) {
      console.log(`MiniChart ${title} has hoveredTimestamp: ${hoveredTimestamp}`);
    }
  }, [hoveredTimestamp, title]);

  const localMaxValue = Math.max(...data.map(d => 
    Math.max(
      (showTrue && showFalse) ? (d.valueTrue || 0) + (d.valueFalse || 0) : 
      showTrue ? (d.valueTrue || 0) : 
      showFalse ? (d.valueFalse || 0) : d.value || 0
    )
  ));
  
  const yAxisMax = maxYValue !== undefined ? maxYValue : localMaxValue * 1.1;
  
  const formatTimeLabel = (label: string) => {
    return formatTimestamp(label);
  };
  
  const tooltipLabelFormatter = (label: string) => {
    return formatTimestamp(label);
  };
  
  const tooltipValueFormatter = (value: number) => `${value.toFixed(1)}`;
  
  const findSelectedDataPoints = () => {
    if ((!selectedTimestamp && !selectedTimestamps) || data.length === 0) return null;
    
    const timestamps = selectedTimestamps || (selectedTimestamp ? [selectedTimestamp] : []);
    
    if (timestamps.length === 0) return null;
    
    const dataPoints = data.map((point, index) => {
      const pointDate = point.date ? new Date(point.date) : 
                       (point.name && !isNaN(new Date(point.name).getTime()) ? 
                       new Date(point.name) : null);
      
      return {
        ...point,
        index,
        timestamp: pointDate ? pointDate.getTime() : null
      };
    }).filter(point => point.timestamp !== null);
    
    if (dataPoints.length === 0) return null;
    
    return timestamps.map(selectedTime => {
      const selectedTimeMs = selectedTime.getTime();
      let closestPoint = dataPoints[0];
      let minDiff = Math.abs(dataPoints[0].timestamp! - selectedTimeMs);
      
      for (let i = 1; i < dataPoints.length; i++) {
        const diff = Math.abs(dataPoints[i].timestamp! - selectedTimeMs);
        if (diff < minDiff) {
          minDiff = diff;
          closestPoint = dataPoints[i];
        }
      }
      
      return {
        ...closestPoint,
        exactTime: selectedTime
      };
    }).sort((a, b) => a.timestamp! - b.timestamp!);
  };
  
  // Process annotations to match data points
  const processedAnnotations = annotations ? annotations.map(annotation => {
    const annotationDate = new Date(annotation.timestamp);
    const matchingDataPoint = data.find(point => {
      const pointDate = new Date(point.date || point.name);
      return pointDate.getTime() === annotationDate.getTime() || 
             (Math.abs(pointDate.getTime() - annotationDate.getTime()) < 3600000); // Within an hour
    });
    
    return {
      ...annotation,
      dataPointName: matchingDataPoint?.name || null
    };
  }).filter(a => a.dataPointName !== null) : [];
  
  const selectedPoints = findSelectedDataPoints();
  const hasSelectedPoints = selectedPoints && selectedPoints.length > 0;
  const textGray = '#545A62';

  const handleMouseMove = (e: any) => {
    if (e && e.activeLabel && onHoverTimestamp) {
      console.log(`MiniChart ${title} hover: ${e.activeLabel}`);
      onHoverTimestamp(e.activeLabel);
    }
  };

  const handleMouseLeave = () => {
    if (onHoverTimestamp) {
      console.log(`MiniChart ${title} hover cleared`);
      onHoverTimestamp(null);
    }
  };

  // Find active annotation based on hoveredTimestamp
  const activeAnnotation = hoveredTimestamp 
    ? processedAnnotations.find(a => a.dataPointName === hoveredTimestamp)
    : null;

  const formattedPercentage = `${percentage.toFixed(1)}%`;
  
  const axisLabelColor = '#9CA3AF';

  const calculatedBarSize = getBarSize(data.length) * 0.6;
  const barSize = Math.max(4, calculatedBarSize);
  const barGap = Math.max(1, Math.min(2, Math.floor(barSize * 0.1)));

  return (
    <Card className="p-3 h-[116px] transition-all duration-300 hover:shadow-md chart-container">
      <div className="flex justify-between items-start mb-1">
        <div className="text-xs font-semibold truncate">{title}</div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground">{formattedPercentage}</span>
          <div className="w-[40px]">
            <Progress value={percentage} className="h-1.5" color="#C8C8C9" />
          </div>
        </div>
      </div>
      <div className="text-xs text-muted-foreground mb-2">{version}</div>
      <ResponsiveContainer width="100%" height={70} className="mb-[-8px]">
        <BarChart 
          data={data} 
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          barSize={barSize}
          barGap={barGap}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis 
            dataKey="name" 
            tick={false} 
            axisLine={false} 
            tickLine={false} 
          />
          <YAxis 
            domain={[0, yAxisMax]} 
            tick={false} 
            axisLine={false} 
            tickLine={false} 
            width={0}
          />
          <Tooltip 
            content={
              <CustomTooltip 
                tooltipValueFormatter={tooltipValueFormatter}
                tooltipLabelFormatter={tooltipLabelFormatter}
                showTrue={showTrue}
                showFalse={showFalse}
                chartType="stacked"
                metricType="evaluations"
                title={title}
                activeAnnotation={activeAnnotation}
              />
            }
            isAnimationActive={false}
            position={{ y: -75 }}  // Move the tooltip 75px higher
          />
          
          {hoveredTimestamp && (
            <ReferenceLine
              x={hoveredTimestamp}
              stroke="#6E6F96"
              strokeWidth={1}
              strokeDasharray="3 3"
              isFront={true}
              zIndex={9999}
            />
          )}

          {/* Annotation vertical lines */}
          {processedAnnotations.map((annotation, index) => (
            <ReferenceLine
              key={`mini-annotation-line-${index}`}
              x={annotation.dataPointName}
              stroke={annotation.color || "#6366F1"}
              strokeWidth={1.5}
              strokeDasharray="3 3"
              isFront={true}
              zIndex={9990}
            />
          ))}
          
          {hasSelectedPoints && selectedPoints.map((point, index) => {
            const eventName = determineEventName(point.exactTime);
            const formattedDate = format(point.exactTime, "MMM d");
            
            return (
              <ReferenceLine
                key={`selected-time-mini-${index}`}
                x={point.name}
                stroke={textGray}
                strokeWidth={1.5}
                ifOverflow="extendDomain"
              />
            );
          })}
          
          {showTrue && (
            <Bar 
              dataKey="valueTrue" 
              name="True"
              stackId="a"
              fill={trueColor} 
              radius={[1, 1, 0, 0]} 
              isAnimationActive={false}
            />
          )}
          
          {showFalse && (
            <Bar 
              dataKey="valueFalse" 
              name="False"
              stackId="a"
              fill={falseColor} 
              radius={showTrue ? [0, 0, 0, 0] : [1, 1, 0, 0]} 
              isAnimationActive={false}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default MiniChart;
