import { TaskItem } from './TaskItem';
import { Task } from '../types/task';
import { CheckCircle, ListTodo } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onToggleTask: (id: string) => void;
  onStartTimer: (taskId: string) => void;  // ⬅ Add this
  onStopTimer: (taskId: string) => void;   // ⬅ Add this
}

export function TaskList({ tasks, onUpdateTask, onDeleteTask, onToggleTask, onStartTimer, onStopTimer }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-muted rounded-full">
            <ListTodo className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>
        <h3 className="text-lg font-medium text-muted-foreground mb-2">No tasks found</h3>
        <p className="text-sm text-muted-foreground">
          Start by adding your first task or adjust your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onUpdate={onUpdateTask}
          onDelete={onDeleteTask}
          onToggleStatus={onToggleTask}
          onStartTimer={onStartTimer}   // pass down
          onStopTimer={onStopTimer}     // pass down
        />
      ))}
    </div>
  );
}