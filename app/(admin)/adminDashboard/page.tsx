'use client';
import { useAuth, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AdminPage from './_components/Admin';
import axios from 'axios';

export default function Dashboard() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(''); // Single state for messages
  const router = useRouter();
  const { user } = useUser();
  const { userId,signOut } = useAuth();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
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
          // Step 2: Check if Admin
          const isAdminResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_API}/admin/is_admin`,
            { recordId: userId }
          );

          const isAdminData = isAdminResponse.data;

          if (isAdminData.status === 'yes') {
            setIsAuthorized(true);
          } else {
            setMessage('Sorry, you are not allowed to access this page.');
          }
        } else {
          setMessage('An error occurred. Please try again later.');
        }
      } catch (error) {
        console.error('Error:', error);
        setMessage('An error occurred. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [userId, user]);

  if (loading) {
    // Show a loader while checking authorization
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin mx-auto"></div>
          <p className="mt-4 text-blue-500">Checking your status...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    // Show error message if not authorized
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <p className="text-red-500">{message}</p>
          <button
            onClick={async() => { await signOut();  router.replace('/')}}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Go Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Render AdminPage if authorized
  return (
    <div>
      <AdminPage />
    </div>
  );
}
