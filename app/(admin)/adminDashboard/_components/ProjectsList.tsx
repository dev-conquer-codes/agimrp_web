'use client';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Project, ProjectData } from '@/lib/interfaces';
import axios from 'axios';
import './customScrollbar.css';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';

const ProjectsList = () => {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true); // Loading state for fetching projects
  const [createLoading, setCreateLoading] = useState(false); // Loading state for "Create Project" button
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null); // Active project for border animation
  const containerRef = useRef<HTMLDivElement>(null);
  const { isSignedIn, userId } = useAuth();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API}/project/get_all_projects_for_admin`,
          {
            user_id: userId, // Request body
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        const data = response.data;
        console.log(data);
        setProjects(data || []);
        
        // if (data.status === 'Projects retrieved successfully') {
        //  // Safeguard against `projects` being undefined
        // } else {
        //   setProjects([]); // Clear projects list if the API status is not successful
        // }
      } catch (error) {
        console.error('Failed to fetch projects:', error); // Only log errors when the request fails
        setProjects([]); // Ensure the projects list is empty in case of error
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleCreateProject = () => {
    setCreateLoading(true);
    setTimeout(() => {
      router.push('/adminDashboard/createProject');
    }, 500); // 500ms delay to show the loader before navigation
  };

  const handleProjectClick = (recordId: string) => {
    setActiveProjectId(recordId);
    router.push(`/adminDashboard/${recordId}`);
  };

  return (
    <div
      className="flex-1 bg-gray-100 p-5 overflow-y-auto border-2 rounded-tl-3xl custom-scrollbar-container"
      ref={containerRef}
    >
      {/* Ray Loader Animation */}
      {loading && <div className="loading-bar"></div>}

      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Button
          onClick={handleCreateProject}
          className="bg-black text-white px-4 py-2 rounded-xl flex items-center justify-center"
          disabled={createLoading}
        >
          {createLoading && <Loader2 className="animate-spin h-5 w-5 mr-2" />}
          {createLoading ? 'Redirecting...' : 'Create Project'}
        </Button>
      </header>

      {/* Projects List */}
      <div className="space-y-6">
        {projects.length > 0 ? (
          projects.map((project) => (
            <button
              key={project.recordId}
              className={`p-6 bg-white rounded-3xl shadow-md w-full text-left transition-transform transform hover:border-b-4 border-blue-300 shadow-3xl relative overflow-hidden ${
                activeProjectId === project.recordId ? 'border-animation' : ''
              }`}
              onClick={() => handleProjectClick(project.recordId)}
            >
              <h2 className="text-xl font-semibold mb-2">{project.project_name}</h2>
              {/* <p className="text-sm text-gray-500">
                <span>Project ID: {project.recordId}</span> <br />
                <span>Project Manager: {project.pm_id}</span> <br />
              </p> */}
              <p className="mt-4 text-gray-700">{project.description}</p>
            </button>
          ))
        ) : !loading ? ( // Only show "No projects found" if not loading
          <p className="text-center text-gray-500">No projects found</p>
        ) : null}
      </div>
    </div>
  );
};

export default ProjectsList;
