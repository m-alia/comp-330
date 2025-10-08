import { useTasks } from './hooks/useTasks';
import { TaskStats } from './components/TaskStats';
import { AddTaskForm } from './components/AddTaskForm';
import { TaskFilters } from './components/TaskFilters';
import { TaskList } from './components/TaskList';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';
import { CheckSquare } from 'lucide-react';

export default function App() {
  const {
    tasks,
    filters,
    setFilters,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    categories,
    stats,
  } = useTasks();

  const handleAddTask = (taskData: Parameters<typeof addTask>[0]) => {
    addTask(taskData);
    toast.success('Task added successfully!');
  };

  const handleUpdateTask = (id: string, updates: Parameters<typeof updateTask>[1]) => {
    updateTask(id, updates);
    toast.success('Task updated successfully!');
  };

  const handleDeleteTask = (id: string) => {
    deleteTask(id);
    toast.success('Task deleted successfully!');
  };

  const handleToggleTask = (id: string) => {
    toggleTaskStatus(id);
    const task = tasks.find(t => t.id === id);
    if (task) {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      toast.success(
        newStatus === 'completed' 
          ? 'Task marked as completed!' 
          : 'Task marked as pending!'
      );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-2 bg-primary text-primary-foreground rounded-lg">
            <CheckSquare className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Personal Task Tracker</h1>
            <p className="text-muted-foreground">
              Organize and manage your tasks efficiently
            </p>
          </div>
        </div>

        {/* Stats */}
        <TaskStats stats={stats} />

        {/* Add Task Form */}
        <AddTaskForm onAddTask={handleAddTask} categories={categories} />

        {/* Filters */}
        <TaskFilters
          filters={filters}
          onFiltersChange={setFilters}
          categories={categories}
          taskCount={tasks.length}
        />

        {/* Task List */}
        <TaskList
          tasks={tasks}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
          onToggleTask={handleToggleTask}
        />

        {/* Toast notifications */}
        <Toaster />
      </div>
    </div>
  );
}