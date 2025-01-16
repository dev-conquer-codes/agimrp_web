import React, { useState } from 'react';
import { Edit, Trash } from 'lucide-react';

import DialogBox from './DialogInstructions';
import { Instruction } from '@/lib/interfaces';

interface InstructionSectionProps {
  instruction: Instruction[];
  onSave: (instructions: Instruction[]) => void;
}

const InstructionSection: React.FC<InstructionSectionProps> = ({ instruction, onSave }) => {
  const [instructions, setInstructions] = useState<Instruction[]>(instruction);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleSave = (data: Instruction) => {
    if (editingId !== null) {
      setInstructions((prev) =>
        prev.map((item) => (item.id === editingId ? { ...data } : item))
      );
      setEditingId(null);
    } else {
      setInstructions((prev) => [...prev, data]);
    }
    setIsOpen(false);
  };

  // Call onSave whenever instructions are updated
  React.useEffect(() => {
    console.log(instruction);
    onSave(instructions);
  }, [instructions, onSave]);

  const handleEdit = (id: number) => {
    setEditingId(id);
    setIsOpen(true);
  };

  const handleDelete = (id: number) => {
    setInstructions((prev) => prev.filter((instruction) => instruction.id !== id));
  };

  return (
    <div className="bg-white rounded-2xl shadow-md w-full h-full max-h-[600px] overflow-hidden flex flex-col">
      <div className="p-6 flex-shrink-0">
        <h2 className="text-center text-xl font-semibold">Instructions</h2>
        <hr className="border-t mt-4" />
      </div>

      {/* Instructions list with flexible height for scrolling */}
      <div className="flex-grow overflow-y-auto px-6">
        {instructions.length === 0 ? (
          <p className="text-gray-500 text-center mt-4">No instructions added yet.</p>
        ) : (
          <ul className="space-y-4">
            {instructions.map((instruction) => (
              <div
                key={instruction.id}
                className="flex justify-between items-center border-2 rounded-3xl p-2 bg-blue-50"
              >
                <div className="mx-2">
                  <p className="text-lg font-medium">{instruction.title}</p>
                  <p className="text-sm text-gray-500">{instruction.type}</p>
                </div>
                <div className="flex space-x-4">
                  <button onClick={() => handleEdit(instruction.id)}>
                    <Edit className="text-blue-500 hover:text-blue-700" />
                  </button>
                  <button onClick={() => handleDelete(instruction.id)}>
                    <Trash className="text-red-500 hover:text-red-700" />
                  </button>
                </div>
              </div>
            ))}
          </ul>
        )}
      </div>

      <div className="flex-shrink-0 flex justify-center items-center bg-blue-50 py-4">
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

      <DialogBox
        Open={isOpen}
        onClose={() => setIsOpen(false)}
        onSave={handleSave}
        editingInstruction={instructions.find((inst) => inst.id === editingId)}
      />
    </div>
  );
};

export default InstructionSection;
