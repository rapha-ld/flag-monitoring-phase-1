
import React from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
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

  // Choose color based on chart type
  const getChartColor = () => {
    switch (title) {
      case 'Error Rate':
        return '#FF6B6B';
      case 'Latency':
        return '#4D96FF';
      case 'Checkout Conversion Rate':
        return '#6BCB77';
      default:
        return '#6E6F96';
    }
  };

  return (
    <Card className="flex-1 bg-white">
      <CardHeader className="p-3 pb-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <div className="h-[60px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <XAxis 
                dataKey="time" 
                tick={false} 
                axisLine={false} 
                tickLine={false} 
              />
              <YAxis 
                hide 
                domain={['auto', 'auto']} 
              />
              <Tooltip 
                formatter={(value) => [`${value.toFixed(2)}`, title]}
                labelFormatter={() => ''}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={getChartColor()} 
                fill={getChartColor()} 
                fillOpacity={0.2} 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TelemetryChart;
