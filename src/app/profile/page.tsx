'use client';

import { useSession, signOut } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
        <Card className="w-full max-w-md">
          <CardContent className="flex justify-center items-center h-40">
            <p className="text-lg text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Profile</CardTitle>
          <CardDescription className="text-center">
            Welcome to your account dashboard
          </CardDescription>
        </CardHeader>

        {session?.user && (
          <CardContent className="space-y-4">
            <div className="p-6 bg-muted rounded-lg flex flex-col items-center space-y-2">
              <h2 className="text-xl font-medium">{session.user.name}</h2>
              <p className="text-muted-foreground">{session.user.email}</p>
              <div className="text-xs text-muted-foreground bg-background px-2 py-1 rounded-md">
                User ID: {session.user.id}
              </div>
            </div>
          </CardContent>
        )}

        <CardFooter>
          <Button 
            variant="destructive" 
            className="w-full" 
            onClick={() => signOut({ callbackUrl: '/' })}
          >
            Sign Out
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
} 