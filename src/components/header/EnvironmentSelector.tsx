
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EnvironmentSelectorProps {
  environment: string;
  onEnvironmentChange: (value: string) => void;
}

const EnvironmentSelector = ({ environment, onEnvironmentChange }: EnvironmentSelectorProps) => {
  return (
    <Select value={environment} onValueChange={onEnvironmentChange}>
      <SelectTrigger className="h-9 w-[120px] bg-background border">
        <SelectValue placeholder="Environment" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="production">Production</SelectItem>
        <SelectItem value="staging">Staging</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default EnvironmentSelector;
