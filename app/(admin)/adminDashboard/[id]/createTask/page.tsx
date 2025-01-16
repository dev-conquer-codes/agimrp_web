'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';

import { TaskData } from '@/lib/interfaces';
import Navbar from '../../_components/Navbar';
import Sidebar from '../../_components/Sidebar';
import CreateTask from './_components/CreateTask';
import ProjectManager from '../../_components/ProjectManager';
import FlagsList from '../../_components/FlagsList';
import FreelancerList from '../../_components/FreelancerList';
import ClientList from '../../_components/ClientList';

const Overview: React.FC = () => {
  const [selectedList, setSelectedList] = useState<'projects' |  'flags' >('projects');
  const [taskData, setTaskData] = useState<TaskData | null>(null);
  const [loading, setLoading] = useState(true);

  const params = useParams();
  const { id } = params;

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API}/project/get_project_data`,{
          project_id:id
        });
        if (response.status === 200) {
          const selectedProject  = response.data;
        
          
          if (selectedProject) {
            setTaskData({
              name: selectedProject.project_name || '',
              question_format: selectedProject.question_format || [],
              answer_format: selectedProject.answer_format || [],
              instructions: selectedProject.instructions || [],
            });
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching project data:', error);
        setLoading(false);
      }
    };

    if (id) {
      fetchProjectData();
    }
  }, [id]);

  return (
    <div className="flex flex-col h-screen">
      {loading && <div className="loading-bar"></div>}

      <div className="flex-shrink-0">
        <Navbar />
      </div>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar selected={selectedList} onSelect={(list: any) => setSelectedList(list)} />

        <div className="flex-1 overflow-y-auto">
          {selectedList === 'projects' && <CreateTask taskData={taskData} />}
        
          {selectedList === 'flags' && <FlagsList />}
   
        
        </div>
      </div>

      <style jsx>{`
        .loading-bar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, #ff4d4d, #ff884d, #4dff88, #4d88ff, #ff4d4d);
          background-size: 200% auto;
          animation: rayLoading 1.5s linear infinite;
          z-index: 10;
        }

        @keyframes rayLoading {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </div>
  );
};

export default Overview;
