
import { useState } from "react";
import { Task } from "@/types";
import { TaskItem } from "./TaskItem";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";

interface TaskListProps {
  tasks: Task[];
  onTasksChange: (updatedTasks: Task[]) => void;
}

export function TaskList({ tasks, onTasksChange }: TaskListProps) {
  const [newTaskName, setNewTaskName] = useState("");

  const addTask = () => {
    if (!newTaskName.trim()) return;
    
    const newTask: Task = {
      id: uuidv4(),
      name: newTaskName.trim(),
      completed: false,
      timeSpent: 0,
      isTimerRunning: false
    };
    
    onTasksChange([...tasks, newTask]);
    setNewTaskName("");
  };

  const updateTask = (updatedTask: Task) => {
    const updatedTasks = tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    );
    onTasksChange(updatedTasks);
  };

  const deleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    onTasksChange(updatedTasks);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Input
          placeholder="Add a new task..."
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1"
        />
        <Button onClick={addTask}>Add Task</Button>
      </div>
      
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No tasks yet. Add your first task to get started!
          </div>
        ) : (
          tasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onTaskUpdate={updateTask}
              onTaskDelete={deleteTask}
            />
          ))
        )}
      </div>
    </div>
  );
}
