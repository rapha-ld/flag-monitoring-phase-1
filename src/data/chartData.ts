
import { evaluationData, evaluationVersionChanges } from './evaluationData';
import { conversionData, conversionVersionChanges } from './conversionData';
import { errorRateData, errorRateVersionChanges } from './errorRateData';
import { getFilteredData, calculateMetrics } from '../utils/dataFilters';

// Initial metrics calculation (for default 14 day timeframe)
const filteredEvalData = getFilteredData(evaluationData, 14);
const filteredConvData = getFilteredData(conversionData, 14);
const filteredErrData = getFilteredData(errorRateData, 14);

// Export initialized metrics
export const currentMetrics = calculateMetrics(filteredEvalData, filteredConvData, filteredErrData, 14);

// Re-export everything
export {
  evaluationData,
  evaluationVersionChanges,
  conversionData,
  conversionVersionChanges,
  errorRateData,
  errorRateVersionChanges,
  getFilteredData,
  calculateMetrics
};
