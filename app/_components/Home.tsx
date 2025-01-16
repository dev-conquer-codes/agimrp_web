'use client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import React, { useState } from 'react';
import Logo from './Logo';
import { Loader2 } from 'lucide-react'; // Import the Loader2 icon from lucide-react

const AuthComponent = () => {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false); // State to manage loading

  const handleGetStarted = async() => {
    setIsLoading(true); // Start loading
    try {
      await router.push('/adminDashboard'); // Perform navigation
    } finally {
      setIsLoading(false); // Ensure loading state is reset
    } // Stop loading after navigation completes
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Navbar with Logo */}
      <div className="flex items-center justify-between p-5">
        <Logo />
        <div className="flex gap-4">
          {/* Add Login and Signup buttons here if needed */}
        </div>
      </div>
      <div className="w-full h-0.5 bg-gray-300"></div>

      {/* Main content */}
      <div className="flex-1 flex flex-col justify-center items-center px-24 gap-5">
        <div className="text-blue-500 font-bold text-lg">
          WELCOME TO AGIMRP ADMIN PANEL
        </div>
        <h1 className="text-black font-bold text-4xl mt-2 text-center">
          Step into the future of Human Data, <br />
          Accurate labelling and Data Collection in one app!
        </h1>
        {/* <p className="text-gray-600 mt-4 text-center">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
        </p> */}
        
        {/* Get Started Button with Loader */}
        <Button className="mt-6 w-32 bg-blue-500 text-white flex items-center justify-center" onClick={handleGetStarted} disabled={isLoading}>
          {isLoading ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : null}
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default AuthComponent;
