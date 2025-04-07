
import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface CollapsibleBannerProps {
  className?: string;
}

const CollapsibleBanner: React.FC<CollapsibleBannerProps> = ({ className }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className={cn("w-full bg-white border-b border-border", className)}
    >
      <CollapsibleContent className="w-full h-[100px]">
        {/* Banner content will go here later */}
      </CollapsibleContent>
      
      <CollapsibleTrigger className="flex items-center justify-center w-full h-6 bg-white border-b border-border hover:bg-gray-50 transition-colors">
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        )}
      </CollapsibleTrigger>
    </Collapsible>
  );
};

export default CollapsibleBanner;
