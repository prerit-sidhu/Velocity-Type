'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { WordDisplay } from './word-display';
import { Results } from './results';
import { LiveStats } from './live-stats';
import { useAuth } from '@/context/auth-context';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

type TestStatus = 'waiting' | 'running' | 'finished';

export function TypingTest({ text, duration }: { text: string; duration?: number; }) {
  const [status, setStatus] = useState<TestStatus>('waiting');
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [cpm, setCpm] = useState(0);
  const [isFocused, setIsFocused] = useState(true);
  const [errorCount, setErrorCount] = useState(0);
  const [totalCharsTyped, setTotalCharsTyped] = useState(0);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isScoreSaved, setIsScoreSaved] = useState(false);


  const { user } = useAuth();
  const { toast } = useToast();
  const textRef = useRef(text);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const calculateCorrectChars = (currentInput: string) => {
    let count = 0;
    for (let i = 0; i < currentInput.length; i++) {
      if (currentInput[i] === text[i]) {
        count++;
      }
    }
    return count;
  };

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

  const saveScore = useCallback(async (finalWpm: number, finalAccuracy: number) => {
    if (user && !isScoreSaved) {
      try {
        await addDoc(collection(db, 'scores'), {
          userId: user.uid,
          username: user.displayName,
          wpm: finalWpm,
          accuracy: finalAccuracy,
          timestamp: serverTimestamp(),
          text,
          duration,
        });
        toast({
            title: "Score Saved!",
            description: "Your result has been added to the leaderboard.",
        })
        setIsScoreSaved(true);
      } catch (error) {
        console.error("Error adding document: ", error);
        toast({
          title: "Error",
          description: "Could not save your score.",
          variant: "destructive"
        })
      }
    }
  }, [user, text, duration, toast, isScoreSaved]);


  const finishTest = useCallback(() => {
    setStatus('finished');
    const finalEndTime = Date.now();
    setEndTime(finalEndTime);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
  }, []);

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
    setIsScoreSaved(false);
    setTimeLeft(duration);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
  }, [duration]);

  useEffect(() => {
    if (textRef.current !== text || duration !== (timeLeft === undefined ? undefined : duration)) {
      handleRestart();
      textRef.current = text;
    }
  }, [text, duration, handleRestart, timeLeft]);

  useEffect(() => {
    if (status === 'running' && startTime) {
      const liveTimer = setInterval(() => {
        const timeElapsed = Date.now() - startTime;
        const correctChars = calculateCorrectChars(userInput);
        setWpm(calculateWPM(correctChars, timeElapsed));
        setCpm(calculateCPM(correctChars, timeElapsed));
      }, 1000);
      return () => clearInterval(liveTimer);
    }
  }, [status, startTime, calculateWPM, calculateCPM, userInput, calculateCorrectChars]);

  useEffect(() => {
    if (status === 'running' && duration) {
       timerIntervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev !== undefined && prev > 1) {
            return prev - 1;
          }
          finishTest();
          return 0;
        });
      }, 1000);
      return () => {
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
        }
      };
    }
  }, [status, duration, finishTest]);

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
        
        setUserInput((prev) => {
          if (prev.length >= text.length) {
            if (!duration) finishTest();
            return prev;
          }

          if (e.key !== text[prev.length]) {
            setErrorCount((prevCount) => prevCount + 1);
          }
          setTotalCharsTyped((prevTotal) => prevTotal + 1);

          const newUserInput = prev + e.key;
          if (newUserInput.length >= text.length && !duration) {
            finishTest();
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
  }, [status, text, handleRestart, startTime, isFocused, userInput.length, duration, finishTest]);

  if (status === 'finished' && startTime) {
    const timeTaken = (endTime || Date.now()) - startTime;
    const correctChars = calculateCorrectChars(userInput);
    const finalWpm = calculateWPM(correctChars, timeTaken);
    const finalAccuracy = calculateAccuracy();

    const handleSaveScore = () => {
        if (finalWpm > 0) {
            saveScore(finalWpm, finalAccuracy);
        } else {
            toast({
                title: "Cannot Save Score",
                description: "Your WPM is 0, so this score cannot be saved.",
                variant: "destructive"
            })
        }
    }

    return (
      <Results
        wpm={finalWpm}
        accuracy={finalAccuracy}
        onRestart={handleRestart}
        onSaveScore={handleSaveScore}
        isLoggedIn={!!user}
        isScoreSaved={isScoreSaved}
      />
    );
  }

  return (
    <div className="flex flex-col items-center gap-8 w-full" onClick={() => setIsFocused(true)}>
        {(status === 'running' || status === 'finished' || duration) && (
            <div className="flex w-full items-center justify-center gap-4 text-center">
              {duration && (
                <div className="rounded-lg bg-card p-4 shadow-sm border w-32">
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="text-3xl font-bold text-primary transition-all duration-300">
                    {timeLeft}
                  </p>
                </div>
              )}
              <LiveStats wpm={wpm} cpm={cpm} />
            </div>
        )}
        <WordDisplay text={text} userInput={userInput} isFocused={isFocused} status={status}/>
    </div>
  );
}
