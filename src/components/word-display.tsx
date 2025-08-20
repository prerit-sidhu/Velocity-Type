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
      <p className="text-xl sm:text-2xl font-mono tracking-wide leading-relaxed text-left break-all relative">
        {characters.map((char, index) => {
          const isTyped = index < userInput.length;
          const isCorrect = isTyped ? userInput[index] === char : undefined;
          const isCurrent = index === userInput.length;

          return (
            <span
              key={index}
              className={cn('transition-all duration-100 ease-in-out', {
                'text-foreground': isTyped && isCorrect,
                'text-destructive/80': isTyped && !isCorrect,
                'text-muted-foreground/50': !isTyped,
              })}
            >
              {isCurrent && (
                <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-accent animate-pulse" data-cursor/>
              )}
              {char === ' ' && isTyped && !isCorrect ? (
                <span className="bg-destructive/20 rounded-[0.2rem] -mx-px px-px">_</span>
              ) : (
                char
              )}
            </span>
          );
        })}
        <style jsx>{`
          [data-cursor] {
            transform: translateX(${userInput.length}ch);
          }
        `}</style>
      </p>
    </div>
  );
}
