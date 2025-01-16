"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import "./customScrollbar.css";
import { ArrowLeft } from "lucide-react";
import { ProjectData } from "@/lib/interfaces";
import { useEffect } from "react";
import Tasks from "./Tasks";
import axios from "axios";

interface ProjectOverviewProps {
  project: ProjectData;
  id: string;
}

const ProjectOverview: React.FC<ProjectOverviewProps> = ({ project, id }) => {
  const router = useRouter();

  useEffect(() => {
    console.log(project);
  });
  const downloadProjectData = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/task/get_all_project_task`, // Your API endpoint
        {project_id: id }
      );

      const projectData = response.data;

      // Create a Blob from the fetched data and generate a download link
      const fileBlob = new Blob([JSON.stringify(projectData, null, 2)], {
        type: "application/json",
      });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(fileBlob);
      link.download = `${project.project_name}_data.json`;
      link.click();
    } catch (error) {
      console.error("Error fetching project data:", error);
    }
  };
  return (
    <div className="p-4 space-y-6">
      {/* Back Button */}
      <div className="flex items-center">
        <Button
          className="flex items-center bg-transparent text-black hover:bg-gray-200 hover:text-black"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2" /> Back
        </Button>
      </div>

      {/* Project Overview */}
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-semibold text-gray-800">
              {project.project_name}
            </CardTitle>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <Button
                className="bg-blue-500 text-white hover:bg-blue-600"
                onClick={() => router.push(`/adminDashboard/${id}/updateProject`)}
              >
                Update Project
              </Button>
              <Button
                className="bg-blue-500 text-white hover:bg-green-600"
                onClick={downloadProjectData} // Trigger download
              >
                Download Project Data
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            {/* Upper Row - Type, Coins per Task, Quiz Threshold */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-100 p-4 rounded-lg shadow-sm text-center">
                <p className="text-2xl font-bold  text-gray-600 mb-2">Type</p>
                <p className="text-md font-medium text-gray-800">
                  {project.project_type || "N/A"}
                </p>
              </div>
              {
                project.project_type=='single' && 
                <div className="bg-gray-100 p-4 rounded-lg shadow-sm text-center">
                <p className="text-2xl font-bold  text-gray-600 mb-2">Total Tasks</p>
                <p className="text-md font-medium text-gray-800">
                  {project.categories[0].no_of_tasks || "N/A"}
                </p>
              </div>
              }
              <div className="bg-gray-100 p-4 rounded-lg shadow-sm text-center">
                <p className="text-2xl font-bold  text-gray-600 mb-2">Coins per Task</p>
                <p className="text-md font-medium text-gray-800">
                  {project.coins_per_task || "N/A"}
                </p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg shadow-sm text-center">
                <p className="text-2xl font-bold  text-gray-600 mb-2">Quiz Threshold</p>
                <p className="text-md font-medium text-gray-800">
                  {project.quiz_threshold !== undefined &&
                  project.quiz_threshold !== null
                    ? project.quiz_threshold
                    : "N/A"}
                </p>
              </div>
            </div>

            {/* Categories Section: Only for "multiple" type */}
            {project.project_type === "multiple" && (
              <div>
                <CardTitle className="text-lg font-semibold text-gray-700">
                  Categories
                </CardTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  {project.categories.map((category, index) => (
                   <div
                   key={index}
                   className="bg-blue-100 p-4 rounded-lg border border-blue-200 shadow-sm"
                 >
                   <div className="flex flex-col space-y-2">
                     <div className="flex items-center space-x-2">
                       <div className="text-2xl font-bold text-gray-600">Category:</div>
                       <div className="text-xl font-semibold text-gray-800">
                         {category.category}
                       </div>
                     </div>
                     <div className="flex items-center space-x-2">
                       <div className="text-2xl font-bold text-gray-600">Total Tasks:</div>
                       <div className="text-xl font-semibold text-gray-800">
                         {category.no_of_tasks}
                       </div>
                     </div>
                   </div>
                 </div>
                 
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Description Section */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-700">
            Description
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 leading-relaxed">{project.description}</p>
        </CardContent>
      </Card>
      <div>
        <Tasks/>
      </div>
    </div>
  );
};

export default ProjectOverview;
