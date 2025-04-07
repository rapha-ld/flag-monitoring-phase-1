
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from 'lucide-react';

export type ImpactLevel = 'high' | 'medium' | 'low';

interface ImpactLevelSelectorProps {
  selectedLevels: ImpactLevel[];
  onLevelChange: (levels: ImpactLevel[]) => void;
}

const ImpactLevelSelector: React.FC<ImpactLevelSelectorProps> = ({
  selectedLevels,
  onLevelChange,
}) => {
  const handleLevelToggle = (level: ImpactLevel) => {
    if (selectedLevels.includes(level)) {
      // Remove the level if it's already selected
      onLevelChange(selectedLevels.filter(l => l !== level));
    } else {
      // Add the level if it's not already selected
      onLevelChange([...selectedLevels, level]);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 text-xs">
          Impact Level
          <ChevronDown className="ml-1 h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white">
        <DropdownMenuLabel>Select Impact Level</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={selectedLevels.includes('high')}
          onCheckedChange={() => handleLevelToggle('high')}
        >
          High
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={selectedLevels.includes('medium')}
          onCheckedChange={() => handleLevelToggle('medium')}
        >
          Medium
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={selectedLevels.includes('low')}
          onCheckedChange={() => handleLevelToggle('low')}
        >
          Low
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ImpactLevelSelector;
