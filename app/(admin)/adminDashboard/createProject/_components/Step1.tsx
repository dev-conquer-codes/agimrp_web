'use client';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { UserButton } from '@clerk/nextjs';
import Logo from '@/app/_components/Logo';
import InstructionSection from './Instruction';
import { Instruction } from '@/lib/interfaces';

interface ProjectFormProps {
  onNext: (data: any) => void;
}

export default function ProjectForm({ onNext }: ProjectFormProps) {
  const [projectType, setProjectType] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [coinsPerTask, setCoinsPerTask] = useState<number | null>(null);
  const [instructions, setInstructions] = useState<Instruction[]>([]);
  const [categories, setCategories] = useState<{ category: string; no_of_tasks: number }[]>([
    { category: '', no_of_tasks: 0 },
  ]);
  const [threshold, setThreshold] = useState<number>(0);

  const handleSaveInstruction = (instructions: Instruction[]) => {
    setInstructions(instructions);
  };

  const handleAddCategory = () => {
    setCategories([...categories, { category: '', no_of_tasks: 0 }]);
  };

  const handleRemoveCategory = (index: number) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  const handleCategoryChange = (
    index: number,
    field: 'category' | 'no_of_tasks',
    value: string | number
  ) => {
    const updatedCategories = [...categories];
    if (field === 'no_of_tasks') {
      updatedCategories[index][field] = Number(value);
    } else {
      updatedCategories[index][field] = value as string;
    }
    setCategories(updatedCategories);
  };

  const handleProjectTypeChange = (type: string) => {
    setProjectType(type);
    if (type === 'single') {
      setCategories([{ category: '', no_of_tasks: 0 }]);
    } else if (type === 'multiple') {
      setCategories([{ category: '', no_of_tasks: 0 }]);
    }
  };

  const onSubmit = () => {
    if (!name) {
      alert('Please add a Project Name');
    } else if (!projectType) {
      alert('Please choose a Project Type');
    } else if (!coinsPerTask) {
      alert('Please specify Coins per Task');
    } else if (threshold < 0 || threshold > 1) {
      alert('Threshold must be a value between 0 and 1');
    } else {
      const data = {
        projectType,
        projectName: name,
        description,
        coinsPerTask,
        instructions,
        threshold,
        categories: projectType === 'single'
          ? [{ category: '', no_of_tasks: categories[0]?.no_of_tasks || 0 }]
          : categories,
      };
      console.log(data);
      onNext(data);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="flex justify-between items-center py-4 px-8 bg-white shadow-md">
        <Logo />
        <UserButton />
      </nav>
      <div className="flex mx-24 gap-10 mt-8 mb-8 bg-gray-100">
        <main className="flex-1 w-2/3 mx-auto">
          <form className="space-y-6 bg-white p-8 rounded-lg shadow-lg">
            {/* Name Input */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                className="rounded-3xl"
                id="name"
                placeholder="Enter Project name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Description Textarea */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                className="rounded-3xl"
                id="description"
                placeholder="Write description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Coins Per Task */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="coins-per-task">Coins per Task</Label>
              <Input
                className="rounded-3xl"
                id="coins-per-task"
                type="number"
                placeholder="Enter coins per task"
                value={coinsPerTask !== null ? coinsPerTask.toString() : ''}
                onChange={(e) => setCoinsPerTask(Number(e.target.value))}
                required
              />
            </div>

            {/* Threshold Input */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="threshold">Threshold (0-1)</Label>
              <Input
                className="rounded-3xl"
                id="threshold"
                type="number"
                step="0.1"
                placeholder="Enter a value between 0 and 1"
                value={threshold.toString()}
                onChange={(e) => setThreshold(Number(e.target.value))}
                required
              />
            </div>

            {/* Project Type Selection */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="project-type">Choose Project Type</Label>
              <Select onValueChange={handleProjectTypeChange}>
                <SelectTrigger id="project-type">
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="multiple">Multiple</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Conditional Inputs */}
            {categories.map((cat, index) => (
              <div key={index} className="flex flex-col gap-2">
                {projectType === 'multiple' && (
                  <>
                    <Label>Category</Label>
                    <div className="flex gap-4 items-center">
                      <Input
                        className="rounded-3xl"
                        placeholder="Enter category"
                        value={cat.category}
                        onChange={(e) => handleCategoryChange(index, 'category', e.target.value)}
                      />
                      <Input
                        className="rounded-3xl"
                        type="number"
                        placeholder="Enter total tasks"
                        value={cat.no_of_tasks.toString()}
                        onChange={(e) => handleCategoryChange(index, 'no_of_tasks', e.target.value)}
                      />
                      <Button
                        variant="secondary"
                        type="button"
                        onClick={() => handleRemoveCategory(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  </>
                )}
                {projectType === 'single' && (
                  <>
                    <Label>No of Tasks</Label>
                    <Input
                      className="rounded-3xl"
                      type="number"
                      placeholder="Enter total tasks"
                      value={cat.no_of_tasks.toString()}
                      onChange={(e) => handleCategoryChange(index, 'no_of_tasks', e.target.value)}
                    />
                  </>
                )}
              </div>
            ))}
            {projectType === 'multiple' && (
              <div className="flex justify-end">
                <Button type="button" onClick={handleAddCategory}>
                  Add More
                </Button>
              </div>
            )}
          </form>
        </main>
        <div className="w-1/3">
          <InstructionSection instruction={instructions} onSave={handleSaveInstruction} />
        </div>
      </div>
      <div className="flex justify-end mb-10 mr-24 rounded-xl">
        <Button onClick={onSubmit} className="w-36" type="submit">
          Next
        </Button>
      </div>
    </div>
  );
}
