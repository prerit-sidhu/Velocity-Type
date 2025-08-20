'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { WordDisplay } from './word-display';
import { Results } from './results';
import { LiveStats } from './live-stats';

type TestStatus = 'waiting' | 'running' | 'finished';

export function TypingTest({ text }: { text: string }) {
  const [status, setStatus] = useState<TestStatus>('waiting');
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [cpm, setCpm] = useState(0);
  const [isFocused, setIsFocused] = useState(true);
  const [errorCount, setErrorCount] = useState(0);
  const [totalCharsTyped, setTotalCharsTyped] = useState(0);

  const textRef = useRef(text);

  const calculateCorrectChars = (currentInput: string) => {
    let count = 0;
    for (let i = 0; i < currentInput.length; i++) {
      if (currentInput[i] === text[i]) {
        count++;
      }
    }
    return count;
  };

  const handleRestart = useCallback(() => {
    setStatus('waiting');
    setUserInput('');
    setStartTime(null);
    setEndTime(null);
    setWpm(0);
    setCpm(0);
    setErrorCount(0);
    setTotalCharsTyped(0);
    setIsFocused(true);
  }, []);

  useEffect(() => {
    if (textRef.current !== text) {
      handleRestart();
      textRef.current = text;
    }
  }, [text, handleRestart]);

  const calculateWPM = useCallback((chars: number, timeMs: number) => {
    if (timeMs === 0) return 0;
    const timeInMinutes = timeMs / 1000 / 60;
    const wordCount = chars / 5;
    return Math.round(wordCount / timeInMinutes);
  }, []);

  const calculateCPM = useCallback((chars: number, timeMs: number) => {
    if (timeMs === 0) return 0;
    const timeInMinutes = timeMs / 1000 / 60;
    return Math.round(chars / timeInMinutes);
  }, []);

  const calculateAccuracy = useCallback(() => {
    if (totalCharsTyped === 0) return 100;
    const correctChars = totalCharsTyped - errorCount;
    return Math.round((correctChars / totalCharsTyped) * 100);
  }, [totalCharsTyped, errorCount]);

  useEffect(() => {
    if (status === 'running' && startTime) {
      const interval = setInterval(() => {
        const timeElapsed = Date.now() - startTime;
        const correctChars = calculateCorrectChars(userInput);
        setWpm(calculateWPM(correctChars, timeElapsed));
        setCpm(calculateCPM(correctChars, timeElapsed));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [status, startTime, calculateWPM, calculateCPM, userInput]);

  useEffect(() => {
    const handleFocus = () => {
      const activeElement = document.activeElement;
      if (activeElement?.tagName === 'INPUT' || activeElement?.tagName === 'TEXTAREA') {
        setIsFocused(false);
      } else {
        setIsFocused(true);
      }
    };
    
    document.addEventListener('focusin', handleFocus);
    document.addEventListener('focusout', handleFocus);
    
    return () => {
      document.removeEventListener('focusin', handleFocus);
      document.removeEventListener('focusout', handleFocus);
    };
  }, []);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFocused) return;
      
      if (e.key === 'Escape') {
        handleRestart();
        return;
      }
      if (status === 'finished') return;

      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();

        if (status === 'waiting') {
          setStatus('running');
          setStartTime(Date.now());
        }

        setTotalCharsTyped((prev) => prev + 1);

        if (e.key !== text[userInput.length]) {
          setErrorCount((prev) => prev + 1);
        }
        
        setUserInput((prev) => {
          const newUserInput = prev + e.key;
          if (newUserInput.length >= text.length) {
            setStatus('finished');
            setEndTime(Date.now());
          }
          return newUserInput;
        });

      } else if (e.key === 'Backspace') {
        e.preventDefault();
        setUserInput((prev) => prev.slice(0, -1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, text, handleRestart, startTime, isFocused, userInput.length]);

  if (status === 'finished' && startTime && endTime) {
    const correctChars = calculateCorrectChars(userInput);
    const finalWpm = calculateWPM(correctChars, endTime - startTime);
    const finalAccuracy = calculateAccuracy();
    return (
      <Results
        wpm={finalWpm}
        accuracy={finalAccuracy}
        onRestart={handleRestart}
      />
    );
  }

  return (
    <div className="flex flex-col items-center gap-8 w-full" onClick={() => setIsFocused(true)}>
        {(status === 'running' || status === 'finished') && <LiveStats wpm={wpm} cpm={cpm} />}
        <WordDisplay text={text} userInput={userInput} isFocused={isFocused} status={status}/>
    </div>
  );
}
