
import React from 'react';
import { THIS_FLAG_COLOR } from './constants';

interface SelectedDotProps {
  cx: number;
  cy: number;
  r?: number;
}

const SelectedDot: React.FC<SelectedDotProps> = ({ cx, cy, r = 6 }) => {
  return (
    <circle
      cx={cx}
      cy={cy}
      r={r}
      stroke={THIS_FLAG_COLOR}
      strokeWidth={2}
      fill="#ffffff"
    />
  );
};

export default SelectedDot;
