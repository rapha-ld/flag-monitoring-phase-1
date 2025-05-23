
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
          className="flex flex-col items-start"
        >
          <span>High</span>
          <span className="text-xs text-gray-500 font-normal">Over 80% of users saw flag changes</span>
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={selectedLevels.includes('medium')}
          onCheckedChange={() => handleLevelToggle('medium')}
          className="flex flex-col items-start"
        >
          <span>Medium</span>
          <span className="text-xs text-gray-500 font-normal">20-80% of users saw flag changes</span>
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={selectedLevels.includes('low')}
          onCheckedChange={() => handleLevelToggle('low')}
          className="flex flex-col items-start"
        >
          <span>Low</span>
          <span className="text-xs text-gray-500 font-normal">Under 20% of users saw flag changes</span>
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ImpactLevelSelector;

