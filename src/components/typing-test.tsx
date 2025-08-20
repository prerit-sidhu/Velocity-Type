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

  const textRef = useRef(text);

  const handleRestart = useCallback(() => {
    setStatus('waiting');
    setUserInput('');
    setStartTime(null);
    setEndTime(null);
    setWpm(0);
    setCpm(0);
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
    if (userInput.length === 0) return 100;
    let correctChars = 0;
    const typedText = text.substring(0, userInput.length);
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] === typedText[i]) {
        correctChars++;
      }
    }
    return Math.round((correctChars / userInput.length) * 100);
  }, [userInput, text]);


  useEffect(() => {
    if (status === 'running' && startTime) {
      const interval = setInterval(() => {
        const timeElapsed = Date.now() - startTime;
        const typedChars = userInput.length;
        setWpm(calculateWPM(typedChars, timeElapsed));
        setCpm(calculateCPM(typedChars, timeElapsed));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [status, startTime, userInput, calculateWPM, calculateCPM]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
        setUserInput((prev) => {
          const newUserInput = prev + e.key;
          if (newUserInput.length === text.length) {
            setStatus('finished');
            setEndTime(Date.now());
            const finalTime = Date.now() - startTime!;
            setWpm(calculateWPM(text.length, finalTime));
            setCpm(calculateCPM(text.length, finalTime));
          }
          return newUserInput;
        });
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        if (userInput.length > 0) {
          setUserInput((prev) => prev.slice(0, -1));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, text, userInput.length, handleRestart, startTime, calculateWPM, calculateCPM]);

  if (status === 'finished') {
    const finalWpm = calculateWPM(text.length, endTime! - startTime!);
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
    <div className="flex flex-col items-center gap-8 w-full">
        {status === 'running' && <LiveStats wpm={wpm} cpm={cpm} />}
        <WordDisplay text={text} userInput={userInput} />
    </div>
  );
}
