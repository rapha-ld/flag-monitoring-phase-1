
import React, { useState } from 'react';
import { ComposedChart, ResponsiveContainer, Tooltip } from 'recharts';
import { useBarChartState } from './chart/useBarChartState';
import BarChartAxes from './chart/BarChartAxes';
import BarChartSeries from './chart/BarChartSeries';
import BarChartReferenceLines from './chart/BarChartReferenceLines';
import VersionMarkers from './chart/VersionMarkers';
import CustomTooltip from './chart/CustomTooltip';
import { referenceLineMarkers, thresholdLines } from '@/utils/chartReferenceLines';
import type { DataPoint } from './chart/useBarChartState';
import type { VersionChange } from './chart/VersionMarkers';

// Re-export types with the correct syntax
export type { DataPoint, VersionChange };

interface BarChartProps {
  data: DataPoint[];
  height?: number;
  barColor?: string;
  valueFormatter?: (value: number) => string;
  tooltipValueFormatter?: (value: number) => string;
  tooltipLabelFormatter?: (label: string) => string;
  versionChanges?: VersionChange[];
  showTrue?: boolean;
  showFalse?: boolean;
  chartType?: 'stacked' | 'mixed';
  metricType?: 'evaluations' | 'conversion' | 'errorRate';
  selectedTimestamp?: Date | null;
  selectedTimestamps?: Date[] | null;
  hoveredTimestamp?: string | null;
  onHoverTimestamp?: (timestamp: string | null) => void;
}

const BarChart = ({
  data,
  height = 350,
  barColor = '#6E6F96',
  valueFormatter = (value) => `${value}`,
  tooltipValueFormatter = (value) => `${value}`,
  tooltipLabelFormatter = (label) => label,
  versionChanges = [],
  showTrue = true,
  showFalse = false,
  chartType = 'stacked',
  metricType,
  selectedTimestamp,
  selectedTimestamps,
  hoveredTimestamp,
  onHoverTimestamp
}: BarChartProps) => {
  // Use the extracted hook for managing chart state
  const {
    interval,
    barSize,
    barGap,
    barCategoryGap,
    showAverage,
    yAxisDomain,
    trueColor,
    falseColor,
    textGray,
    useLineChart,
    selectedPoints,
    hasSelectedPoints,
    firstPoint,
    lastPoint,
    showReferenceArea,
    getPointOpacity
  } = useBarChartState(
    data,
    showTrue,
    showFalse,
    metricType,
    selectedTimestamp,
    selectedTimestamps
  );
  
  const thresholdLine = metricType ? thresholdLines.find(t => t.metricType === metricType) : undefined;

  const handleMouseMove = (e: any) => {
    if (e && e.activeLabel && onHoverTimestamp) {
      onHoverTimestamp(e.activeLabel);
    }
  };

  const handleMouseLeave = () => {
    if (onHoverTimestamp) {
      onHoverTimestamp(null);
    }
  };

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 10, left: 0, bottom: 0 }}
          barGap={barGap}
          barCategoryGap={barCategoryGap}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Chart Axes */}
          <BarChartAxes 
            data={data} 
            interval={interval} 
            valueFormatter={valueFormatter} 
            yAxisDomain={yAxisDomain} 
          />
          
          {/* Tooltip */}
          <Tooltip 
            content={
              <CustomTooltip 
                tooltipValueFormatter={tooltipValueFormatter}
                tooltipLabelFormatter={tooltipLabelFormatter}
                showTrue={showTrue}
                showFalse={showFalse}
                chartType={chartType}
                metricType={metricType}
                showAverage={showAverage}
              />
            }
            trigger="hover"
            isAnimationActive={false}
          />
          
          {/* Reference Lines and Areas */}
          <BarChartReferenceLines
            referenceLineMarkers={referenceLineMarkers}
            thresholdLine={thresholdLine}
            hoveredTimestamp={hoveredTimestamp}
            selectedPoints={selectedPoints}
            firstPoint={firstPoint}
            lastPoint={lastPoint}
            showReferenceArea={showReferenceArea}
            metricType={metricType}
            textGray={textGray}
          />
          
          {/* Chart Series (Bars and Lines) */}
          <BarChartSeries
            data={data}
            metricType={metricType}
            showTrue={showTrue}
            showFalse={showFalse}
            barSize={barSize}
            trueColor={trueColor}
            falseColor={falseColor}
            barColor={barColor}
            getPointOpacity={getPointOpacity}
          />
          
          {/* Version Markers */}
          <VersionMarkers versionChanges={versionChanges} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
