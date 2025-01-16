'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { TaskData } from '@/lib/interfaces';
import UploadDialog from './UploadDialog';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';

interface TaskDataProps {
  taskData: TaskData | null;
}

const CreateTask: React.FC<TaskDataProps> = ({ taskData }) => {
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedQuestion, setSelectedQuestion] = useState<{ id: number; type: string } | null>(null);
  const [questionResponses, setQuestionResponses] = useState<{ [key: number]: { type: string; response: string } }>({});
  const [screenEmpty, setScreenEmpty] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true); // State for page loading

  const params = useParams();
  const router = useRouter();
  const { id: projectId } = params; // Extracting the project ID from params

  useEffect(() => {
    // Simulate page loading for demo purposes
    const timeout = setTimeout(() => {
      setIsPageLoading(false);
    }, 1000);

    if (taskData?.question_format.length === 0) {
      setScreenEmpty(true);
    } else {
      setScreenEmpty(false);
    }

    return () => clearTimeout(timeout);
  }, [taskData]);

  const handleOpenDialog = (type: string, questionId: number) => {
    setSelectedQuestion({ id: questionId, type });
    setIsDialogOpen(true);
  };

  const handleSaveResponse = (response: string, questionId: number) => {
    setQuestionResponses((prev) => ({
      ...prev,
      [questionId]: { type: selectedQuestion?.type ?? 'Text', response },
    }));
    setIsDialogOpen(false);
  };

  const handleCreateTask = async () => {
    if (!taskData || !projectId) return;

    const questions = taskData.question_format?.map((question) => ({
      title: question.title,
      description: question.description,
      type: question.type,
      real_data: questionResponses[question.id]?.response || '', // Use the response if available
    }));

    const payload = {
      project_id: projectId,
      questions,
      answers: taskData.answer_format,
      instructions: taskData.instructions,
      review_feedback: '',
    };

    setLoading(true);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API}/task/submit_task`, payload);
      console.log('Task created successfully:', response.data);
      router.back();
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setLoading(false);
    }
  };

  if (isPageLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
      </div>
    );
  }

  if (screenEmpty) {
    return <div className="text-center mt-10 text-gray-500 text-xl">No data Available</div>;
  }

  return (
    <div className="container mx-auto p-4 bg-blue-50 h-full flex flex-col">
      <div className="m-2">
        <Button className="bg-white text-black" onClick={() => router.back()}>
          <ArrowLeft />
        </Button>
      </div>
      <div className="mb-8 flex flex-col ml-4 space-y-2">
        <div className="text-2xl font-bold mt-4">{taskData?.name}</div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 flex flex-col items-center">
        {taskData?.question_format?.map((question: any) => (
          <div
            key={question.id}
            className="border-2 border-gray-300 p-4 rounded-3xl flex justify-between w-2/3 bg-white"
          >
            <div>
              <h2 className="text-xl font-semibold mb-2">{question.title}</h2>
              <p className="text-gray-700 mb-2">{question.description}</p>
              <span className="text-sm text-gray-500">Type: {question.type}</span>

              {questionResponses[question.id] && (
                <div className="mt-2">
                  {questionResponses[question.id].type === 'Text' ? (
                    <p className="text-gray-800">
                      {questionResponses[question.id].type} -{' '}
                      {questionResponses[question.id].response.slice(0, 50)}
                    </p>
                  ) : (
                    <p>
                      {questionResponses[question.id].type} -{' '}
                      <a
                        href={questionResponses[question.id].response}
                        className="text-blue-600 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {questionResponses[question.id].response}
                      </a>
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className="mt-4">
              <button
                onClick={() => handleOpenDialog(question.type, question.id)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400"
              >
                {questionResponses[question.id] ? 'Edit' : question.type === 'Text' ? 'Add Text' : 'Upload'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex p-4 justify-end">
        <Button onClick={handleCreateTask} className="w-36" disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Create Task'}
        </Button>
      </div>

      {selectedQuestion && (
        <UploadDialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          questionType={selectedQuestion.type}
          questionId={selectedQuestion.id}
          onSave={(response) => handleSaveResponse(response, selectedQuestion.id)}
        />
      )}
    </div>
  );
};

export default CreateTask;
