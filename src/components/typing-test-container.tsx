'use client';

import { useState, useCallback } from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import { generateRandomParagraph } from '@/ai/flows/generate-paragraph';
import { TypingTest } from './typing-test';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

export function TypingTestContainer({ initialParagraph }: { initialParagraph: string }) {
  const [paragraph, setParagraph] = useState(initialParagraph);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchNewParagraph = useCallback(async () => {
    setIsLoading(true);
    try {
      const { paragraph: newParagraph } = await generateRandomParagraph({ length: 5 });
      setParagraph(newParagraph);
    } catch (error) {
      console.error('Failed to fetch new paragraph', error);
      toast({
        title: 'Error',
        description: 'Failed to generate a new paragraph. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return (
    <div className="container mx-auto flex flex-1 flex-col items-center justify-center gap-8 px-4 py-12">
      <div className="w-full max-w-4xl">
        {isLoading ? (
          <div className="flex h-48 items-center justify-center rounded-lg border-2 border-dashed bg-card text-lg">
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            Generating new text...
          </div>
        ) : (
          <TypingTest text={paragraph} />
        )}
      </div>
      <Button onClick={fetchNewParagraph} disabled={isLoading} size="lg">
        {isLoading ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <RefreshCw className="mr-2 h-5 w-5" />
        )}
        New Text
      </Button>
    </div>
  );
}
