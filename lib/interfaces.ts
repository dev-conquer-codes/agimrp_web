export interface Instruction {
    id: number;
    title: string;
    type: string;
    link: string;
    text: string;
  }
 export interface Instruction1 {
    id: number;
    title: string;
    description: string;
    type: string;
  }
  
 export interface Instruction2 {
    id: number;
    title: string;
    description: string;
    type: string;
    options?: string[];
  }
 export interface PMF {
    role: string;
    name: string;
    email: string;
    recordId: string;
  }
 export interface ProjectData {
 
  project_type: 'single' | 'multiple' | null; // Type of the project
  project_name: string; // Name of the project
  description: string; // Description of the project
  coins_per_task: number | null; // Coins assigned per task
  quiz_threshold: number; // Threshold value between 0 and 1
  categories: { 
    category: string; 
    no_of_tasks: number; 
  }[];
    instructions: Instruction[];
    question_format: Instruction1[];
    task_format: Instruction2[];
    quiz_data:Quiz[]
    recordId: string; // Added this to match the unique identifier for filtering
  }
 export interface Data {
    question_format: Instruction1[];
    answer_format: Instruction2[];
    quizzes:Quiz[];
  }
  export interface TaskData {
    name:string
    question_format: Instruction1[];
    answer_format: Instruction2[];
    instructions:Instruction[];
  }
  export interface Project {
    description: string; // Description of the project
    reviewers: string[]; // Array of reviewer names
    taskers: string[]; // Array of tasker names
    instructions: Instruction[]; // Array of instructions
    created: string; // ISO date string representing the creation time
    project_name: string; // Name of the project
    pm_id: string; // User ID of the assigned project manager (PM)
    recordId: string; // The project ID after creation
  }
  export interface Flag {
    user_id: string;
    feedback: string;
    acknowledged: boolean;
    recordId: string;
    created: string;
  }
  export interface Tasker {
    id: string;
    name: string;
    email: string;
    tasksInProgress: number;
    tasksDone: number;
    reworksInProgress: number;
    reworksDone: number;
    tasksApproved: number;
    qualityScore: number;
  }
  
  export interface Reviewer {
    id: string;
    name: string;
    email: string;
    reviewsPending: number;
    reviewsDone: number;
  }
  interface Quiz {
    id: number;
    question: string;
    options: string[];
    correctOption: string; // Add correctOption to the Quiz interface
  }
 
  export interface ProjectFormData {
    projectType: 'single' | 'multiple' | null; // Type of the project
    projectName: string; // Name of the project
    description: string; // Description of the project
    coinsPerTask: number | null; // Coins assigned per task
    instructions: Instruction[]; // List of instructions
    threshold: number; // Threshold value between 0 and 1
    categories: { 
      category: string; 
      no_of_tasks: number; 
    }[]; // Categories and total tasks per category
  }
  export interface FullData{
    projectType: 'single' | 'multiple' | null; // Type of the project
    projectName: string; // Name of the project
    description: string; // Description of the project
    coinsPerTask: number | null; // Coins assigned per task
    instructions: Instruction[]; // List of instructions
    threshold: number; // Threshold value between 0 and 1
    categories: { 
      category: string; 
      no_of_tasks: number; 
    }[]; 
  }
   export interface TaskFormat {
    title: string;
    type: string;
    description: string;
    real_data: string[];
    options: string[];
  }
  
  export interface TaskData {
    review_feedback: string;
    task_format: TaskFormat[];
    project_id: string;
    category: string;
    user_id: string;
    status: string;
    created: string;
    recordId: string;
  }
  export interface PayoutData {
    user_id: string;
    amount: string;
    amount_in_USD: string;
    paypal_id: string;
    status: string; // "completed" or "pending"
  }
  export interface Task {
    review_feedback?: string;
    project_id?: string;
    category?: string;
    user_id?: string;
    status?: string;
    created?: string;
    recordId: string;
  }