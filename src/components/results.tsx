import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { RefreshCw, Trophy, CheckCircle } from 'lucide-react';

interface ResultsProps {
  wpm: number;
  accuracy: number;
  onRestart: () => void;
  onSaveScore: () => void;
  isLoggedIn: boolean;
  isScoreSaved: boolean;
}

export function Results({ wpm, accuracy, onRestart, onSaveScore, isLoggedIn, isScoreSaved }: ResultsProps) {
  return (
    <Card className="w-full max-w-2xl text-center shadow-2xl animate-in fade-in zoom-in-95 rounded-xl">
      <CardHeader>
        <CardTitle className="font-headline text-4xl">Test Complete!</CardTitle>
        <CardDescription>Here are your results.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 rounded-lg bg-secondary/80">
            <p className="text-sm text-muted-foreground">WPM</p>
            <p className="text-5xl font-bold text-primary">{wpm}</p>
          </div>
          <div className="p-6 rounded-lg bg-secondary/80">
            <p className="text-sm text-muted-foreground">Accuracy</p>
            <p className="text-5xl font-bold text-primary">{accuracy}%</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-center flex-wrap gap-4">
        <Button onClick={onRestart} size="lg" variant="outline">
          <RefreshCw className="mr-2 h-5 w-5" />
          Try Again
        </Button>
        {isLoggedIn && (
           <Button onClick={onSaveScore} size="lg" disabled={isScoreSaved}>
           {isScoreSaved ? (
             <CheckCircle className="mr-2 h-5 w-5" />
           ) : (
             <Trophy className="mr-2 h-5 w-5" />
           )}
           {isScoreSaved ? 'Score Saved' : 'Save to Leaderboard'}
         </Button>
        )}
      </CardFooter>
    </Card>
  );
}
