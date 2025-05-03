
import { useState, useEffect } from "react";
import { Check, Timer, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { Task, ProcrastinationReason } from "@/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface TaskItemProps {
  task: Task;
  onTaskUpdate: (updatedTask: Task) => void;
  onTaskDelete: (taskId: string) => void;
}

export function TaskItem({ task, onTaskUpdate, onTaskDelete }: TaskItemProps) {
  const [reminderTime, setReminderTime] = useState<string>("");
  const [reminderDialogOpen, setReminderDialogOpen] = useState(false);

  // Format time spent in a readable format (mm:ss)
  const formatTimeSpent = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Update timer every second if it's running
  useEffect(() => {
    let interval: number | undefined;
    
    if (task.isTimerRunning && task.timerStartTime) {
      interval = window.setInterval(() => {
        const elapsedSeconds = Math.floor((Date.now() - task.timerStartTime!) / 1000);
        onTaskUpdate({
          ...task,
          timeSpent: task.timeSpent + 1
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [task, onTaskUpdate]);

  // Toggle timer start/stop
  const toggleTimer = () => {
    if (task.isTimerRunning) {
      // Stop timer
      onTaskUpdate({
        ...task,
        isTimerRunning: false,
        timerStartTime: undefined
      });
    } else {
      // Start timer
      onTaskUpdate({
        ...task,
        isTimerRunning: true,
        timerStartTime: Date.now()
      });
    }
  };

  // Toggle task completion
  const toggleCompleted = () => {
    // If timer is running, stop it
    if (task.isTimerRunning) {
      toggleTimer();
    }
    
    onTaskUpdate({
      ...task,
      completed: !task.completed
    });
  };

  // Set procrastination reason
  const setProcrastinationReason = (reason: ProcrastinationReason) => {
    onTaskUpdate({
      ...task,
      procrastinationReason: reason
    });
  };

  // Set reminder
  const handleSetReminder = () => {
    if (!reminderTime) return;
    
    const [hours, minutes] = reminderTime.split(':').map(Number);
    const now = new Date();
    const reminderDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hours,
      minutes
    );
    
    // If the time has already passed today, set it for tomorrow
    if (reminderDate.getTime() < now.getTime()) {
      reminderDate.setDate(reminderDate.getDate() + 1);
    }
    
    onTaskUpdate({
      ...task,
      reminderTime: reminderDate.getTime()
    });
    
    setReminderDialogOpen(false);
    
    // For demo purposes, show a notification after 3 seconds
    if (Notification.permission === "granted") {
      setTimeout(() => {
        new Notification("Task Reminder", {
          body: `Don't forget to work on: ${task.name}`
        });
      }, 3000);
    }
  };

  return (
    <div className={cn(
      "flex flex-col gap-2 p-4 rounded-lg border", 
      task.completed ? "bg-gray-50 border-gray-200" : "bg-white border-gray-200"
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Checkbox 
            checked={task.completed} 
            onCheckedChange={toggleCompleted}
            className={task.completed ? "bg-blue-500 text-white border-transparent" : ""}
          />
          <span className={cn(
            "font-medium", 
            task.completed && "line-through text-gray-500"
          )}>
            {task.name}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleTimer}
            className={task.isTimerRunning ? "bg-blue-50 text-blue-500" : ""}
            disabled={task.completed}
          >
            <Timer className="h-4 w-4 mr-1" />
            {task.isTimerRunning ? "Stop" : "Start"}
          </Button>
          
          <Dialog open={reminderDialogOpen} onOpenChange={setReminderDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" disabled={task.completed}>
                <Bell className="h-4 w-4 text-gray-500" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Set Reminder</DialogTitle>
                <DialogDescription>
                  Set a time to be reminded about this task.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button onClick={handleSetReminder}>Set Reminder</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onTaskDelete(task.id)}
            className="text-gray-500 hover:text-red-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-sm">
        <div className="text-gray-600">
          Time spent: <span className="font-medium">{formatTimeSpent(task.timeSpent)}</span>
        </div>
        
        {!task.completed && (
          <Select 
            onValueChange={(value) => setProcrastinationReason(value as ProcrastinationReason)}
            value={task.procrastinationReason}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Why delayed?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Distracted">Distracted</SelectItem>
              <SelectItem value="Lack of motivation">Lack of motivation</SelectItem>
              <SelectItem value="Busy with other things">Busy with other things</SelectItem>
              <SelectItem value="Too difficult">Too difficult</SelectItem>
              <SelectItem value="Not urgent">Not urgent</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        )}
        
        {task.reminderTime && (
          <div className="text-xs text-blue-500 flex items-center gap-1">
            <Bell className="h-3 w-3" />
            Reminder: {new Date(task.reminderTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
      </div>
    </div>
  );
}
