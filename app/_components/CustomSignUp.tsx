'use client'
import { useSignUp, useAuth } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie'; // Import js-cookie to handle cookies

export default function CustomSignUp() {
  const { signUp, isLoaded } = useSignUp();
  const { signOut, isSignedIn } = useAuth(); // Get signOut function and check if signed in
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Sign out the user and clear cookies if the user is already signed in
    if (isSignedIn) {
      signOut();
      clearCookies(); // Clear the cookies when user signs out
    }
  }, [isSignedIn]);

  // Function to clear all cookies
  const clearCookies = () => {
    const allCookies = Cookies.get(); // Get all cookies
    Object.keys(allCookies).forEach(cookie => Cookies.remove(cookie)); // Remove all cookies
  };

  const handleGoogleSignUp = async () => {
    if (!isLoaded) return;

    try {
      await signUp.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/addData',
        redirectUrlComplete: '/'
      });
    } catch (err) {
      setError('Failed to sign up. Please try again.');
      router.push('/'); // Redirect to the home page if sign-up fails
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 p-8 rounded-md shadow-md w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-2">CREATE AN ACCOUNT</h2>
      <p className="text-gray-600 mb-6">Sign up to get started</p>

      {error && (
        <div className="text-red-500 mb-4">{error}</div>
      )}

      <Button
        onClick={handleGoogleSignUp}
        className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white w-full py-2 rounded-md"
      >
        <Image src="/google-icon.svg" alt="Google Icon" width={20} height={20} />
        Sign up with Google
      </Button>

      <div className="w-full mt-6 border-t border-gray-300"></div>

      <p className="text-center text-gray-600 mt-4">
        Already have an account?{' '}
        <a href='' className="text-blue-500 font-semibold">Sign in</a>
      </p>
    </div>
  );
}
