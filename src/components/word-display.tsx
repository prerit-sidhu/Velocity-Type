import { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface WordDisplayProps {
  text: string;
  userInput: string;
  isFocused: boolean;
  status: 'waiting' | 'running' | 'finished';
}

export function WordDisplay({ text, userInput, isFocused, status }: WordDisplayProps) {
  const characters = useMemo(() => text.split(''), [text]);

  const typedCharacters = useMemo(() => {
    return characters.slice(0, userInput.length).map((char, index) => {
      const isCorrect = userInput[index] === char;
      return (
        <span
          key={index}
          className={cn('transition-colors duration-100 ease-in-out', {
            'text-foreground': isCorrect,
            'text-destructive/80': !isCorrect,
          })}
        >
          {char === ' ' && !isCorrect ? (
            <span className="bg-destructive/20 rounded-[0.2rem] -mx-px px-px">_</span>
          ) : (
            char
          )}
        </span>
      );
    });
  }, [characters, userInput]);

  const remainingCharacters = useMemo(() => {
     return characters.slice(userInput.length).map((char, index) => (
      <span key={index + userInput.length} className="text-muted-foreground/50">
        {char}
      </span>
    ));
  }, [characters, userInput.length]);

  return (
    <div className="bg-card p-6 sm:p-8 rounded-xl shadow-lg border w-full relative transition-all duration-300 hover:shadow-2xl">
      <div className={cn(
        "text-xl sm:text-2xl font-mono tracking-wide leading-relaxed text-left break-all transition-all duration-300",
        { 'blur-sm': !isFocused && status !== 'finished' }
      )}>
        <p>
          {typedCharacters}
          <span 
            className={cn(
              "inline-block w-0.5 h-7 sm:h-8 bg-accent animate-pulse rounded-full", 
              { 'hidden': !isFocused || status === 'finished' }
            )} 
          />
          {remainingCharacters}
        </p>
      </div>
      {!isFocused && status !== 'finished' && (
         <div className="absolute inset-0 flex items-center justify-center cursor-pointer rounded-lg">
           <p className="text-foreground font-medium bg-background/80 px-4 py-2 rounded-md">Click to focus</p>
         </div>
      )}
    </div>
  );
}
