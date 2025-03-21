
import React from 'react';
import { ResponsiveContainer } from 'recharts';

interface ChartContainerProps {
  height?: number;
  children: React.ReactNode;
}

const ChartContainer = ({ 
  height = 350, 
  children 
}: ChartContainerProps) => {
  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={height}>
        {children}
      </ResponsiveContainer>
    </div>
  );
};

export default ChartContainer;
