
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BreakdownTypeSelectorProps {
  breakdownType: 'application' | 'sdk';
  onBreakdownTypeChange: (value: 'application' | 'sdk') => void;
}

const BreakdownTypeSelector: React.FC<BreakdownTypeSelectorProps> = ({
  breakdownType,
  onBreakdownTypeChange
}) => {
  return (
    <div className="px-4 pb-2 mt-6"> {/* Increased top margin from mt-4 to mt-6 */}
      <Select
        value={breakdownType}
        onValueChange={(value) => onBreakdownTypeChange(value as 'application' | 'sdk')}
      >
        <SelectTrigger className="h-8 text-xs">
          <SelectValue placeholder="Select breakdown" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="application">Application</SelectItem>
          <SelectItem value="sdk">SDK</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default BreakdownTypeSelector;
