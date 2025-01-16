'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import { useAuth } from '@clerk/clerk-react';
import { useRouter } from 'next/navigation';

export default function Auth() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(''); // Single state for messages
  const router = useRouter();
  const { user } = useUser();
  const { userId, signOut } = useAuth();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if(!user){
        return;
      }
      try {
        // Step 1: Add Admin
        const addAdminResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API}/admin/add_admin`,
          {
            recordId: userId,
            email: user?.emailAddresses[0]?.emailAddress,
          }
        );

        if (addAdminResponse.status === 200) {
          // Optional: Add a small delay to ensure backend updates the admin status
          const isAdminResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_API}/admin/is_admin`,
            { recordId: userId }
          );
  
          const isAdminData = isAdminResponse.data;
  
          if (isAdminData.status === 'yes') {
            // Show success message before redirecting
            setMessage('You are authorized. Redirecting to adminDashboard...');
            router.push('/adminDashboard')
          } else {
            // If not admin, show error message
            setMessage('Sorry, you are not allowed to access the site.');
          }
        }
        else{
          setMessage('An error occurred. Please try again later.');
        }

        // Step 2: Check if Admin
      
      } catch (error) {
        console.error('Error:', error);
        setMessage('An error occurred. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [userId,user]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {loading ? (
        <div className="text-center">
          <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin mx-auto"></div>
          <p className="mt-4 text-blue-500">Checking your status...</p>
        </div>
      ) : (
        <div className="text-center">
          {message && (
            <div>
              <p
                className={`mb-4 ${
                  message.includes('authorized') ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {message}
              </p>
              {message.includes('not allowed') && (
                <button
                  onClick={async () => {
                    await signOut();
                    router.replace('/');
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Leave Page
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
