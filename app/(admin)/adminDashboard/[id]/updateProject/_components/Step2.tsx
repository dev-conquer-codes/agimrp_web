'use client';

import React, { useState } from 'react';
// import InstructionSection1 from './InstructionSection1';
import InstructionSection2 from './InstructionSection2';
import QuizSection from './QuizSection';
import Logo from '@/app/_components/Logo';
import { UserButton } from '@clerk/nextjs';
import { Instruction1, Instruction2, Data, ProjectData } from '@/lib/interfaces';
import { Button } from '@/components/ui/button';
interface Quiz {
  id: number;
  question: string;
  options: string[];
  correctOption: string; // Add correctOption to the Quiz interface
}
interface MainContainerProps {
  initialData:ProjectData;
  onCreate: (data: Data) => void;
  goBack: () => void;
}

const MainContainer = ({initialData, onCreate, goBack }: MainContainerProps) => {
  const [instructions1, setInstructions1] = useState<Instruction1[]>(initialData.question_format);
  const [instructions2, setInstructions2] = useState<Instruction2[]>(initialData.task_format);
  const [quizzes, setQuizzes] = useState<Quiz[]>(initialData.quiz_data);
  const [loading, setLoading] = useState<boolean>(false);

  const handleCreate = async () => {
    setLoading(true);
    const data: Data = {
      question_format: instructions1,
      answer_format: instructions2,
      quizzes: quizzes,
    };

    try {
      await onCreate(data); // Ensure onCreate is capable of handling async calls if needed.
    } finally {
      setLoading(false); // Re-enable the button when the process is complete.
    }
  };

  const handlePrevious = () => {
    goBack();
  };

  return (
    <div className="bg-gray-50 flex flex-col">
      {/* Header with Logo and UserButton */}
      <div className="flex justify-between w-full p-5">
        <Logo />
        <UserButton />
      </div>
      <hr className="w-full" />

      {/* Main content area */}
      <div className="bg-gray-100">
        <div className="flex gap-10 mx-10 justify-center items-start mt-5 h-screen overflow-y-auto">
          {/* <div className="h-full w-1/3">
            <InstructionSection1
              instructions={instructions1}
              setInstructions={setInstructions1}
            />
          </div> */}
             <div className="h-full w-1/3">
            <QuizSection quizzes={quizzes} setQuizzes={setQuizzes} />
          </div>
          <div className="h-full w-1/3">
            <InstructionSection2
              instructions={instructions2}
              setInstructions={setInstructions2}
            />
          </div>
       
        </div>

        {/* Buttons */}
        <div className="flex justify-between w-full px-6 py-2">
          <Button
            onClick={handlePrevious}
            className="w-36 p-2 bg-black text-white rounded-xl shadow-md hover:bg-gray-800"
          >
            Previous
          </Button>
          <Button
            onClick={handleCreate}
            disabled={loading}
            className={`w-36 p-2 text-white rounded-xl shadow-md ${
              loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-black hover:bg-gray-800'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
                Loading...
              </span>
            ) : (
              'Update Project'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MainContainer;
