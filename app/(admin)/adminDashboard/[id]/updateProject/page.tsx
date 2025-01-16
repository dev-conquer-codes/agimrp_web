'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import ProjectForm from './_components/Step1';
import MainContainer from './_components/Step2';
import { useUser } from '@clerk/nextjs';
import { Instruction, Data, ProjectData, ProjectFormData } from '@/lib/interfaces';

export default function TwoStepForm() {
  const { user } = useUser();
  const [step, setStep] = useState(1);
  const [initialData, setInitialData] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  // Fetch project data when the component mounts
  useEffect(() => {
    const fetchProjectData = async () => {
      const projectId = 'your_project_id'; // Replace with the actual project ID
      try {
        setLoading(true);
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API}/project/get_project_data`, {
          project_id: id,
        });
        if (response.status === 200) {
          setInitialData(response.data);
        }
      } catch (err) {
        console.error('Error fetching project data:', err);
        setError('Failed to fetch project data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, []);

  const handleProjectFormSubmit = (data: ProjectData) => {
    console.log(data);
    setInitialData((prevData:any) => ({
      ...prevData,
      project_name: data.project_name,
      description: data.description,
      coins_per_task: data.coins_per_task,
      quiz_threshold: data.quiz_threshold,
      project_type: data.project_type,
      categories: data.categories,
      instructions: data.instructions,
    }));
    
    setStep(2);
  };

  const handleCreateProject = async (data: Data) => {
    console.log(data);
    const payload = {
      project_name: initialData?.project_name || '',
      description: initialData?.description || '',
      coins_per_task: initialData?.coins_per_task || null,
      quiz_threshold: initialData?.quiz_threshold || 0,
      project_type: initialData?.project_type || null,
      categories: initialData?.categories || [],
      instructions: initialData?.instructions || [],
      
      task_format: data.answer_format,
      quiz_data: data.quizzes,
      recordId:initialData?.recordId
    };
    console.log(payload);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API}/project/update_project_admin`, payload);
      if (response.status === 200) {
        alert('Project Updated successfully!');
        router.replace(`/adminDashboard/${id}`);
      }
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project. Please try again.');
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  if (loading) return <p>Loading project data...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      {step === 1 && initialData && (
        <ProjectForm initialData={initialData} onNext={handleProjectFormSubmit} />
      )}
      {step === 2 && initialData && (
        <MainContainer initialData={initialData} onCreate={handleCreateProject} goBack={handleBack} />
      )}
    </div>
  );
}
