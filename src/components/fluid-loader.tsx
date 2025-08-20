'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function FluidLoader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={cn(
        'fixed inset-0 z-[100] bg-background transition-opacity duration-1000 flex items-center justify-center',
        {
          'opacity-0 pointer-events-none': !isLoading,
        }
      )}
    >
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}
