
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight, BarChart3, Check } from 'lucide-react';
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
  className, 
  ...props 
}: HeaderProps) => {
  const [activeTab, setActiveTab] = useState("monitoring");
  const [metricsOpen, setMetricsOpen] = useState(false);

  const handleMetricToggle = (metric: string) => {
    const updatedMetrics = selectedMetrics.includes(metric)
      ? selectedMetrics.filter(m => m !== metric)
      : [...selectedMetrics, metric];
    
    // Ensure at least one metric is selected
    if (updatedMetrics.length > 0) {
      onMetricsChange(updatedMetrics);
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
      <div className="flex flex-col md:flex-row items-start gap-4">
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
        
        {/* Device Filter - Icon removed */}
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
          
          {/* Date Range Picker removed */}
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
            <PopoverContent className="w-[200px] p-2 z-50" align="end">
              <div className="space-y-2">
                <div className="text-sm font-medium pb-1 border-b mb-1">Display Metrics</div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="metrics-evaluations" 
                      checked={selectedMetrics.includes('evaluations')}
                      onCheckedChange={() => handleMetricToggle('evaluations')}
                    />
                    <Label htmlFor="metrics-evaluations" className="text-sm cursor-pointer">Evaluations</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="metrics-conversion" 
                      checked={selectedMetrics.includes('conversion')}
                      onCheckedChange={() => handleMetricToggle('conversion')}
                    />
                    <Label htmlFor="metrics-conversion" className="text-sm cursor-pointer">Checkout Conversion</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="metrics-error" 
                      checked={selectedMetrics.includes('errorRate')}
                      onCheckedChange={() => handleMetricToggle('errorRate')}
                    />
                    <Label htmlFor="metrics-error" className="text-sm cursor-pointer">Error Rate</Label>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
};

export default Header;
