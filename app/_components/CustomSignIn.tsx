'use client';
import { useSignIn } from '@clerk/nextjs';
import { Button } from '@/components/ui/button'; // Adjust import according to your structure
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CustomSignIn() {
  const { signIn, isLoaded } = useSignIn();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    if (!isLoaded) return;
    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/auth-callback',
        redirectUrlComplete: '/auth-callback',
      });
    } catch (err) {
      setError('Failed to sign in. Please try again or sign up if you do not have an account.');
      router.push('/');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 p-8 rounded-md shadow-md w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-2">WELCOME BACK!</h2>
      <p className="text-gray-600 mb-6">Please sign in to continue</p>

      {error && (
        <div className="text-red-500 mb-4">{error}</div>
      )}

      <Button
        onClick={handleGoogleSignIn}
        className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white w-full py-2 rounded-md"
      >
        <Image src="/google-icon.svg" alt="Google Icon" width={20} height={20} />
        Sign in with Google
      </Button>

      <div className="w-full mt-6 border-t border-gray-300"></div>

      <p className="text-center text-gray-600 mt-4">
        Don’t have an account?{' '}
        <a href="/" className="text-blue-500 font-semibold">Sign up</a>
      </p>
    </div>
  );
}
