
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DeviceSelectorProps {
  selectedDevice: string;
  onDeviceChange: (value: string) => void;
}

const DeviceSelector = ({ selectedDevice, onDeviceChange }: DeviceSelectorProps) => {
  return (
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
  );
};

export default DeviceSelector;
