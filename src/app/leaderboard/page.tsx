import { db } from '@/lib/firebase';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { LeaderboardTable } from '@/components/leaderboard-table';

export const dynamic = 'force-dynamic';

async function getLeaderboardData() {
  const scoresCol = collection(db, 'scores');
  const q = query(scoresCol, orderBy('wpm', 'desc'), limit(100));
  const scoreSnapshot = await getDocs(q);
  const scores = scoreSnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      userId: data.userId,
      username: data.username || 'Anonymous',
      wpm: data.wpm,
      accuracy: data.accuracy,
      timestamp: data.timestamp.toDate(),
    };
  });
  return scores;
}

export default async function LeaderboardPage() {
  const data = await getLeaderboardData();

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-8 text-4xl font-bold font-headline text-center">Leaderboard</h1>
      <LeaderboardTable data={data} />
    </div>
  );
}
