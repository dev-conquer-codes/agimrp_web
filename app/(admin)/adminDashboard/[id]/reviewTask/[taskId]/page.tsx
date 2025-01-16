'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { TaskData } from '@/lib/interfaces';

const ReviewTask: React.FC = () => {
  const { id, taskId } = useParams();
  const [taskData, setTaskData] = useState<TaskData | null>(null);
  const [reviewFeedback, setReviewFeedback] = useState<string>('');
  const [penalty, setPenalty] = useState<string>('');
const router=useRouter();
  // Fetch task data
  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API}/task/get_task_data`, {
          task_id: taskId,
          project_id: id,
        });

        if (response.data) {
          setTaskData(response.data);
          setReviewFeedback(response.data.review_feedback || ''); // Initialize feedback
        }
      } catch (error) {
        console.error('Error fetching task data:', error);
      }
    };

    fetchTaskData();
  }, [id, taskId]);

  const handleApproveTask = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API}/task/approve_task`, {
        recordId: taskData?.recordId,
        project_id: id,
        user_id: taskData?.user_id,
        review_feedback: reviewFeedback,
      });
      alert('Task Approved!');
      router.back();
      
    } catch (error) {
      console.error('Error approving task:', error);
    }
  };

  const handleRejectTask = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API}/task/reject_task`, {
        recordId: taskData?.recordId,
        project_id: id,
        user_id: taskData?.user_id,
        review_feedback: reviewFeedback,
      });
      alert('Task Rejected!');
      router.back();
    } catch (error) {
      console.error('Error rejecting task:', error);
    }
  };

  const handleRejectWithPenalty = async () => {
  
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API}/task/reject_with_penalty`, {
        recordId: taskData?.recordId,
        project_id: id,
        user_id: taskData?.user_id,
        review_feedback: reviewFeedback,
        
      });
      alert('Task Rejected with Penalty!');
      router.back();
    } catch (error) {
      console.error('Error rejecting task with penalty:', error);
    }
  };

  const handleFeedbackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReviewFeedback(e.target.value);
  };

  if (!taskData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 space-y-6 mx-36">
      <h1 className="text-2xl font-bold text-blue-800 text-center">Task Details</h1>
      <div className="p-6 border rounded-lg shadow-md bg-white relative space-y-6">
  {/* Task Details Section */}
  <div className="space-y-2">
    <p className="text-lg font-semibold">
      <span className="text-gray-600">Task ID:</span> {taskData.recordId}
    </p>
    <p>
      <span className="text-gray-600 font-medium">Project ID:</span> {taskData.project_id}
    </p>
    <p>
      <span className="text-gray-600 font-medium">Status:</span> {taskData.status}
    </p>
    <p>
      <span className="text-gray-600 font-medium">Category:</span> {taskData.category || 'N/A'}
    </p>
    <p>
      <span className="text-gray-600 font-medium">Created On:</span>{' '}
      {new Date(taskData.created).toLocaleString()}
    </p>
  </div>

  {/* Review Feedback Input */}
  <div className="flex items-center space-x-4">
    <label className="font-medium text-gray-700">Review Feedback:</label>
    <input
      type="text"
      className="flex-1 px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
      value={reviewFeedback}
      onChange={handleFeedbackChange}
      placeholder="Enter review feedback here"
    />
  </div>

  {/* Action Buttons */}
  <div className="flex justify-end space-x-4">
    <button
      onClick={handleApproveTask}
      className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md shadow-md hover:bg-green-600"
    >
      Approve Task
    </button>
    <button
      onClick={handleRejectTask}
      className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md shadow-md hover:bg-red-600"
    >
      Reject Task
    </button>
    <button
      onClick={handleRejectWithPenalty}
      className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md shadow-md  hover:bg-red-600"
    >
      Reject with Penalty
    </button>
  </div>
</div>


      <div className="space-y-6">
        {taskData.task_format.map((task, index) => (
          <div key={index} className="p-4 border rounded-md bg-white">
            <h2 className="text-lg font-semibold text-gray-800">{task.title}</h2>
            <p className="text-gray-600">{task.description}</p>

            {task.type === 'Textbox' && (
              <textarea
                className="mt-2 w-full p-2 border rounded-md"
                rows={4}
                value={task.real_data[0] || ''}
                readOnly
              />
            )}

            {task.type === 'Single Select MCQ' && (
              <div className="mt-2">
                {task.options.map((option, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      checked={task.real_data.includes(option)}
                      readOnly
                      className="cursor-pointer"
                    />
                    <label className="text-gray-700">{option}</label>
                  </div>
                ))}
              </div>
            )}

            {task.type === 'Multiple Select MCQ' && (
              <div className="mt-2">
                {task.options.map((option, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={task.real_data.includes(option)}
                      readOnly
                      className="cursor-pointer"
                    />
                    <label className="text-gray-700">{option}</label>
                  </div>
                ))}
              </div>
            )}

            {task.type === 'File' && task.real_data.length > 0 && (
              <div className="mt-2">
                <a
                  href={task.real_data[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View File
                </a>
                <div className="mt-4">
                  {task.real_data[0].endsWith('.jpg') || task.real_data[0].endsWith('.png') ? (
                    <img
                      src={task.real_data[0]}
                      alt="Uploaded File"
                      className="w-full h-auto max-w-md border rounded-md"
                    />
                  ) : task.real_data[0].endsWith('.mp4') || task.real_data[0].endsWith('.webm') ? (
                    <video
                      controls
                      className="w-full h-auto max-w-md border rounded-md"
                    >
                      <source src={task.real_data[0]} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <p className="text-gray-700">File preview not available for this file type.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewTask;
