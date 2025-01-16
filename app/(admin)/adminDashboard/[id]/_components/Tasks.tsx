import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Task } from "@/lib/interfaces";



interface TaskResponse {
  task_data: Task[];
}

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<string>("unapproved");
  const { id } = useParams(); // Project ID from route parameters
  const router = useRouter(); // Router for navigation

  useEffect(() => {
    // Fetch tasks from the API
    const fetchTasks = async () => {
      try {
        const response = await axios.post<TaskResponse>(
          `${process.env.NEXT_PUBLIC_API}/task/get_all_project_tasks`,
          { project_id: id }
        );
        if (response.data && response.data.task_data) {
          setTasks(response.data.task_data);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [id]);

  // Filter tasks based on the active tab
  const filteredTasks = tasks.filter((task) => {
    if (activeTab === "All") return true;
 
    return task.status === activeTab;
  });

  return (
    <div className="p-4">
      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        {["unapproved","rejected_with_penalty", "rejected", "approved","All", ].map((tab) => (
          <button
            key={tab}
            className={`px-6 py-2 rounded-md text-sm font-medium ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab=='All' ? 'All' :tab=='rejected_with_penalty' ?'Rejected With Penalty' :tab=='unapproved'?'Unapproved':tab=='rejected'?'Rejected':'Approved' }
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTasks.map((task) => (
          <div
            key={task.recordId}
            onClick={() => router.push(`/adminDashboard/${id}/reviewTask/${task.recordId}`)} // Navigate on click
            className="p-6 border rounded-lg shadow bg-white cursor-pointer hover:shadow-lg transition"
          >
            <h3 className="text-lg font-bold text-blue-800">
              Task ID: {task.recordId || "N/A"}
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              <strong>Status:</strong> {task.status || "N/A"}
            </p>
            <p className="mt-1 text-sm text-gray-600">
              <strong>Feedback:</strong> {task.review_feedback || "No feedback"}
            </p>
            <p className="mt-1 text-sm text-gray-600">
              <strong>Category:</strong> {task.category || "N/A"}
            </p>
            <p className="mt-1 text-sm text-gray-600">
              <strong>Created On:</strong> {task.created || "N/A"}
            </p>
          </div>
        ))}
        {filteredTasks.length === 0 && (
          <p className="text-gray-500 col-span-full text-center">
            No tasks available for this category.
          </p>
        )}
      </div>
    </div>
  );
};

export default Tasks;
