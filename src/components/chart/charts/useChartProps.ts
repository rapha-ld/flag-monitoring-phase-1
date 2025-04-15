
import { useCallback } from 'react';

export const useChartProps = (onHoverTimestamp?: (timestamp: string | null) => void) => {
  // Handle mouse move to detect hovered data points
  const handleMouseMove = useCallback((e: any) => {
    if (e && e.activeLabel && onHoverTimestamp) {
      console.log(`useChartProps handleMouseMove: ${e.activeLabel}`);
      onHoverTimestamp(e.activeLabel);
    }
  }, [onHoverTimestamp]);

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    if (onHoverTimestamp) {
      console.log('useChartProps handleMouseLeave: null');
      onHoverTimestamp(null);
    }
  }, [onHoverTimestamp]);
  
  // Tooltip formatting functions
  const tooltipLabelFormatter = (label: string) => {
    // Handle different timestamp formats including 1D view (HH:00 format)
    if (/^\d{1,2}:\d{2}$/.test(label)) {
      const hour = parseInt(label.split(':')[0], 10);
      const period = hour >= 12 ? 'PM' : 'AM';
      const formattedHour = hour % 12 || 12;
      return `${formattedHour}${period}`;
    }
    
    return label;
  };
  
  const tooltipValueFormatter = (value: number, title?: string) => {
    // For INP, return value in milliseconds
    // For LCP, return value in seconds
    if (title === "Interaction to Next Paint") {
      return `${value.toFixed(1)}ms`;
    } else if (title === "Largest Contentful Paint") {
      return `${value.toFixed(1)}s`;
    }
    return `${value}`;
  };
  
  const axisLabelColor = '#9CA3AF';

  return {
    handleMouseMove,
    handleMouseLeave,
    tooltipLabelFormatter,
    tooltipValueFormatter,
    axisLabelColor
  };
};

