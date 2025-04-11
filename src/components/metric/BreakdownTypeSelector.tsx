
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BreakdownTypeSelectorProps {
  breakdownType: 'application' | 'sdk';
  onBreakdownTypeChange: (value: 'application' | 'sdk') => void;
  // Add backwards compatibility for older prop names
  type?: 'application' | 'sdk';
  onChange?: (value: 'application' | 'sdk') => void;
}

const BreakdownTypeSelector: React.FC<BreakdownTypeSelectorProps> = ({
  breakdownType,
  onBreakdownTypeChange,
  type, // Accept the type prop for backward compatibility
  onChange // Accept the onChange prop for backward compatibility
}) => {
  // Use the new prop names if available, otherwise fall back to the old ones
  const actualType = breakdownType || type || 'application';
  const handleChange = onBreakdownTypeChange || onChange || (() => {});

  return (
    <div className="px-4 pb-2">
      <Select
        value={actualType}
        onValueChange={(value) => handleChange(value as 'application' | 'sdk')}
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
