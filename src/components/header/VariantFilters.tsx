
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface VariantFiltersProps {
  showTrue: boolean;
  showFalse: boolean;
  onToggleTrue: () => void;
  onToggleFalse: () => void;
}

const VariantFilters = ({ showTrue, showFalse, onToggleTrue, onToggleFalse }: VariantFiltersProps) => {
  return (
    <div className="flex items-center space-x-4 ml-2">
      <span className="text-sm font-medium">Variants:</span>
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
  );
};

export default VariantFilters;
