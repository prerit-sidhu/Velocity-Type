'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { WordDisplay } from './word-display';
import { Results } from './results';

type TestStatus = 'waiting' | 'running' | 'finished';

export function TypingTest({ text }: { text: string }) {
  const [status, setStatus] = useState<TestStatus>('waiting');
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);

  const textRef = useRef(text);

  useEffect(() => {
    if (textRef.current !== text) {
      handleRestart();
      textRef.current = text;
    }
  }, [text]);

  const handleRestart = useCallback(() => {
    setStatus('waiting');
    setUserInput('');
    setStartTime(null);
    setEndTime(null);
  }, []);

  const calculateWPM = useCallback(() => {
    if (!startTime || !endTime) return 0;
    const timeInMinutes = (endTime - startTime) / 1000 / 60;
    const wordCount = text.length / 5;
    return Math.round(wordCount / timeInMinutes);
  }, [startTime, endTime, text]);

  const calculateAccuracy = useCallback(() => {
    if (userInput.length === 0) return 100;
    let correctChars = 0;
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] === text[i]) {
        correctChars++;
      }
    }
    return Math.round((correctChars / userInput.length) * 100);
  }, [userInput, text]);


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (status === 'finished') return;

      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        if (status === 'waiting') {
          setStatus('running');
          setStartTime(Date.now());
        }
        setUserInput((prev) => {
          const newUserInput = prev + e.key;
          if (newUserInput.length === text.length) {
            setStatus('finished');
            setEndTime(Date.now());
          }
          return newUserInput;
        });
      } else if (e.key === 'Backspace') {
        setUserInput((prev) => prev.slice(0, -1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, text]);

  if (status === 'finished') {
    return (
      <Results
        wpm={calculateWPM()}
        accuracy={calculateAccuracy()}
        onRestart={handleRestart}
      />
    );
  }

  return <WordDisplay text={text} userInput={userInput} />;
}
