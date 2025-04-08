
import React from 'react';
import { Toggle } from '@/components/ui/toggle';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { BarChartHorizontal } from 'lucide-react';

interface MetricCardControlsProps {
  showBreakdownToggle: boolean;
  breakdownEnabled: boolean;
  onBreakdownToggle: (enabled: boolean) => void;
  breakdownType: 'application' | 'sdk';
  onBreakdownTypeChange: (type: 'application' | 'sdk') => void;
  showVariantFilters: boolean;
  showTrue?: boolean;
  showFalse?: boolean;
  onToggleTrue?: () => void;
  onToggleFalse?: () => void;
}

const MetricCardControls: React.FC<MetricCardControlsProps> = ({
  showBreakdownToggle,
  breakdownEnabled,
  onBreakdownToggle,
  breakdownType,
  onBreakdownTypeChange,
  showVariantFilters,
  showTrue,
  showFalse,
  onToggleTrue,
  onToggleFalse
}) => {
  return (
    <div className="flex flex-col items-end pr-4 pt-4 space-y-2">
      {showVariantFilters && (
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="filter-true" 
              checked={showTrue}
              onCheckedChange={onToggleTrue}
              className="data-[state=checked]:bg-[#2BB7D2] data-[state=checked]:border-[#2BB7D2]"
            />
            <Label htmlFor="filter-true" className="text-sm">True</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="filter-false" 
              checked={showFalse}
              onCheckedChange={onToggleFalse}
              className="data-[state=checked]:bg-[#FFD099] data-[state=checked]:border-[#FFD099] data-[state=checked]:text-black"
            />
            <Label htmlFor="filter-false" className="text-sm">False</Label>
          </div>
        </div>
      )}
      
      {showBreakdownToggle && (
        <Toggle 
          size="sm"
          pressed={breakdownEnabled}
          onPressedChange={onBreakdownToggle}
          aria-label="Toggle breakdown view"
          className="h-8 px-2 text-xs"
        >
          <BarChartHorizontal className="h-3.5 w-3.5 mr-1" />
          Breakdown
        </Toggle>
      )}
    </div>
  );
};

export default MetricCardControls;
