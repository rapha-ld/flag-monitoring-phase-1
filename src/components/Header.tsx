import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import NavTabs from './NavTabs';
import Breadcrumb from './header/Breadcrumb';
import EnvironmentSelector from './header/EnvironmentSelector';
import DeviceSelector from './header/DeviceSelector';
import TimeframeSelector from './header/TimeframeSelector';
import VariantFilters from './header/VariantFilters';
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
    <header className={cn("pb-4 animate-slide-down space-y-4", className)} {...props}>
      {/* Breadcrumb */}
      <Breadcrumb />
      
      {/* Tab Navigation */}
      <NavTabs activeTab={activeTab} onChange={setActiveTab} />
      
      {/* Controls */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <EnvironmentSelector 
          environment={environment} 
          onEnvironmentChange={onEnvironmentChange} 
        />
        
        <DeviceSelector 
          selectedDevice={selectedDevice} 
          onDeviceChange={onDeviceChange} 
        />
        
        <TimeframeSelector 
          timeframe={timeframe} 
          onTimeframeChange={onTimeframeChange} 
        />

        <VariantFilters 
          showTrue={showTrue}
          showFalse={showFalse}
          onToggleTrue={onToggleTrue}
          onToggleFalse={onToggleFalse}
        />
        
        <MetricsSelector 
          selectedMetrics={selectedMetrics}
          onMetricsChange={onMetricsChange}
          hiddenMetrics={hiddenMetrics}
          onMetricVisibilityChange={onMetricVisibilityChange}
          isVisible={metricsButtonVisible}
        />
      </div>
    </header>
  );
};

export default Header;
