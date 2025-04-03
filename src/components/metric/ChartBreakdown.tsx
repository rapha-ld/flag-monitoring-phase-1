
import React from 'react';
import { DataPoint } from '../BarChart';
import { Card } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface ChartBreakdownProps {
  type: 'application' | 'sdk';
  chartData?: DataPoint[];
  showTrue?: boolean;
  showFalse?: boolean;
  selectedTimestamp?: Date | null;
  selectedTimestamps?: Date[] | null;
}

const MiniChart = ({ 
  title, 
  version, 
  data, 
  showTrue,
  showFalse,
  trueColor,
  falseColor,
  factor
}: { 
  title: string; 
  version: string; 
  data: any[];
  showTrue: boolean;
  showFalse: boolean;
  trueColor: string;
  falseColor: string;
  factor: number;
}) => {
  const maxValue = Math.max(...data.map(d => 
    Math.max(
      (showTrue && showFalse) ? (d.valueTrue || 0) + (d.valueFalse || 0) : 
      showTrue ? (d.valueTrue || 0) : 
      showFalse ? (d.valueFalse || 0) : d.value || 0
    )
  ));
  
  return (
    <Card className="p-3 h-32 transition-all duration-300 hover:shadow-md">
      <div className="text-xs font-semibold mb-1 truncate">{title}</div>
      <div className="text-xs text-muted-foreground mb-2">{version}</div>
      <ResponsiveContainer width="100%" height={70}>
        <BarChart 
          data={data} 
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          barSize={6}
          barGap={0}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis 
            dataKey="name" 
            tick={false} 
            axisLine={false} 
            tickLine={false} 
          />
          <YAxis 
            domain={[0, maxValue * 1.1]} 
            tick={false} 
            axisLine={false} 
            tickLine={false} 
            width={0}
          />
          <Tooltip 
            formatter={(value: any) => [`${value}`, 'Users']}
            labelFormatter={(label) => {
              const date = new Date(label);
              return isNaN(date.getTime()) 
                ? label
                : `${date.getMonth() + 1}/${date.getDate()}`;
            }}
          />
          
          {showTrue && (
            <Bar 
              dataKey="valueTrue" 
              name="True"
              stackId="a"
              fill={trueColor} 
              radius={[1, 1, 0, 0]} 
              isAnimationActive={false}
              className="transition-all duration-300 hover:opacity-80"
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
              className="transition-all duration-300 hover:opacity-80"
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

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
  
  // Create sample data with unique patterns for each item based on factor and additional variance
  const createSampleData = (factor: number, variance: number = 0) => {
    if (!chartData) return [];
    
    return chartData.map((point, index) => {
      // Apply factor and add some randomization specific to this dataset
      const pointFactor = factor * (1 + (Math.sin(index * variance) * 0.2));
      
      return {
        ...point,
        valueTrue: Math.round((point.valueTrue || 0) * pointFactor),
        valueFalse: Math.round((point.valueFalse || 0) * pointFactor),
        value: Math.round((point.value || 0) * pointFactor),
      };
    });
  };
  
  const calculateTotalValue = (data: any[]) => {
    return data.reduce((sum, item) => {
      const trueVal = item.valueTrue || 0;
      const falseVal = item.valueFalse || 0;
      return sum + trueVal + falseVal;
    }, 0);
  };

  if (type === 'application') {
    // Create app breakdowns with more variance
    const appBreakdownsUnsorted = [
      { title: 'iOS App', version: 'v3.4.1', factor: 0.85, variance: 1.1, data: [] },
      { title: 'Android App', version: 'v3.3.7', factor: 0.67, variance: 0.9, data: [] },
      { title: 'React Web', version: 'v2.1.0', factor: 0.42, variance: 1.3, data: [] },
      { title: 'Desktop App', version: 'v1.9.2', factor: 0.30, variance: 0.7, data: [] },
      { title: 'Vue Web', version: 'v1.2.3', factor: 0.15, variance: 1.5, data: [] },
      { title: 'API Direct', version: 'N/A', factor: 0.08, variance: 0.5, data: [] },
    ];
    
    // Generate data for each app with its unique variance pattern
    appBreakdownsUnsorted.forEach(app => {
      app.data = createSampleData(app.factor, app.variance);
    });
    
    // Calculate total values and sort by total in descending order
    const appBreakdowns = [...appBreakdownsUnsorted]
      .map(app => ({
        ...app,
        totalValue: calculateTotalValue(app.data)
      }))
      .sort((a, b) => b.totalValue - a.totalValue);

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
    // Create SDK breakdowns with more variance
    const sdkBreakdownsUnsorted = [
      { title: 'JavaScript SDK', version: 'v2.8.3', factor: 0.90, variance: 0.8, data: [] },
      { title: 'iOS SDK', version: 'v2.3.1', factor: 0.65, variance: 1.2, data: [] },
      { title: 'Android SDK', version: 'v2.1.4', factor: 0.55, variance: 1.0, data: [] },
      { title: 'Server SDK', version: 'v1.5.1', factor: 0.40, variance: 0.7, data: [] },
      { title: 'Python SDK', version: 'v1.3.2', factor: 0.25, variance: 1.3, data: [] },
    ];
    
    // Generate data for each SDK with its unique variance pattern
    sdkBreakdownsUnsorted.forEach(sdk => {
      sdk.data = createSampleData(sdk.factor, sdk.variance);
    });
    
    // Calculate total values and sort by total in descending order
    const sdkBreakdowns = [...sdkBreakdownsUnsorted]
      .map(sdk => ({
        ...sdk,
        totalValue: calculateTotalValue(sdk.data)
      }))
      .sort((a, b) => b.totalValue - a.totalValue);

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
