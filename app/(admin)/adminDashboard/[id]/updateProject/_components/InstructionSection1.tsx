// import React, { useState } from 'react';
// import { Edit, Trash } from 'lucide-react';
// import DialogBoxQuestion from './DialogBoxQuestion';

// import { Instruction1 } from '@/lib/interfaces';

// interface InstructionSection1Props {
//   instructions: Instruction1[];
//   setInstructions: (data: Instruction1[]) => void;
// }

// const InstructionSection1: React.FC<InstructionSection1Props> = ({ instructions, setInstructions }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [editingId, setEditingId] = useState<number | null>(null);
//   const handleSave = (title: string, description: string, type: string) => {
//     const updatedInstructions = editingId !== null
//       ? instructions.map((item) => (item.id === editingId ? { ...item, title, description, type } : item))
//       : [...instructions, {  title,  type,description ,id: Date.now(),}];

//     setInstructions(updatedInstructions);
//     setEditingId(null);
//     setIsOpen(false);
//   };

//   const handleEdit = (id: number) => {
//     setEditingId(id);
//     setIsOpen(true);
//   };

//   const handleDelete = (id: number) => {
//     const updatedInstructions = instructions.filter((instruction) => instruction.id !== id);
//     setInstructions(updatedInstructions);
//   };

//   return (
//     <div className="bg-white rounded-3xl shadow-md w-full flex flex-col justify-between h-full">
//       <div className="mb-2 p-6">
//         <h2 className="text-center text-xl font-semibold">Task Data Format</h2>
//         <div className="flex justify-center">
//           <hr className="border-1 border-black w-1/2 mt-4" />
//         </div>
//       </div>
//       <div className="flex-grow px-6 max-h-4/6 overflow-y-auto">
//         {instructions.length === 0 ? (
//           <p className="text-gray-500 text-center mt-4">No instructions added yet.</p>
//         ) : (
//           <ul className="space-y-4">
//             {instructions.map((instruction) => (
//               <div key={instruction.id} className="flex justify-between items-center border-2 rounded-3xl p-2 bg-blue-50">
//                 <div className="mx-2">
//                   <p className="text-lg font-medium">{instruction.title}</p>
//                   <p className="text-sm text-gray-500">{instruction.description}</p>
//                   <p className="text-sm text-gray-500">{instruction.type}</p>
//                 </div>
//                 <div className="flex space-x-4">
//                   <button onClick={() => handleEdit(instruction.id)}>
//                     <Edit className="text-blue-500 hover:text-blue-700" />
//                   </button>
//                   <button onClick={() => handleDelete(instruction.id)}>
//                     <Trash className="text-red-500 hover:text-red-700" />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </ul>
//         )}
//       </div>
//       <div className="flex justify-center h-1/3 items-center bg-blue-50">
//         <div className="border-2 border-dashed border-gray-300 px-20 py-5">
//           <button
//             onClick={() => {
//               setIsOpen(true);
//               setEditingId(null);
//             }}
//             className="bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
//           >
//             <span className="text-white text-2xl">+</span>
//           </button>
//         </div>
//       </div>
//       <DialogBoxQuestion
//         Open={isOpen}
//         onClose={() => setIsOpen(false)}
//         onSave={handleSave}
//         editingInstruction={instructions.find((inst) => inst.id === editingId) || null}
//       />
//     </div>
//   );
// };

// export default InstructionSection1;
