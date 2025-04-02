
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

// Mini chart component for each breakdown item
const MiniChart = ({ title, version, data }: { title: string; version: string; data: any[] }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <Card className="p-3 h-32">
      <div className="text-xs font-semibold mb-1 truncate">{title}</div>
      <div className="text-xs text-muted-foreground mb-2">{version}</div>
      <ResponsiveContainer width="100%" height={70}>
        <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
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
          <Bar 
            dataKey="value" 
            fill="#6E6F96" 
            barSize={4} 
            radius={[1, 1, 0, 0]} 
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

const ChartBreakdown: React.FC<ChartBreakdownProps> = ({
  type,
  chartData,
  showTrue,
  showFalse,
  selectedTimestamp,
  selectedTimestamps
}) => {
  // Create sample data based on the original chartData
  const createSampleData = (factor: number) => {
    if (!chartData) return [];
    return chartData.map(point => ({
      ...point,
      value: Math.round(point.value * factor),
    }));
  };

  if (type === 'application') {
    // Create 6 application breakdown charts
    const appBreakdowns = [
      { title: 'iOS App', version: 'v3.4.1', data: createSampleData(0.35) },
      { title: 'Android App', version: 'v3.3.7', data: createSampleData(0.32) },
      { title: 'React Web', version: 'v2.1.0', data: createSampleData(0.18) },
      { title: 'Desktop App', version: 'v1.9.2', data: createSampleData(0.08) },
      { title: 'Vue Web', version: 'v1.2.3', data: createSampleData(0.05) },
      { title: 'API Direct', version: 'N/A', data: createSampleData(0.02) },
    ];

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-3">
        {appBreakdowns.map((app, index) => (
          <MiniChart 
            key={`app-${index}`} 
            title={app.title} 
            version={app.version} 
            data={app.data} 
          />
        ))}
      </div>
    );
  } else {
    // Create 2 SDK breakdown charts
    const sdkBreakdowns = [
      { title: 'JavaScript SDK', version: 'v2.8.3', data: createSampleData(0.72) },
      { title: 'Server SDK', version: 'v1.5.1', data: createSampleData(0.28) },
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3">
        {sdkBreakdowns.map((sdk, index) => (
          <MiniChart 
            key={`sdk-${index}`} 
            title={sdk.title} 
            version={sdk.version} 
            data={sdk.data} 
          />
        ))}
      </div>
    );
  }
};

export default ChartBreakdown;
