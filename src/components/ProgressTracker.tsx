
import { Task } from "@/types";
import { Progress } from "@/components/ui/progress";
import { CircleArrowUp } from "lucide-react";

interface ProgressTrackerProps {
  tasks: Task[];
}

export function ProgressTracker({ tasks }: ProgressTrackerProps) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const completionPercentage = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100) 
    : 0;
  
  // Calculate total time spent across all tasks
  const totalTimeSpent = tasks.reduce((total, task) => total + task.timeSpent, 0);
  
  // Format total time (hours, minutes)
  const formatTotalTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <h2 className="text-lg font-medium mb-4">Progress</h2>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1 text-sm">
            <span>Completed</span>
            <span className="font-medium">{completedTasks} of {totalTasks} tasks</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-sm text-gray-500">Completion</div>
            <div className="flex items-center mt-1">
              <CircleArrowUp className="h-4 w-4 text-blue-500 mr-1" />
              <span className="text-xl font-semibold text-blue-700">{completionPercentage}%</span>
            </div>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-sm text-gray-500">Time Spent</div>
            <div className="flex items-center mt-1">
              <Timer className="h-4 w-4 text-blue-500 mr-1" />
              <span className="text-xl font-semibold text-blue-700">{formatTotalTime(totalTimeSpent)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Timer } from "lucide-react";
