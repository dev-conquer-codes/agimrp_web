import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';

interface DialogBoxProps {
  Open: boolean;
  onClose: () => void;
  onSave: (title: string, description: string, type: string, options?: string[]) => void;
  editingInstruction?: { id: number; title: string; description: string; type: string; options?: string[] } | null;
}

const DialogBoxAnswer: React.FC<DialogBoxProps> = ({ Open, onClose, onSave, editingInstruction }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [optionsArray, setOptionsArray] = useState<string[]>([]);
  const [optionInput, setOptionInput] = useState('');

  const options = ['File', 'Textbox', 'Single Select MCQ', 'Multiple Select MCQ'];

  useEffect(() => {
    if (editingInstruction) {
      setTitle(editingInstruction.title);
      setDescription(editingInstruction.description);
      setSelectedType(editingInstruction.type);
      setOptionsArray(editingInstruction.options || []);
    } else {
      setTitle('');
      setDescription('');
      setSelectedType('');
      setOptionInput('');
      setOptionsArray([]);
    }
  }, [editingInstruction]);

  const handleAddOption = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && optionInput.trim() !== '') {
      setOptionsArray([...optionsArray, optionInput.trim()]);
      setOptionInput('');
    }
  };

  const handleRemoveOption = (index: number) => {
    setOptionsArray(optionsArray.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (title && selectedType) {
      onSave(title, description, selectedType, optionsArray);
      setTitle('');
      setDescription('');
      setSelectedType('');
      setOptionsArray([]);
    }
  };

  return (
    <Dialog open={Open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg mx-auto p-6 rounded-lg shadow-lg bg-white">
        <DialogTitle className="text-lg font-semibold text-center">Question Configuration</DialogTitle>
        <div className="space-y-6 mt-4">
          <div>
            <Label htmlFor="title" className="text-sm font-medium">
              Question Title
            </Label>
            <Input
              id="title"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2 p-3 rounded-md border w-full"
            />
          </div>
          <div>
            <Label htmlFor="description" className="text-sm font-medium">
              Question Description
            </Label>
            <Textarea
              id="description"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2 p-3 rounded-md border w-full h-32"
            />
          </div>
          <div>
            <Label htmlFor="type" className="text-sm font-medium">
              Attachment Type
            </Label>
            <Select onValueChange={(value) => setSelectedType(value)} value={selectedType}>
              <SelectTrigger className="mt-2 w-full p-3 border rounded-md">
                <SelectValue placeholder="Select type to add" />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {(selectedType === 'Single Select MCQ' || selectedType === 'Multiple Select MCQ') && (
            <div>
              <Label htmlFor="optionInput" className="text-sm font-medium">
                Add Options
              </Label>
              <Input
                id="optionInput"
                placeholder="Type option and press Enter"
                value={optionInput}
                onChange={(e) => setOptionInput(e.target.value)}
                onKeyDown={handleAddOption}
                className="mt-2 p-3 rounded-md border w-full"
              />
              <div className="flex flex-wrap mt-2 gap-2">
                {optionsArray.map((option, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-gray-200 text-sm px-3 py-1 rounded-full border"
                  >
                    {option}
                    <button
                      type="button"
                      className="ml-2 text-red-500 hover:text-red-700"
                      onClick={() => handleRemoveOption(index)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-4 mt-6">
            <Button variant="outline" onClick={onClose} className="px-6 py-2">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="bg-blue-600 text-white px-6 py-2">
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogBoxAnswer;
