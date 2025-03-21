
import React from 'react';
import { ChevronRight } from 'lucide-react';

const Breadcrumb = () => {
  return (
    <div className="flex items-center text-textBase">
      <span className="text-textSecondary">Flags</span>
      <ChevronRight className="h-4 w-4 mx-1 text-textSecondary" />
      <span className="font-medium">New Checkout</span>
    </div>
  );
};

export default Breadcrumb;
