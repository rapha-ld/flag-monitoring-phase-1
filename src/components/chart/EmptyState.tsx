
import React from 'react';

interface EmptyStateProps {
  message?: string;
}

const EmptyState = ({ message = "No data available" }: EmptyStateProps) => {
  return (
    <div className="flex items-center justify-center h-full text-muted-foreground">
      {message}
    </div>
  );
};

export default EmptyState;
