'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import axios from 'axios';
import './customScrollbar.css';

import { Tasker,PMF } from '@/lib/interfaces';
const TaskerDialog = ({ selectedTasker, onClose }: { selectedTasker: Tasker; onClose: () => void }) => (
  <Dialog open={true} onOpenChange={onClose}>
    <DialogContent className="max-w-lg max-h-[85vh] mx-auto p-6 rounded-xl shadow-lg bg-white overflow-y-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        {selectedTasker.name}'s Performance
      </h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <h3 className="text-lg font-semibold text-blue-600">Tasks in Progress</h3>
          <p className="text-2xl font-bold">{selectedTasker.tasksInProgress || 0}</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <h3 className="text-lg font-semibold text-green-600">Tasks Done</h3>
          <p className="text-2xl font-bold">{selectedTasker.tasksDone || 0}</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <h3 className="text-lg font-semibold text-yellow-600">Reworks in Progress</h3>
          <p className="text-2xl font-bold">{selectedTasker.reworksInProgress || 0}</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <h3 className="text-lg font-semibold text-purple-600">Reworks Done</h3>
          <p className="text-2xl font-bold">{selectedTasker.reworksDone || 0}</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 text-center col-span-2">
          <h3 className="text-lg font-semibold text-indigo-600">Tasks Approved</h3>
          <p className="text-2xl font-bold">{selectedTasker.tasksApproved || 0}</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 text-center col-span-2">
          <h3 className="text-lg font-semibold text-teal-600">Quality Score</h3>
          <p className="text-2xl font-bold">{selectedTasker.qualityScore || 0}%</p>
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

const TaskersList = ({ data, id }: { data: PMF[]; id: string }) => {
  const [taskers, setTaskers] = useState<Tasker[]>([]);
  const [selectedTasker, setSelectedTasker] = useState<Tasker | null>(null);
  const [loading, setLoading] = useState<string | null>(null); // Track loading for each tasker by id

  useEffect(() => {
    // Transform PMF data into Tasker structure with default values.
    const transformedTaskers = data.map((pmf) => ({
      id: pmf.recordId,
      name: pmf.name,
      email: pmf.email,
      tasksInProgress: 0,
      tasksDone: 0,
      reworksInProgress: 0,
      reworksDone: 0,
      tasksApproved: 0,
      qualityScore: 0,
    }));
    setTaskers(transformedTaskers);
  }, [data]);

  const handleTaskerSelect = async (tasker: Tasker) => {
    setLoading(tasker.id); // Set loading for the current tasker
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API}/project/get_tasker_stats_for_project`, {
        project_id: id,
        tasker_id: tasker.id,
      });
      const {
        tasks_in_progress,
        tasks_done,
        reworks_in_progress,
        reworks_done,
        approved,
        quality_score,
      } = response.data;

      setSelectedTasker({
        ...tasker,
        tasksInProgress: tasks_in_progress,
        tasksDone: tasks_done,
        reworksInProgress: reworks_in_progress,
        reworksDone: reworks_done,
        tasksApproved: approved,
        qualityScore: quality_score,
      });
    } catch (error) {
      console.error('Error fetching tasker stats:', error);
    } finally {
      setLoading(null); // Clear loading after fetching data
    }
  };

  return (
    <div className="flex-1 bg-gray-100 p-10 overflow-y-auto custom-scrollbar-container border-2 rounded-tl-3xl">
      <h1 className="text-2xl font-semibold mb-6">Taskers</h1>
      <div className="bg-white rounded-xl shadow-md p-6">
        {taskers.map((tasker) => (
          <div key={tasker.id} className="flex items-center py-4">
            <div className="w-1/3 font-semibold text-gray-800">{tasker.name}</div>
            <div className="w-1/3 text-center text-gray-500">{tasker.email}</div>
            <div className="w-1/3 text-center">
              <Button
                onClick={() => handleTaskerSelect(tasker)}
                className="w-1/2"
                disabled={loading === tasker.id} // Disable button while loading
              >
                {loading === tasker.id ? 'Loading...' : 'Performance'} {/* Show loading text */}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {selectedTasker && (
        <TaskerDialog
          selectedTasker={selectedTasker}
          onClose={() => setSelectedTasker(null)}
        />
      )}
    </div>
  );
};

export default TaskersList;
