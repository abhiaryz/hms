import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Next.js Authentication</CardTitle>
          <CardDescription>
            Secure authentication with Next.js, MongoDB and NextAuth
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Link href="/login" className="w-full">
            <Button className="w-full" size="lg">
              Login
            </Button>
          </Link>
          
          <Link href="/register" className="w-full">
            <Button variant="outline" className="w-full" size="lg">
              Register
            </Button>
          </Link>
        </CardContent>
        
        <CardFooter className="flex flex-col items-center text-center text-sm text-muted-foreground">
          <p>Secure, modern authentication system</p>
          <p>Built with TypeScript, Next.js, and MongoDB</p>
        </CardFooter>
      </Card>
    </main>
  );
} 