'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/auth-context';

interface Score {
  id: string;
  userId: string;
  username: string;
  wpm: number;
  accuracy: number;
  timestamp: Date;
}

interface LeaderboardTableProps {
  data: Score[];
}

function getInitials(name: string) {
    if (!name) return 'A';
    const names = name.split(' ');
    if (names.length > 1) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
}


export function LeaderboardTable({ data }: LeaderboardTableProps) {
  const { user } = useAuth();

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-lg">
      <Table>
        {data.length === 0 && (
            <TableCaption>No scores recorded yet. Be the first!</TableCaption>
        )}
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Rank</TableHead>
            <TableHead>User</TableHead>
            <TableHead className="text-right">WPM</TableHead>
            <TableHead className="text-right">Accuracy</TableHead>
            <TableHead className="text-right">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((score, index) => (
            <TableRow key={score.id} className={score.userId === user?.uid ? 'bg-accent/50' : ''}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{getInitials(score.username)}</AvatarFallback>
                  </Avatar>
                  <span className="truncate font-medium">{score.username}</span>
                </div>
              </TableCell>
              <TableCell className="text-right font-bold text-primary text-lg">{score.wpm}</TableCell>
              <TableCell className="text-right">{score.accuracy}%</TableCell>
              <TableCell className="text-right">{score.timestamp.toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
