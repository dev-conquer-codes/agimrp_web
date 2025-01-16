import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PayoutDialog from './PayoutDialog';
import { PayoutData } from '@/lib/interfaces';


export default function Payout() {
  const [payouts, setPayouts] = useState<PayoutData[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState<PayoutData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayouts = async () => {
      setLoading(true);
      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API}/payout/get_all_payout_data_for_admin`);
        setPayouts(response.data); // Assuming response.data is an array of payouts
      } catch (err) {
        console.error('Error fetching payouts:', err);
        setError('Failed to fetch payout data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPayouts();
  }, []);

  const handlePayClick = (payout: PayoutData) => {
    setSelectedPayout(payout);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPayout(null);
  };

  const activeData = payouts.filter((payout) => payout.status === activeTab);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Payouts</h1>
      <div className="flex mb-4 border-b">
        <button
          className={`px-4 py-2 ${activeTab === 'pending' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'completed' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed
        </button>
      </div>
      {loading ? (
        <p>Loading payouts...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : activeData.length === 0 ? (
        <p>No {activeTab} payouts available.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300 text-left">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">User ID</th>
              <th className="border border-gray-300 p-2">Coins</th>
              <th className="border border-gray-300 p-2">Amount in USD</th>
              <th className="border border-gray-300 p-2">PayPal ID</th>
              <th className="border border-gray-300 p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {activeData.map((payout, index) => (
              <tr key={index}>
                <td className="border border-gray-300 p-2">{payout.user_id}</td>
                <td className="border border-gray-300 p-2">{payout.amount}</td>
                <td className="border border-gray-300 p-2">{payout.amount_in_USD}</td>
                <td className="border border-gray-300 p-2">{payout.paypal_id}</td>
                <td className="border border-gray-300 p-2">
                  {activeTab === 'pending' ? (
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      onClick={() => handlePayClick(payout)}
                    >
                      Pay
                    </button>
                  ) : (
                    <span className="text-green-500">Completed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {selectedPayout && (
        <PayoutDialog
          open={openDialog}
          onClose={handleCloseDialog}
          payout={selectedPayout}
          setPayouts={setPayouts}
        />
      )}
    </div>
  );
}
