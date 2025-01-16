'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import axios from 'axios';
import './customScrollbar.css';
import { Reviewer, PMF } from '@/lib/interfaces';

interface ReviewerDialogProps {
  selectedReviewer: Reviewer;
  onClose: () => void;
}

const ReviewerDialog = ({ selectedReviewer, onClose }: ReviewerDialogProps) => (
  <Dialog open={true} onOpenChange={onClose}>
    <DialogContent className="max-w-lg max-h-[85vh] mx-auto p-6 rounded-xl shadow-lg bg-white overflow-y-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        {selectedReviewer.name}'s Performance
      </h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <h3 className="text-lg font-semibold text-green-600">Reviews Done</h3>
          <p className="text-2xl font-bold">{selectedReviewer.reviewsDone || 0}</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <h3 className="text-lg font-semibold text-yellow-600">Reviews Pending</h3>
          <p className="text-2xl font-bold">{selectedReviewer.reviewsPending || 0}</p>
        </div>
      </div>
      <div className="flex justify-center">
        <Button variant="outline" onClick={onClose} className="bg-gray-800 text-white hover:bg-gray-600">
          Close
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);

const ReviewersList = ({ data, id }: { data: PMF[]; id: string }) => {
  const [reviewers, setReviewers] = useState<Reviewer[]>([]);
  const [selectedReviewer, setSelectedReviewer] = useState<Reviewer | null>(null);
  const [activeLoadingId, setActiveLoadingId] = useState<string | null>(null);

  useEffect(() => {
    const transformedReviewers = data.map((pmf) => ({
      id: pmf.recordId,
      name: pmf.name,
      email: pmf.email,
      reviewsPending: 0,
      reviewsDone: 0,
    }));
    setReviewers(transformedReviewers);
  }, [data]);

  const handleReviewerSelect = async (reviewer: Reviewer) => {
    setActiveLoadingId(reviewer.id);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API}/project/get_reviewer_stats_for_project`, {
        project_id: id,
        reviewer_id: reviewer.id,
      });
      const { reviews_done, review_in_progress } = response.data;

      setSelectedReviewer({
        ...reviewer,
        reviewsDone: reviews_done,
        reviewsPending: review_in_progress,
      });
    } catch (error) {
      console.error('Error fetching reviewer stats:', error);
    } finally {
      setActiveLoadingId(null);
    }
  };

  return (
    <div className="flex-1 bg-gray-100 p-10 overflow-y-auto custom-scrollbar-container border-2 rounded-tl-3xl">
      <h1 className="text-2xl font-semibold mb-6">Reviewers</h1>
      <div className="bg-white rounded-xl shadow-md p-6">
        {reviewers.map((reviewer) => (
          <div key={reviewer.id} className="flex items-center py-4">
            <div className="w-1/3 font-semibold text-gray-800">{reviewer.name}</div>
            <div className="w-1/3 text-center text-gray-500">{reviewer.email}</div>
            <div className="w-1/3 text-center">
              <Button
                onClick={() => handleReviewerSelect(reviewer)}
                className="w-1/2"
                disabled={activeLoadingId === reviewer.id}
              >
                {activeLoadingId === reviewer.id ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8v-8H4z"></path>
                    </svg>
                    Loading
                  </span>
                ) : (
                  'Performance'
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {selectedReviewer && (
        <ReviewerDialog
          selectedReviewer={selectedReviewer}
          onClose={() => setSelectedReviewer(null)}
        />
      )}
    </div>
  );
};

export default ReviewersList;
