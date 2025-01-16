'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Navbar from '../_components/Navbar';
import Sidebar from '../_components/Sidebar';
import FlagsList from '../_components/FlagsList';
import ProjectOverview from './_components/ProjectOverview';
import { ProjectData } from '@/lib/interfaces';
import './_components/customScrollbar.css';
import Payout from '../_components/Payout';

const Overview: React.FC = () => {
  const [selectedList, setSelectedList] = useState<'projects' | 'flags' | 'payout'>('projects');
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);

  const params = useParams();
  const { id } = params;

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API}/project/get_project_data`,
          {
            project_id: id,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );

        if (response.status === 200) {
          const projectDatas = response.data;

          console.log('Fetched Project Data:', projectDatas);

          if (projectDatas) {
            setProjectData({
              project_name: projectDatas.project_name,
              description: projectDatas.description,
              coins_per_task: projectDatas.coins_per_task ,
              quiz_threshold: projectDatas.quiz_threshold,
              project_type: projectDatas.project_type,
              categories: projectDatas.categories,
              instructions: projectDatas.instructions,
              question_format: projectDatas.question_format,
              task_format: projectDatas.task_format,
              quiz_data:projectDatas.quiz_data,
              recordId:projectDatas.record_id
            });
          
          }
        }
      } catch (error) {
        console.error('Error fetching project data:', error);
      } finally {
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
        <Sidebar
          selected={selectedList}
          onSelect={(list) => setSelectedList(list)}
        />

        <div className="flex-1 overflow-y-auto custom-scrollbar-container">
          {!loading && selectedList === 'projects' && projectData ? (
            <ProjectOverview project={projectData} id={id as string} />
          ) : selectedList === 'flags' ? (
            <FlagsList />
          ) :
          selectedList === 'payout' ? (
            <Payout />
          ) :(
            !loading && <p className="text-center mt-8 text-gray-500">No data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Overview;
