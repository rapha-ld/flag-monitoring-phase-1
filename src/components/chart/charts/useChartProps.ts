
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
  
  const tooltipValueFormatter = (value: number) => {
    return `${value.toFixed(1)}s`;
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
