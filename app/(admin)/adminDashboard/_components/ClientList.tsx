'use client';
import { useState, useEffect } from 'react';
import './customScrollbar.css';

import { Loader2 } from 'lucide-react';

import axios from 'axios';

interface Freelancer {
  recordId: string;
  name: string;
  email: string;
}

const ClientList = () => {
  const [projectManagers, setProjectManagers] = useState<Freelancer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectManagers = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API}/user/fetch_users_by_role?role=client`
        );

        // Handle the response data
        setProjectManagers(response.data);
      } catch (error: any) {
        console.error('Error fetching project managers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectManagers();
  }, []);

  const handleDelete = (recordId: string) => {
    // Placeholder for delete logic
    console.log(`Delete project manager with ID: ${recordId}`);
  };

  return (
    <div className="flex-1 bg-gray-100 p-10 overflow-y-auto custom-scrollbar-container border-2 rounded-tl-3xl">
      <h1 className="text-2xl font-semibold mb-6">Client</h1>
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="animate-spin h-12 w-12 text-gray-500" />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="min-w-full">
            {projectManagers.length > 0 ? (
              projectManagers.map((manager, index) => (
                <div key={manager.recordId} className="flex flex-col">
                  <div className="flex items-center py-4">
                    {/* Index */}
                    <div className="text-gray-600 w-8">{index + 1}</div>

                    {/* Name and email */}
                    <div className="flex-grow flex">
                      <div className="w-1/3 font-semibold text-gray-800">
                        {manager.name}
                      </div>
                      <div className="w-1/3 text-center text-gray-500">
                        {manager.email}
                      </div>
                    </div>

                    {/* Delete button */}
                    {/* <Button
                      variant="destructive"
                      size="sm"
                      className="ml-auto"
                      onClick={() => handleDelete(manager.recordId)}
                    >
                      Delete
                    </Button> */}
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

export default ClientList;
