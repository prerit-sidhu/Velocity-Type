'use client';

import { useState, useCallback, useRef } from 'react';
import { Loader2, RefreshCw, Wand2, Timer, FileText } from 'lucide-react';
import { generateRandomParagraph } from '@/ai/flows/generate-paragraph';
import { generateCustomParagraph } from '@/ai/flows/generate-custom-paragraph';
import { TypingTest } from './typing-test';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type TestMode = 'time' | 'words';
type TestTime = 30 | 60 | 120;

export function TypingTestContainer({
  initialParagraph,
}: {
  initialParagraph: string;
}) {
  const [paragraph, setParagraph] = useState(initialParagraph);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const promptInputRef = useRef<HTMLInputElement>(null);

  const [testMode, setTestMode] = useState<TestMode>('words');
  const [testTime, setTestTime] = useState<TestTime>(60);

  const fetchNewParagraph = useCallback(
    async (prompt?: string) => {
      setIsLoading(true);
      try {
        const paragraphLength = testMode === 'time' ? 20 : 5;
        const { paragraph: newParagraph } = prompt
          ? await generateCustomParagraph({ topic: prompt })
          : await generateRandomParagraph({
              length: paragraphLength,
              seed: Math.random(),
            });
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
    },
    [toast, testMode]
  );

  const handleCustomGenerate = () => {
    const prompt = promptInputRef.current?.value;
    if (prompt) {
      fetchNewParagraph(prompt);
    } else {
      toast({
        title: 'Empty Prompt',
        description: 'Please enter a topic to generate a custom test.',
      });
    }
  };

  const handleModeChange = (mode: TestMode) => {
    setTestMode(mode);
    fetchNewParagraph();
  };

  const handleTimeChange = (time: TestTime) => {
    setTestTime(time);
    setTestMode('time');
    fetchNewParagraph();
  };

  return (
    <div className="container mx-auto flex flex-1 flex-col items-center justify-center gap-6 px-4 py-12">
      <div className="flex items-center gap-2 p-1 rounded-xl bg-muted">
         <Button
            variant={testMode === 'time' ? 'outline' : 'ghost'}
            className={cn("gap-2 transition-all", testMode === 'time' && "bg-background shadow-md")}
            onClick={() => handleModeChange('time')}
          >
            <Timer />
            Time
          </Button>
          <Button
            variant={testMode === 'words' ? 'outline' : 'ghost'}
            className={cn("gap-2 transition-all", testMode === 'words' && "bg-background shadow-md")}
            onClick={() => handleModeChange('words')}
          >
            <FileText />
            Words
          </Button>
      </div>

       {testMode === 'time' && (
        <div className="flex items-center gap-2">
          {[30, 60, 120].map((time) => (
            <Button
              key={time}
              variant={testTime === time ? 'default' : 'secondary'}
              onClick={() => handleTimeChange(time as TestTime)}
            >
              {time}s
            </Button>
          ))}
        </div>
      )}


      <div className="w-full max-w-4xl">
        {isLoading ? (
          <div className="flex h-48 items-center justify-center rounded-xl border-2 border-dashed bg-card text-lg">
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            Generating new text...
          </div>
        ) : (
          <TypingTest text={paragraph} duration={testMode === 'time' ? testTime : undefined} />
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xl">
        <Input
          ref={promptInputRef}
          placeholder='e.g., "A short story about a dragon"'
          className="flex-grow"
          disabled={isLoading}
        />
        <Button onClick={handleCustomGenerate} disabled={isLoading} className="w-full sm:w-auto">
          <Wand2 className="mr-2 h-5 w-5" />
          Generate Custom
        </Button>
      </div>

      <Button onClick={() => fetchNewParagraph()} disabled={isLoading} size="lg" variant="outline">
        {isLoading ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <RefreshCw className="mr-2 h-5 w-5" />
        )}
        New Random Text
      </Button>
    </div>
  );
}
