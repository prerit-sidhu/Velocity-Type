'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/auth-context';

interface Score {
  id: string;
  userId: string;
  wpm: number;
  accuracy: number;
  timestamp: Date;
}

interface LeaderboardTableProps {
  data: Score[];
}

function getInitials(email: string) {
    if (!email) return 'U';
    return email.substring(0, 2).toUpperCase();
}


export function LeaderboardTable({ data }: LeaderboardTableProps) {
  const { user } = useAuth();

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-lg">
      <Table>
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
                    {/* Placeholder for user avatar */}
                    <AvatarFallback>{getInitials(score.userId)}</AvatarFallback>
                  </Avatar>
                  <span className="truncate">{score.userId.substring(0, 12)}...</span>
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
