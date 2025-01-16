'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import './customScrollbar.css';

import { Flag } from '@/lib/interfaces';
import { Loader2 } from 'lucide-react';
import axios from 'axios';

const FlagsList = () => {
  const [newFlags, setNewFlags] = useState<Flag[]>([]);
  const [acknowledgedFlags, setAcknowledgedFlags] = useState<Flag[]>([]);
  const [showNewFlags, setShowNewFlags] = useState(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFlags = async () => {
    try {
      const [acknowledgedResponse, newResponse] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API}/flag/get_all_acknowledged_flags`),
        fetch(`${process.env.NEXT_PUBLIC_API}/flag/get_all_new_flags`),
      ]);

      const acknowledgedData: Flag[] = await acknowledgedResponse.json();
      const newData: Flag[] = await newResponse.json();

      setAcknowledgedFlags(acknowledgedData);
      setNewFlags(newData);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlags(); // Initial fetch

    // Polling every 5 seconds
    const interval = setInterval(() => {
      fetchFlags();
    }, 5000);

    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

 

  const acknowledgeFlag = async (id: string) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/flag/acknowledge_flag`,
        { recordId: id }, // Data body
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      console.log(response.data);
  
      // Move the acknowledged flag from newFlags to acknowledgedFlags
      setNewFlags((prevFlags) => prevFlags.filter((flag) => flag.recordId !== id));
      setAcknowledgedFlags((prevFlags) => {
        const acknowledgedFlag = prevFlags.find((flag) => flag.recordId === id);
        return acknowledgedFlag
          ? [...prevFlags, { ...acknowledgedFlag, acknowledged: true }]
          : prevFlags;
      });
    } catch (error: any) {
      setError(error.response?.data?.message || error.message);
    }
  };
  
  const flagsToDisplay = showNewFlags ? newFlags : acknowledgedFlags;

  if (loading) return <div className="flex items-center justify-center h-full">
  <Loader2 className="animate-spin h-12 w-12 text-gray-500" />
</div>;

  return (
    <div className="flex-1 bg-gray-100 p-10 overflow-y-auto border-2 rounded-tl-3xl custom-scrollbar-container">
      <header className="flex flex-col justify-center mb-8 gap-5">
        <h1 className="text-2xl font-bold">Flags</h1>
        <div className="space-x-2">
          <Button
            className={`px-4 py-2 rounded-full w-36 ${showNewFlags ? 'bg-black text-white' : 'bg-white text-black border hover:text-white'}`}
            onClick={() => setShowNewFlags(true)}
          >
            New Flags
          </Button>
          <Button
            className={`px-4 py-2 rounded-full w-36 ${!showNewFlags ? 'bg-black text-white' : 'bg-white text-black border hover:text-white'}`}
            onClick={() => setShowNewFlags(false)}
          >
            Acknowledged Flags
          </Button>
        </div>
      </header>

      <div className="space-y-6">
        {flagsToDisplay.length > 0 ? (
          flagsToDisplay.map((flag) => (
            <div key={flag.recordId} className="p-6 bg-white rounded-3xl shadow-md">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Flag ID: {flag.recordId}</h2>
                <Button
                  className={`ml-4 ${flag.acknowledged ? 'bg-gray-200 text-gray-500' : 'bg-blue-500 text-white'} rounded-full`}
                  onClick={() => acknowledgeFlag(flag.recordId)}
                  disabled={flag.acknowledged}
                >
                  {flag.acknowledged ? 'Acknowledged' : 'Acknowledge'}
                </Button>
              </div>
              <p className="mt-4 text-gray-700">{flag.feedback}</p>
            </div>
          ))
        ) : (
          <div>No data available</div>
        )}
      </div>
    </div>
  );
};

export default FlagsList;
