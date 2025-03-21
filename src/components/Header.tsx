
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight, BarChart3, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import NavTabs from './NavTabs';

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  timeframe: string;
  onTimeframeChange: (value: string) => void;
  environment: string;
  onEnvironmentChange: (value: string) => void;
  selectedDevice?: string;
  onDeviceChange?: (value: string) => void;
  selectedMetrics?: string[];
  onMetricsChange?: (metrics: string[]) => void;
  showTrue?: boolean;
  showFalse?: boolean;
  onToggleTrue?: () => void;
  onToggleFalse?: () => void;
}

const Header = ({ 
  timeframe, 
  onTimeframeChange, 
  environment, 
  onEnvironmentChange,
  selectedDevice = 'all',
  onDeviceChange = () => {},
  selectedMetrics = ['evaluations', 'conversion', 'errorRate'],
  onMetricsChange = () => {},
  showTrue = true,
  showFalse = false,
  onToggleTrue = () => {},
  onToggleFalse = () => {},
  className, 
  ...props 
}: HeaderProps) => {
  const [activeTab, setActiveTab] = useState("monitoring");
  const [metricsOpen, setMetricsOpen] = useState(false);
  
  // All available metrics
  const allMetrics = [
    { id: 'evaluations', label: 'Total Evaluations' },
    { id: 'conversion', label: 'Avg. Checkout Conversion Rate' },
    { id: 'errorRate', label: 'Avg. Error Rate' }
  ];
  
  // Get metrics that are not currently selected
  const availableMetrics = allMetrics.filter(
    metric => !selectedMetrics.includes(metric.id)
  );

  const handleMetricToggle = (metric: string) => {
    const updatedMetrics = selectedMetrics.includes(metric)
      ? selectedMetrics.filter(m => m !== metric)
      : [...selectedMetrics, metric];
    
    // Ensure at least one metric is selected
    if (updatedMetrics.length > 0) {
      onMetricsChange(updatedMetrics);
    }
  };
  
  const handleMetricRemove = (metric: string) => {
    if (selectedMetrics.length > 1) {
      onMetricsChange(selectedMetrics.filter(m => m !== metric));
    }
  };
  
  const handleAddMetric = (metric: string) => {
    if (!selectedMetrics.includes(metric)) {
      onMetricsChange([...selectedMetrics, metric]);
    }
  };

  return (
    <header className={cn("pb-4 animate-slide-down space-y-4", className)} {...props}>
      {/* Breadcrumb */}
      <div className="flex items-center text-textBase">
        <span className="text-textSecondary">Flags</span>
        <ChevronRight className="h-4 w-4 mx-1 text-textSecondary" />
        <span className="font-medium">New Checkout</span>
      </div>
      
      {/* Tab Navigation */}
      <NavTabs activeTab={activeTab} onChange={setActiveTab} />
      
      {/* Controls */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        {/* Environment Selector */}
        <Select value={environment} onValueChange={onEnvironmentChange}>
          <SelectTrigger className="h-9 w-[120px] bg-background border">
            <SelectValue placeholder="Environment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="production">Production</SelectItem>
            <SelectItem value="staging">Staging</SelectItem>
          </SelectContent>
        </Select>
        
        {/* Device Filter */}
        <Select value={selectedDevice} onValueChange={onDeviceChange}>
          <SelectTrigger className="h-9 w-[130px] bg-background border">
            <SelectValue placeholder="Device" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Devices</SelectItem>
            <SelectItem value="windows">Windows</SelectItem>
            <SelectItem value="macos">macOS</SelectItem>
            <SelectItem value="linux">Linux</SelectItem>
            <SelectItem value="ios">iOS</SelectItem>
            <SelectItem value="android">Android</SelectItem>
          </SelectContent>
        </Select>
        
        {/* Timeframe Button Group */}
        <div className="flex items-center space-x-2">
          <Button 
            variant={timeframe === "7d" ? "default" : "outline"} 
            size="sm" 
            className="h-9"
            onClick={() => onTimeframeChange("7d")}
          >
            7d
          </Button>
          <Button 
            variant={timeframe === "14d" ? "default" : "outline"} 
            size="sm" 
            className="h-9"
            onClick={() => onTimeframeChange("14d")}
          >
            14d
          </Button>
          <Button 
            variant={timeframe === "30d" ? "default" : "outline"} 
            size="sm" 
            className="h-9"
            onClick={() => onTimeframeChange("30d")}
          >
            30d
          </Button>
          <Button 
            variant={timeframe === "90d" ? "default" : "outline"} 
            size="sm" 
            className="h-9"
            onClick={() => onTimeframeChange("90d")}
          >
            90d
          </Button>
        </div>

        {/* True/False Filter Checkboxes with "Variants:" label */}
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
        
        {/* Metrics Selector */}
        <div className="ml-auto">
          <Popover open={metricsOpen} onOpenChange={setMetricsOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-1.5">
                <BarChart3 className="h-4 w-4" />
                <span>Metrics</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[240px] p-3 z-50" align="end">
              <div className="space-y-3">
                <div className="text-sm font-medium pb-1 border-b mb-1">Display Metrics</div>
                <div className="space-y-1">
                  {allMetrics.map((metric) => {
                    const isSelected = selectedMetrics.includes(metric.id);
                    
                    return (
                      <div key={metric.id} className="group relative flex items-center space-x-2 py-1">
                        <Checkbox 
                          id={`metrics-${metric.id}`} 
                          checked={isSelected}
                          onCheckedChange={() => handleMetricToggle(metric.id)}
                        />
                        <Label 
                          htmlFor={`metrics-${metric.id}`} 
                          className="text-sm cursor-pointer flex-1"
                        >
                          {metric.label}
                        </Label>
                        {isSelected && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            onClick={() => handleMetricRemove(metric.id)}
                          >
                            <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                            <span className="sr-only">Remove metric</span>
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                {availableMetrics.length > 0 && (
                  <>
                    <div className="border-t my-2"></div>
                    <div className="flex justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full flex items-center justify-center gap-1.5 h-8"
                        onClick={() => {
                          if (availableMetrics.length > 0) {
                            handleAddMetric(availableMetrics[0].id);
                          }
                        }}
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add Metric{availableMetrics.length > 1 ? 's' : ''}</span>
                      </Button>
                    </div>
                  </>
                )}
                
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
};

export default Header;
