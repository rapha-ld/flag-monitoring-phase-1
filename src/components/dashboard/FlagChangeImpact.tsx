import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { BarChartHorizontal, ChevronDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { getXAxisInterval } from '@/utils/chartUtils';
import { getTimestampPositions } from '@/utils/chartUtils';
import { DataPoint } from '@/components/BarChart';

interface FlagChangeImpactProps {
  chartData: DataPoint[];
  selectedTimestamp?: Date | null;
  selectedTimestamps?: Date[] | null;
  className?: string;
  timeframe?: string;
  hoveredTimestamp?: string | null;
}

const IMPACT_COLORS = {
  large: "#EF4444", // red-500
  medium: "#F59E0B", // amber-500
  small: "#10B981" // emerald-500
};

const FlagChangeImpact: React.FC<FlagChangeImpactProps> = ({
  chartData,
  selectedTimestamp,
  selectedTimestamps,
  className,
  timeframe,
  hoveredTimestamp
}) => {
  const [selectedImpacts, setSelectedImpacts] = useState<string[]>(['large', 'medium', 'small']);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const impactData = chartData.map(point => {
    const dateStr = point.name;
    const index = chartData.indexOf(point);
    const dayOfMonth = new Date(dateStr).getDate();

    const largeFactor = dayOfMonth % 5 * 0.5;
    const mediumFactor = (dayOfMonth + 2) % 4 * 0.7;
    const smallFactor = (dayOfMonth + 4) % 3 * 0.9;
    return {
      name: dateStr,
      large: Math.max(0, (point.valueTrue || 0) * 0.2 + largeFactor),
      medium: Math.max(0, (point.valueTrue || 0) * 0.3 + mediumFactor),
      small: Math.max(0, (point.valueTrue || 0) * 0.5 + smallFactor)
    };
  });

  const handleImpactToggle = (impact: string) => {
    setSelectedImpacts(prev => prev.includes(impact) ? prev.filter(i => i !== impact) : [...prev, impact]);
  };

  const timestampPositions = selectedTimestamps ? getTimestampPositions(chartData, selectedTimestamps) : selectedTimestamp ? getTimestampPositions(chartData, [selectedTimestamp]) : [];

  const hoveredPosition = hoveredTimestamp ? 
    impactData.findIndex(point => point.name === hoveredTimestamp) : -1;

  const xAxisInterval = getXAxisInterval(chartData.length);

  return (
    <Card className={cn("overflow-hidden transition-all duration-300 hover:shadow-md animate-fade-in", className)}>
      <div className="flex justify-between items-center px-6 pt-6">
        <div>
          <h3 className="text-muted-foreground text-sm font-medium">Flag Change Impact</h3>
        </div>
        
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <button className="flex items-center text-sm bg-secondary/50 hover:bg-secondary px-2 py-1 rounded border">
              <BarChartHorizontal className="h-3.5 w-3.5 mr-1.5" />
              Impact
              <ChevronDown className="h-3.5 w-3.5 ml-1.5" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-[180px] p-2" align="end">
            <div className="space-y-2">
              <div className="font-medium text-sm pb-1 border-b mb-1">Impact Levels</div>
              <div className="space-y-2">
                {Object.entries({
                  large: 'Large Impact',
                  medium: 'Medium Impact',
                  small: 'Small Impact'
                }).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`impact-${key}`} 
                      checked={selectedImpacts.includes(key)} 
                      onCheckedChange={() => handleImpactToggle(key)} 
                      className="data-[state=checked]:bg-primary" 
                    />
                    <Label 
                      htmlFor={`impact-${key}`} 
                      className="text-sm cursor-pointer flex-grow flex items-center"
                    >
                      <div 
                        className="h-2.5 w-2.5 rounded-sm mr-1.5" 
                        style={{
                          backgroundColor: IMPACT_COLORS[key as keyof typeof IMPACT_COLORS]
                        }} 
                      />
                      {label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      <CardContent className="pt-4 px-0 h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart 
            data={impactData} 
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              interval={xAxisInterval} 
              tick={{
                fontSize: 10
              }} 
              tickFormatter={value => 
                new Date(value).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric'
                })
              } 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{
                fontSize: 10
              }} 
              tickFormatter={value => value.toFixed(0)} 
            />
            <Tooltip 
              formatter={(value: number) => [value.toFixed(1), '']} 
              labelFormatter={label => 
                new Date(label).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })
              } 
            />
            
            {selectedImpacts.includes('small') && 
              <Area 
                type="monotone" 
                dataKey="small" 
                stackId="1" 
                stroke={IMPACT_COLORS.small} 
                fill={IMPACT_COLORS.small} 
                fillOpacity={0.6} 
                name="Small Impact" 
              />
            }
            {selectedImpacts.includes('medium') && 
              <Area 
                type="monotone" 
                dataKey="medium" 
                stackId="1" 
                stroke={IMPACT_COLORS.medium} 
                fill={IMPACT_COLORS.medium} 
                fillOpacity={0.6} 
                name="Medium Impact" 
              />
            }
            {selectedImpacts.includes('large') && 
              <Area 
                type="monotone" 
                dataKey="large" 
                stackId="1" 
                stroke={IMPACT_COLORS.large} 
                fill={IMPACT_COLORS.large} 
                fillOpacity={0.6} 
                name="Large Impact" 
              />
            }
            
            {timestampPositions.map((position, index) => (
              <ReferenceLine 
                key={`selected-${index}`} 
                x={impactData[position]?.name} 
                stroke="#1D4ED8" 
                strokeWidth={1.5} 
                strokeDasharray="3 3" 
              />
            ))}
            
            {hoveredPosition >= 0 && (
              <ReferenceLine 
                key="hovered-line" 
                x={impactData[hoveredPosition]?.name} 
                stroke="#6E6F96" 
                strokeWidth={1.5} 
                strokeDasharray="3 3" 
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default FlagChangeImpact;
