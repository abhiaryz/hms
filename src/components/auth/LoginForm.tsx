import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push('/profile');
        router.refresh();
      }
    } catch (error) {
      setError('An error occurred during login.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg border-0 rounded-lg">
      <CardHeader className="space-y-2 pb-6">
        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-gray-800 to-black rounded-full flex items-center justify-center mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        <CardTitle className="text-3xl font-extrabold text-center text-gray-900">Welcome Back</CardTitle>
        <CardDescription className="text-center text-gray-600">
          Sign in to your account to access your personal dashboard
        </CardDescription>
      </CardHeader>

      {error && (
        <div className="mx-6 mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-md text-sm">
          {error}
        </div>
      )}

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 border-gray-300 focus:border-black focus:ring-black"
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
              <Link href="#" className="text-xs text-gray-500 hover:text-black">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 border-gray-300 focus:border-black focus:ring-black"
              required
            />
          </div>
          <Button 
            type="submit" 
            className="w-full h-11 bg-black text-white hover:bg-gray-800 text-base rounded-md" 
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in to Account'}
          </Button>
        </form>
      </CardContent>
      
      <CardFooter className="flex flex-col gap-4 pt-2">
        <div className="relative w-full">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">or continue with</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 w-full">
          <Button variant="outline" className="h-11 border-gray-300 text-gray-700 hover:bg-gray-100" type="button">
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.3081 12.2052C20.3081 11.5678 20.253 10.9537 20.1378 10.3613H12.2051V13.5249H16.7841C16.5852 14.4569 16.0339 15.232 15.2038 15.7354V17.7131H17.8577C19.3908 16.2932 20.3081 14.4569 20.3081 12.2052Z" fill="#4285F4"/>
              <path d="M12.2049 20.0009C14.4016 20.0009 16.2297 19.2258 17.8575 17.7133L15.2036 15.7356C14.5048 16.1969 13.5324 16.466 12.2049 16.466C9.93428 16.466 8.01389 14.9227 7.32492 12.8534H4.58472V14.9014C6.20498 17.9573 8.97509 20.0009 12.2049 20.0009Z" fill="#34A853"/>
              <path d="M7.32504 12.8534C7.15564 12.3979 7.06005 11.9103 7.06005 11.4005C7.06005 10.8907 7.15564 10.4031 7.32504 9.94762V7.8996H4.58483C3.95393 9.24928 3.59619 10.7651 3.59619 12.4005C3.59619 14.0359 3.95393 15.5517 4.58483 16.9014L7.32504 14.8534V12.8534Z" fill="#FBBC05"/>
              <path d="M12.2049 6.33499C13.3597 6.33499 14.4016 6.73246 15.2316 7.52267L17.5931 5.16121C16.2242 3.89958 14.4016 3.12451 12.2049 3.12451C8.97509 3.12451 6.20498 5.16813 4.58472 8.22401L7.32492 10.272C8.01389 8.20269 9.93428 6.33499 12.2049 6.33499Z" fill="#EA4335"/>
            </svg>
            Google
          </Button>
          <Button variant="outline" className="h-11 border-gray-300 text-gray-700 hover:bg-gray-100" type="button">
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.8233 4.66547C14.7911 3.77257 15.4999 2.55514 15.4999 1.33771C15.4999 1.16452 15.4871 0.991322 15.4615 0.831055C14.4296 0.882491 13.3081 1.38708 12.3147 2.26719C11.3982 3.05274 10.5818 4.27016 10.5818 5.50038C10.5818 5.68636 10.6074 5.85956 10.6202 5.91099C10.7098 5.92378 10.8378 5.93657 10.9658 5.93657C11.8952 5.93658 12.8817 5.54559 13.8233 4.66547Z"/>
              <path d="M19.0544 12.6195C19.0672 12.542 19.0928 12.3432 19.0928 12.1444C19.0928 10.1549 18.0225 8.68284 16.5993 8.68284C15.1889 8.68284 14.1954 10.1677 14.0802 10.1677C13.965 10.1677 12.8755 8.70844 11.5267 8.70844C9.73656 8.70844 8.60269 10.2324 8.60269 12.0872C8.60269 14.8906 10.7543 18.7545 12.0775 18.7545C13.0194 18.7545 13.3358 18.0841 14.5148 18.0841C15.6743 18.0841 16.0291 18.7545 16.9841 18.7545C18.3074 18.7545 20.1231 15.4971 20.1231 13.4948C20.1231 13.4692 20.1231 13.4562 20.1231 13.4307C19.7555 13.3024 19.0544 12.6195 19.0544 12.6195Z"/>
            </svg>
            Apple
          </Button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-2">
          Don't have an account?{' '}
          <Link href="/register" className="font-medium text-black hover:text-gray-800 hover:underline transition-colors">
            Sign up for free
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
} 