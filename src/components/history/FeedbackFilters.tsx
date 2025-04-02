import React from 'react';
import { Search, Smile, Frown, Meh, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Feedback } from './types';

interface FeedbackFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sentimentFilter: string;
  setSentimentFilter: (sentiment: string) => void;
  feedbackData: Feedback[];
}

const FeedbackFilters: React.FC<FeedbackFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  sentimentFilter,
  setSentimentFilter,
  feedbackData
}) => {
  const exportToCSV = () => {
    // Format data for CSV export
    const headers = ['ID', 'Email', 'Feedback', 'Sentiment', 'Timestamp'];
    
    const csvData = feedbackData.map(item => [
      item.id,
      item.email,
      `"${item.feedback.replace(/"/g, '""')}"`, // Escape quotes in the feedback text
      item.sentiment,
      item.timestamp.toISOString()
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', `feedback-export-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const exportToJSON = () => {
    // Format data for JSON export (serialize dates to ISO strings)
    const jsonData = feedbackData.map(item => ({
      ...item,
      timestamp: item.timestamp.toISOString()
    }));
    
    const jsonContent = JSON.stringify(jsonData, null, 2);
    
    // Create a blob and download link
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', `feedback-export-${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mt-5 mb-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search feedback..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
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
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="ml-2">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={exportToCSV}>
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportToJSON}>
                Export as JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default FeedbackFilters;
