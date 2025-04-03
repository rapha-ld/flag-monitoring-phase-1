
import React from 'react';
import { DataPoint } from '../BarChart';
import MiniChart from './MiniChart';
import { getApplicationBreakdowns, getSDKBreakdowns } from '@/utils/chartBreakdownUtils';

interface ChartBreakdownProps {
  type: 'application' | 'sdk';
  chartData?: DataPoint[];
  showTrue?: boolean;
  showFalse?: boolean;
  selectedTimestamp?: Date | null;
  selectedTimestamps?: Date[] | null;
}

const ChartBreakdown: React.FC<ChartBreakdownProps> = ({
  type,
  chartData,
  showTrue = true,
  showFalse = true,
  selectedTimestamp,
  selectedTimestamps
}) => {
  const trueColor = '#2BB7D2';
  const falseColor = '#FFD099';
  
  if (type === 'application') {
    const appBreakdowns = getApplicationBreakdowns(chartData);

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3">
        {appBreakdowns.map((app, index) => (
          <MiniChart 
            key={`app-${index}`} 
            title={app.title} 
            version={app.version} 
            data={app.data} 
            showTrue={showTrue}
            showFalse={showFalse}
            trueColor={trueColor}
            falseColor={falseColor}
            factor={app.factor}
          />
        ))}
      </div>
    );
  } else {
    const sdkBreakdowns = getSDKBreakdowns(chartData);

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3">
        {sdkBreakdowns.map((sdk, index) => (
          <MiniChart 
            key={`sdk-${index}`} 
            title={sdk.title} 
            version={sdk.version} 
            data={sdk.data} 
            showTrue={showTrue}
            showFalse={showFalse}
            trueColor={trueColor}
            falseColor={falseColor}
            factor={sdk.factor}
          />
        ))}
      </div>
    );
  }
};

export default ChartBreakdown;
