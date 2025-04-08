
import React from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TelemetryChartProps {
  title: string;
}

const TelemetryChart: React.FC<TelemetryChartProps> = ({ title }) => {
  // Generate random data for demonstration
  const data = React.useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => ({
      time: `${i}h`,
      value: Math.random() * 100
    }));
  }, []);

  // Use chart color based on title
  const chartColor = title === "Error Rate" ? "#DB2251" : "#7861C6";

  return (
    <Card className="flex-1 bg-white">
      <CardHeader className="p-3 pb-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0 pb-1">
        <div className="h-[60px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 0 }}>
              <defs>
                <linearGradient id={`colorGradient-${title.replace(/\s+/g, '')}`} x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor={chartColor} stopOpacity={0.1} />
                  <stop offset="100%" stopColor={chartColor} stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 8 }}
                axisLine={{ stroke: '#eee' }} 
                tickLine={{ stroke: '#eee' }} 
              />
              <YAxis 
                tick={{ fontSize: 8 }}
                axisLine={{ stroke: '#eee' }} 
                tickLine={{ stroke: '#eee' }}
                width={20}
              />
              <Tooltip 
                formatter={(value: any) => [typeof value === 'number' ? value.toFixed(2) : value, title]}
                labelFormatter={() => ''}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={chartColor} 
                strokeWidth={1}
                fill={`url(#colorGradient-${title.replace(/\s+/g, '')})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TelemetryChart;
