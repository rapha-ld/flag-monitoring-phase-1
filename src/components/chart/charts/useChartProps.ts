
import { useCallback } from 'react';

export const useChartProps = (onHoverTimestamp?: (timestamp: string | null) => void) => {
  // Handle mouse move to detect hovered data points
  const handleMouseMove = useCallback((e: any) => {
    if (e && e.activeLabel && onHoverTimestamp) {
      onHoverTimestamp(e.activeLabel);
    }
  }, [onHoverTimestamp]);

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    if (onHoverTimestamp) {
      onHoverTimestamp(null);
    }
  }, [onHoverTimestamp]);
  
  // Tooltip formatting functions
  const tooltipLabelFormatter = (label: string) => label;
  
  const tooltipValueFormatter = (value: number) => {
    return `${value.toFixed(1)}`;
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
