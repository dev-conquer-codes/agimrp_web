import React, { useState } from "react";
import { Edit, Trash } from "lucide-react";
import DialogBoxQuiz from "./QuizDialog";

interface Quiz {
  id: number;
  question: string;
  options: string[];
  correctOption: string; // Add correctOption to the Quiz interface
}

interface QuizSectionProps {
  quizzes: Quiz[];
  setQuizzes: React.Dispatch<React.SetStateAction<Quiz[]>>;
}

const QuizSection: React.FC<QuizSectionProps> = ({ quizzes, setQuizzes }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleSave = (question: string, options: string[], correctOption: string) => {
    if (editingId !== null) {
      // Update existing quiz
      setQuizzes((prev) =>
        prev.map((quiz) =>
          quiz.id === editingId ? { ...quiz, question, options, correctOption } : quiz
        )
      );
      setEditingId(null);
    } else {
      // Add new quiz
      setQuizzes((prev) => [
        ...prev,
        { id: Date.now(), question, options, correctOption },
      ]);
    }
    setIsOpen(false);
  };

  const handleEdit = (id: number) => {
    setEditingId(id);
    setIsOpen(true);
  };

  const handleDelete = (id: number) => {
    setQuizzes((prev) => prev.filter((quiz) => quiz.id !== id));
  };

  return (
    <div className="bg-white rounded-3xl shadow-md w-full flex flex-col justify-between h-full">
      <div className="mb-2 p-6">
        <h2 className="text-center text-xl font-semibold">Quiz Section</h2>
        <div className="flex justify-center">
          <hr className="border-1 border-black w-1/2 mt-4" />
        </div>
      </div>
      <div className="flex-grow px-6 max-h-4/6 overflow-y-auto">
        {quizzes.length === 0 ? (
          <p className="text-gray-500 text-center mt-4">No quizzes added yet.</p>
        ) : (
          <ul className="space-y-4">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="flex justify-between items-center border-2 rounded-3xl p-2 bg-blue-50"
              >
                <div className="mx-2">
                  <p className="text-lg font-medium">{quiz.question}</p>
                  <ul className="text-sm text-gray-500">
                    {quiz.options.map((option, index) => (
                      <li key={index}>{`${String.fromCharCode(
                        65 + index
                      )}. ${option}`}</li>
                    ))}
                  </ul>
                  <p className="text-sm font-semibold text-green-600">
                    Correct Answer: {quiz.correctOption}
                  </p>
                </div>
                <div className="flex space-x-4">
                  <button onClick={() => handleEdit(quiz.id)}>
                    <Edit className="text-blue-500 hover:text-blue-700" />
                  </button>
                  <button onClick={() => handleDelete(quiz.id)}>
                    <Trash className="text-red-500 hover:text-red-700" />
                  </button>
                </div>
              </div>
            ))}
          </ul>
        )}
      </div>
      <div className="flex justify-center h-1/3 items-center bg-blue-50">
        <div className="border-2 border-dashed border-gray-300 px-20 py-5">
          <button
            onClick={() => {
              setIsOpen(true);
              setEditingId(null);
            }}
            className="bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
          >
            <span className="text-white text-2xl">+</span>
          </button>
        </div>
      </div>
      <DialogBoxQuiz
        Open={isOpen}
        onClose={() => setIsOpen(false)}
        onSave={handleSave}
        editingQuiz={quizzes.find((quiz) => quiz.id === editingId) || null}
      />
    </div>
  );
};

export default QuizSection;
