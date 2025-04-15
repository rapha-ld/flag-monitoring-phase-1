
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import NavTabs from './NavTabs';
import Breadcrumb from './header/Breadcrumb';
import EnvironmentSelector from './header/EnvironmentSelector';
import TimeframeSelector from './header/TimeframeSelector';
import MetricsSelector from './header/MetricsSelector';

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
      {/* Breadcrumb */}
      <Breadcrumb />
      
      {/* Tab Navigation */}
      <NavTabs activeTab={activeTab} onChange={setActiveTab} />
      
      {/* Controls with reduced spacing and aligned elements */}
      <div className="flex flex-col gap-2">
        <EnvironmentSelector 
          environment={environment} 
          onEnvironmentChange={onEnvironmentChange} 
        />
        
        <div className="flex items-center justify-between">
          <TimeframeSelector 
            timeframe={timeframe} 
            onTimeframeChange={onTimeframeChange} 
          />
          
          <MetricsSelector 
            selectedMetrics={selectedMetrics}
            onMetricsChange={onMetricsChange}
            hiddenMetrics={hiddenMetrics}
            onMetricVisibilityChange={onMetricVisibilityChange}
            isVisible={metricsButtonVisible}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
