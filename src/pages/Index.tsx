
import { useState, useEffect } from "react";
import { Task } from "@/types";
import { TaskList } from "@/components/TaskList";
import { ProgressTracker } from "@/components/ProgressTracker";

export default function Index() {
  // Load tasks from localStorage or start with empty array
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem("procrastination-tracker-tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("procrastination-tracker-tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Request notification permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Procrastination Tracker</h1>
          <p className="text-gray-600">Track your tasks, time spent, and understand your procrastination patterns</p>
        </header>

        <div className="space-y-8">
          <ProgressTracker tasks={tasks} />
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h2 className="text-lg font-medium mb-4">Tasks</h2>
            <TaskList tasks={tasks} onTasksChange={setTasks} />
          </div>
        </div>
      </div>
    </div>
  );
}
