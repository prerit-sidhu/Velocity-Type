import { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface WordDisplayProps {
  text: string;
  userInput: string;
}

export function WordDisplay({ text, userInput }: WordDisplayProps) {
  const characters = useMemo(() => text.split(''), [text]);

  return (
    <div className="bg-card p-6 sm:p-8 rounded-lg shadow-md border w-full">
      <div className="text-xl sm:text-2xl font-mono tracking-wide leading-relaxed text-left break-all relative">
        <p className="invisible">
           {characters.map((char, index) => (
            <span key={index}>{char}</span>
          ))}
        </p>
        <p className="absolute top-0 left-0">
            {characters.map((char, index) => {
            const isTyped = index < userInput.length;
            const isCorrect = isTyped ? userInput[index] === char : undefined;
            
            return (
                <span
                key={index}
                className={cn('transition-colors duration-100 ease-in-out', {
                    'text-foreground': isTyped && isCorrect,
                    'text-destructive/80': isTyped && !isCorrect,
                    'text-muted-foreground/50': !isTyped,
                })}
                >
                {char === ' ' && isTyped && !isCorrect ? (
                    <span className="bg-destructive/20 rounded-[0.2rem] -mx-px px-px">_</span>
                ) : (
                    char
                )}
                </span>
            );
            })}
        </p>
        <span 
          className="absolute top-0 bottom-0 w-0.5 bg-accent animate-pulse transition-transform duration-100 ease-linear" 
          style={{ transform: `translateX(${userInput.length}ch)` }}
        />
      </div>
    </div>
  );
}
