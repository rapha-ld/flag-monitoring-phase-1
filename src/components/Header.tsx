import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import NavTabs from './NavTabs';
import Breadcrumb from './header/Breadcrumb';
import EnvironmentSelector from './header/EnvironmentSelector';
import TimeframeSelector from './header/TimeframeSelector';
import MetricsSelector from './header/MetricsSelector';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  timeframe: string;
  onTimeframeChange: (value: string) => void;
  environment: string;
  onEnvironmentChange: (value: string) => void;
  selectedDevice?: string;
  onDeviceChange?: (value: string) => void;
  selectedMetrics?: string[];
  onMetricsChange?: (metrics: string[]) => void;
  hiddenMetrics?: string[];
  onMetricVisibilityChange?: (metric: string, visible: boolean) => void;
  showTrue?: boolean;
  showFalse?: boolean;
  onToggleTrue?: () => void;
  onToggleFalse?: () => void;
  metricsButtonVisible?: boolean;
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
  hiddenMetrics = [],
  onMetricVisibilityChange = () => {},
  showTrue = true,
  showFalse = false,
  onToggleTrue = () => {},
  onToggleFalse = () => {},
  metricsButtonVisible = true,
  className, 
  ...props 
}: HeaderProps) => {
  const [activeTab, setActiveTab] = useState("monitoring");

  return (
    <header className={cn("pb-2 animate-slide-down space-y-4", className)} {...props}>
      <Breadcrumb />
      
      <NavTabs activeTab={activeTab} onChange={setActiveTab} />
      
      <div className="flex flex-col gap-4">
        <EnvironmentSelector 
          environment={environment} 
          onEnvironmentChange={onEnvironmentChange} 
        />
        
        <div className="flex items-center justify-between">
          <TimeframeSelector 
            timeframe={timeframe} 
            onTimeframeChange={onTimeframeChange} 
          />
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="h-9">
              <FileDown className="mr-2 h-4 w-4" />Export
            </Button>

            <MetricsSelector 
              selectedMetrics={selectedMetrics}
              onMetricsChange={onMetricsChange}
              hiddenMetrics={hiddenMetrics}
              onMetricVisibilityChange={onMetricVisibilityChange}
              isVisible={metricsButtonVisible}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
