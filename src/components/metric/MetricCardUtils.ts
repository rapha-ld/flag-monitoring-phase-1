
import { calculateDisplayValue } from '@/utils/metricValueCalculator';
import { DataPoint } from '../BarChart';

/**
 * Determines if a variant filter should be shown based on metric type
 */
export function shouldShowVariantFilters(
  metricType?: 'evaluations' | 'conversion' | 'errorRate',
  onToggleTrue?: () => void,
  onToggleFalse?: () => void
): boolean {
  return metricType === 'evaluations' && !!onToggleTrue && !!onToggleFalse;
}

/**
 * Determines if average should be shown based on filter and metric type
 */
export function shouldShowAverage(
  showTrue?: boolean, 
  showFalse?: boolean, 
  metricType?: 'evaluations' | 'conversion' | 'errorRate'
): boolean {
  return !!showTrue && !!showFalse && (metricType === 'conversion' || metricType === 'errorRate');
}

/**
 * Calculates the display value based on selected filters and data
 */
export function getDisplayValue(
  value: string | number,
  chartData?: DataPoint[],
  showTrue?: boolean,
  showFalse?: boolean,
  metricType?: 'evaluations' | 'conversion' | 'errorRate'
): string | number {
  return calculateDisplayValue(value, chartData, showTrue, showFalse, metricType);
}
