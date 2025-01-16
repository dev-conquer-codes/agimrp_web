import React, { useState, useEffect } from "react";

interface DialogBoxQuizProps {
  Open: boolean;
  onClose: () => void;
  onSave: (question: string, options: string[], correctOption: string) => void;
  editingQuiz: { id: number; question: string; options: string[]; correctOption: string } | null;
}

const DialogBoxQuiz: React.FC<DialogBoxQuizProps> = ({ Open, onClose, onSave, editingQuiz }) => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctOptionIndex, setCorrectOptionIndex] = useState<number | null>(null);

  useEffect(() => {
    if (editingQuiz) {
      setQuestion(editingQuiz.question);
      setOptions(editingQuiz.options);
      const index = editingQuiz.correctOption
        ? editingQuiz.correctOption.charCodeAt(0) - 65
        : null; // Convert A, B, C, D to index
      setCorrectOptionIndex(index);
    } else {
      setQuestion("");
      setOptions(["", "", "", ""]);
      setCorrectOptionIndex(null);
    }
  }, [editingQuiz]);

  const handleOptionChange = (index: number, value: string) => {
    setOptions((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleSubmit = () => {
    if (
      question.trim() &&
      options.every((opt) => opt.trim()) &&
      correctOptionIndex !== null &&
      correctOptionIndex >= 0 &&
      correctOptionIndex < options.length
    ) {
      const correctOption = String.fromCharCode(65 + correctOptionIndex); // Convert index to A, B, C, D
      onSave(question, options, correctOption);
      onClose();
    }
  };

  if (!Open) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-1/2">
        <h2 className="text-lg font-semibold mb-4">Add/Edit Quiz</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium">Question</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </div>
        {options.map((option, index) => (
          <div key={index} className="mb-4">
            <label className="block text-sm font-medium">{`Option ${String.fromCharCode(65 + index)}`}</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
            />
          </div>
        ))}
        <div className="mb-4">
          <label className="block text-sm font-medium">Correct Option</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={correctOptionIndex !== null ? correctOptionIndex : ""}
            onChange={(e) => setCorrectOptionIndex(Number(e.target.value))}
          >
            <option value="" disabled>
              Select the correct option
            </option>
            {options.map((_, index) => (
              <option key={index} value={index}>
                {`Option ${String.fromCharCode(65 + index)}`}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end space-x-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
            Cancel
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default DialogBoxQuiz;
