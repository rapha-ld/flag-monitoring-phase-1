
import React from 'react';
import { Search, Smile, Frown, Meh } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FeedbackFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sentimentFilter: string;
  setSentimentFilter: (sentiment: string) => void;
}

const FeedbackFilters: React.FC<FeedbackFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  sentimentFilter,
  setSentimentFilter
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-4">
      <Select
        value={sentimentFilter}
        onValueChange={setSentimentFilter}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All feedback" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All feedback</SelectItem>
          <SelectItem value="positive" className="flex items-center">
            <div className="flex items-center gap-2">
              <Smile className="h-4 w-4 text-green-500" />
              <span>Positive</span>
            </div>
          </SelectItem>
          <SelectItem value="neutral">
            <div className="flex items-center gap-2">
              <Meh className="h-4 w-4 text-amber-500" />
              <span>Neutral</span>
            </div>
          </SelectItem>
          <SelectItem value="negative">
            <div className="flex items-center gap-2">
              <Frown className="h-4 w-4 text-red-500" />
              <span>Negative</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
      
      <div className="relative w-full sm:w-72">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search feedback..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>
  );
};

export default FeedbackFilters;
