'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import ProjectForm from './_components/Step1';
import MainContainer from './_components/Step2';
import { useUser } from '@clerk/nextjs';
import { Instruction, Data } from '@/lib/interfaces';

export interface ProjectFormData {
  projectType: 'single' | 'multiple' | null; // Type of the project
  projectName: string; // Name of the project
  description: string; // Description of the project
  coinsPerTask: number | null; // Coins assigned per task
  instructions: Instruction[]; // List of instructions
  threshold: number; // Threshold value between 0 and 1
  categories: { 
    category: string; 
    no_of_tasks: number; 
  }[]; // Categories and total tasks per category
}

export interface ProjectData {
  project_name: string;
  description: string;
  coins_per_task: number | null;
  threshold: number;
  project_type: 'single' | 'multiple' | null;
  categories: { 
    category: string; 
   no_of_tasks: number; 
  }[];
  instructions: Instruction[];
}

export default function TwoStepForm() {
  const { user } = useUser();
  const [step, setStep] = useState(1);
  const [projectData, setProjectData] = useState<ProjectData>({
    project_name: '',
    description: '',
    coins_per_task: null,
    threshold: 0,
    project_type: null,
    categories: [],
    instructions: [],
  });
  const router = useRouter();

  const handleProjectFormSubmit = (data: ProjectFormData) => {
    setProjectData((prevData) => ({
      ...prevData,
      project_name: data.projectName,
      description: data.description,
      coins_per_task: data.coinsPerTask,
      threshold: data.threshold,
      project_type: data.projectType,
      categories: data.categories,
      instructions: data.instructions,
    }));
    setStep(2);
  };

  const handleCreateProject = async (data: Data) => {
    const payload = {
      project_name: projectData.project_name,
      description: projectData.description,
      coins_per_task: projectData.coins_per_task,
      quiz_threshold: projectData.threshold,
      project_type: projectData.project_type,
      categories: projectData.categories,
      instructions: projectData.instructions,
     
      task_format: data.answer_format,
      quiz_data:data.quizzes
    };
 console.log(payload);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API}/project/create_project`, payload);
      if (response.status === 200) {
        alert('Project created successfully!');
        router.replace('/adminDashboard');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project. Please try again.');
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  return (
    <div>
      {step === 1 && <ProjectForm onNext={handleProjectFormSubmit} />}
      {step === 2 && (
        <MainContainer onCreate={handleCreateProject} goBack={handleBack} />
      )}
    </div>
  );
}
