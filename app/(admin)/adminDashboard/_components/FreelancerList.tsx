'use client';

import { useState, useEffect } from 'react';
import './customScrollbar.css';

import { Loader2, Loader2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Shadcn Button Component
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface Freelancer {
  recordId: string;
  name: string;
  email: string;
}

const FreelancerList = () => {
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingDelete, setLoadingDelete] = useState<string | null>(null); // Tracks which item is being deleted
  const router = useRouter();

  useEffect(() => {
    const fetchFreelancers = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API}/user/fetch_users_by_role?role=freelancer`
        );

        // Handle response data
        setFreelancers(response.data);
      } catch (error: any) {
        console.error('Error fetching freelancers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFreelancers();
  }, []);

  const handleDelete = async (recordId: string) => {
    setLoadingDelete(recordId); // Set the current deleting item
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API}/project/delete_freelancer?recordId=${recordId}`
      );

      // Update the state to remove the deleted freelancer
      setFreelancers((prev) =>
        prev.filter((freelancer) => freelancer.recordId !== recordId)
      );
    } catch (error) {
      console.error('Error deleting freelancer:', error);
    } finally {
      setLoadingDelete(null); // Reset loading state
    }
  };

  return (
    <div className="flex-1 bg-gray-100 p-10 overflow-y-auto custom-scrollbar-container border-2 rounded-tl-3xl">
      <h1 className="text-2xl font-semibold mb-6">Workers</h1>
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="animate-spin h-12 w-12 text-gray-500" />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="min-w-full">
            {freelancers.length > 0 ? (
              freelancers.map((freelancer, index) => (
                <div key={freelancer.recordId} className="flex flex-col">
                  <div className="flex items-center py-4">
                    {/* Index */}
                    <div className="text-gray-600 w-8">{index + 1}</div>

                    {/* Name and email */}
                    <div className="flex-grow flex">
                      <div className="w-1/3 font-semibold text-gray-800">
                        {freelancer.name}
                      </div>
                      <div className="w-1/3 text-center text-gray-500">
                        {freelancer.email}
                      </div>
                    </div>

                    {/* Delete button */}
                    <Button
                      variant="destructive"
                      size="sm"
                      className="ml-auto"
                      onClick={() => handleDelete(freelancer.recordId)}
                      disabled={loadingDelete === freelancer.recordId}
                    >
                      {loadingDelete === freelancer.recordId ? (
                        <Loader2Icon className="animate-spin" />
                      ) : (
                        'Delete'
                      )}
                    </Button>
                  </div>
                  <div className="ml-8">
                    <hr className="border-gray-200" />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No data</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FreelancerList;
