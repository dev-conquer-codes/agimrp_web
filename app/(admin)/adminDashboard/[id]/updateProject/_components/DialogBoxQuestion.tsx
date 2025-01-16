import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { DialogTitle } from '@radix-ui/react-dialog';

interface DialogBoxProps {
  Open: boolean;
  onClose: () => void;
  onSave: (title: string, description: string, type: string) => void;
  editingInstruction?: { id: number; title: string; description: string; type: string } | null;
}

const DialogBoxQuestion: React.FC<DialogBoxProps> = ({ Open, onClose, onSave, editingInstruction }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const options = ['Text', 'Pdf', 'Video', 'Audio', 'Image'];

  useEffect(() => {
    if (editingInstruction) {
      setTitle(editingInstruction.title);
      setDescription(editingInstruction.description);
      setSelectedType(editingInstruction.type);
    } else {
      setTitle('');
      setDescription('');
      setSelectedType('');
    }
  }, [editingInstruction]);

  const handleSubmit = () => {
    if (title && selectedType) {
      onSave(title, description, selectedType);
      setTitle('');
      setDescription('');
      setSelectedType('');
    }
  };

  return (
    <Dialog open={Open} onOpenChange={onClose}>

      <DialogContent className="max-w-lg mx-auto p-6 rounded-lg shadow-lg bg-white">
      <DialogTitle className='hidden'>Instruction</DialogTitle>
        <div className="space-y-6">
          {/* Question Title Input */}
          <div>
            <Label htmlFor="title" className="text-sm font-medium">
              Question title
            </Label>
            <Input
              id="title"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2 p-3 rounded-md border w-full"
            />
          </div>

          {/* Description Field */}
          <div>
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2 p-3 rounded-md border w-full h-32"
            />
          </div>

          {/* Type Selection Dropdown */}
          <div>
            <Label htmlFor="type" className="text-sm font-medium">
              Attachment type
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

          {/* Action Buttons */}
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

export default DialogBoxQuestion;
