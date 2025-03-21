
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface MetricSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const MetricSearch = ({ searchQuery, onSearchChange }: MetricSearchProps) => {
  return (
    <div className="relative mt-2 mb-4">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search metrics..."
        className="pl-8"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};

export default MetricSearch;
