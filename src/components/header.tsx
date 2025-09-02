'use client';

import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';
import { Button } from './ui/button';
import { useAuth } from '@/context/auth-context';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export function Header() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2 ml-2">
            <span className="font-bold font-headline text-lg">VelocityType</span>
          </Link>
          <nav className="flex items-center gap-1 text-sm">
             <Button variant="ghost" asChild>
                <Link href="/leaderboard">Leaderboard</Link>
            </Button>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2 mr-2">
          <ThemeToggle />
          {!loading &&
            (user ? (
              <Button onClick={handleLogout} variant="outline">
                Logout
              </Button>
            ) : (
              <Button asChild variant="outline">
                <Link href="/login">Login</Link>
              </Button>
            ))}
        </div>
      </div>
    </header>
  );
}
