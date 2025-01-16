import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';

import { Instruction,Instruction1,Instruction2,PMF,ProjectData,Data } from '@/lib/interfaces';
import { DialogTitle } from '@radix-ui/react-dialog';

interface DialogBoxProps {
  Open: boolean;
  onClose: () => void;
  onSave: (data: Instruction) => void;
  editingInstruction?: Instruction;
}

const DialogBox: React.FC<DialogBoxProps> = ({
  Open,
  onClose,
  onSave,
  editingInstruction,
}) => {
  const [title, setTitle] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [link, setLink] = useState('');
  const [text, setText] = useState('');
  const [uploading, setUploading] = useState(false);

  const options = ['Text', 'Pdf', 'Video', 'Audio', 'Image'];

  useEffect(() => {
    if (editingInstruction) {
      setTitle(editingInstruction.title);
      setSelectedType(editingInstruction.type);
      setLink(editingInstruction.link);
      setText(editingInstruction.text);
    } else {
      setTitle('');
      setSelectedType('');
      setLink('');
      setText('');
    }
  }, [editingInstruction]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;

    if (selectedFile) {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append('file', selectedFile);

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API}/file/upload_and_return_link`,
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        );
        console.log(response)

        setLink(response.data.file_url); // Set link input field to the uploaded file's link
      } catch (error) {
        console.error('Error uploading file:', error);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleLinkChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLink(event.target.value);
  };

  const handleSubmit = () => {
    if (title && (link || text || selectedType === 'Text')) {
      onSave({
        id: editingInstruction ? editingInstruction.id : Date.now(),
        title,
        type: selectedType,
        link,
        text,
      });
      setTitle('');
      setSelectedType('');
      setLink('');
      setText('');
    }
  };

  return (
    <Dialog open={Open} onOpenChange={onClose}>
      <DialogTitle className='hidden' >Instructions</DialogTitle>
      <DialogContent className="max-w-md mx-auto p-6 rounded-lg shadow-lg">
        <div className="space-y-6">
          <div>
            <Label htmlFor="title" className="text-sm font-medium">Title</Label>
            <Input
              id="title"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2 p-3 rounded-md border w-full"
            />
          </div>
          <div>
            <Label htmlFor="type" className="text-sm font-medium">Type</Label>
            <Select onValueChange={(value) => setSelectedType(value)} value={selectedType}>
              <SelectTrigger className="mt-2 w-full p-3 border rounded-md">
                <SelectValue placeholder="Select type to add" />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedType && (
            selectedType === 'Text' ? (
              <div>
                <Label htmlFor="textArea" className="text-sm font-medium">Add Text</Label>
                <Textarea
                  id="textArea"
                  placeholder="Enter your text here"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="mt-2 p-3 rounded-md border w-full h-40"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="linkInput" className="text-sm font-medium">Add Link</Label>
                  <Input
                    id="linkInput"
                    type="url"
                    placeholder="Enter file link or upload a file"
                    value={link}
                    onChange={handleLinkChange}
                    className="mt-2 p-3 rounded-md border w-full"
                    disabled={uploading}
                  />
                </div>
                <div className="text-center text-gray-500">OR</div>
                <div className="border-dashed border-2 border-gray-300 rounded-md p-6 text-center">
                  <input
                    type="file"
                    id="fileUpload"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="fileUpload" className="cursor-pointer text-blue-600 inline-block">
                    {uploading ? 'Uploading...' : 'Browse or upload a file'}
                  </label>
                </div>
              </div>
            )
          )}

          <div className="flex justify-between mt-4">
            <Button variant="outline" className="w-1/2 mr-2" onClick={onClose}>Cancel</Button>
            <Button
              className="w-1/2 ml-2 bg-blue-600 text-white"
              onClick={handleSubmit}
              disabled={!link && selectedType !== 'Text' && !text && !uploading}
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogBox;
