import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { RefreshCw } from 'lucide-react';

interface ResultsProps {
  wpm: number;
  accuracy: number;
  onRestart: () => void;
}

export function Results({ wpm, accuracy, onRestart }: ResultsProps) {
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
      <CardFooter className="justify-center">
        <Button onClick={onRestart} size="lg">
          <RefreshCw className="mr-2 h-5 w-5" />
          Try Again
        </Button>
      </CardFooter>
    </Card>
  );
}
