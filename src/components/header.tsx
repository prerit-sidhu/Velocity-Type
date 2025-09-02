
'use client';

import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';
import { Button } from './ui/button';
import { useAuth } from '@/context/auth-context';
import { auth } from '@/lib/firebase-client';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function Header() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { toast } = useToast();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut(auth);
      // A small delay to make the transition smoother
      setTimeout(() => {
        router.push('/');
        toast({
          title: 'Logged Out',
          description: 'You have been successfully logged out.',
        });
      }, 1000);
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: 'Error',
        description: 'Failed to log out. Please try again.',
        variant: 'destructive',
      });
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2 ml-2">
            <span className="font-bold font-headline text-lg transition-colors hover:text-accent">VelocityType</span>
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
              <Button onClick={handleLogout} variant="outline" disabled={isLoggingOut}>
                {isLoggingOut && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Logout
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost">
                    <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                    <Link href="/login">Sign Up</Link>
                </Button>
              </>
            ))}
        </div>
      </div>
    </header>
  );
}
