'use client';

import { useState, useEffect } from 'react';
import { Keyboard, Mouse } from 'lucide-react';
import { cn } from '@/lib/utils';

export function FluidLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed inset-0 z-[100] bg-background transition-opacity duration-1000 flex items-center justify-center',
        {
          'opacity-0 pointer-events-none': !isLoading,
        }
      )}
    >
      <div className="relative h-24 w-24">
        <Keyboard className="absolute inset-0 m-auto h-20 w-20 animate-fade-in-out text-primary" />
        <Mouse className="absolute inset-0 m-auto h-20 w-20 animate-fade-in-out animation-delay-2000 text-primary" />
      </div>
    </div>
  );
}
