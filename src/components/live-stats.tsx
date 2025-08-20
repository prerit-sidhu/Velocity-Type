'use client';

interface LiveStatsProps {
  wpm: number;
  cpm: number;
}

export function LiveStats({ wpm, cpm }: LiveStatsProps) {
  return (
    <div className="flex w-full items-center justify-center gap-4 text-center">
      <div className="rounded-xl bg-card p-4 shadow-lg border w-32 transition-all hover:shadow-xl hover:-translate-y-1">
        <p className="text-sm text-muted-foreground">WPM</p>
        <p className="text-3xl font-bold text-primary transition-all duration-300">
          {wpm}
        </p>
      </div>
      <div className="rounded-xl bg-card p-4 shadow-lg border w-32 transition-all hover:shadow-xl hover:-translate-y-1">
        <p className="text-sm text-muted-foreground">CPM</p>
        <p className="text-3xl font-bold text-primary transition-all duration-300">
          {cpm}
        </p>
      </div>
    </div>
  );
}
