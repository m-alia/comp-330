import { useState, useEffect } from 'react';
import { Task, TaskFilters } from '../types/task';

const defaultFilters: TaskFilters = {
  status: 'all',
  priority: 'all',
  category: 'all',
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

export function useTasks(currentUser?: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState<TaskFilters>(defaultFilters);

  // Dynamic storage key per user
  const STORAGE_KEY = currentUser ? `personal-tasks_${currentUser}` : 'personal-tasks';

  // Load tasks from localStorage on mount or when user changes
  useEffect(() => {
    if (!currentUser) return; // nothing to load if no user

    const savedTasks = localStorage.getItem(STORAGE_KEY);
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (error) {
        console.error('Failed to parse saved tasks:', error);
      }
    } else {
      setTasks([]); // no tasks yet for this user
    }
  }, [currentUser]);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    if (!currentUser) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks, currentUser]);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? { ...task, ...updates, updatedAt: new Date().toISOString() }
          : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

const startTimer = (taskId: string) => {
  setTasks(prev =>
    prev.map(task =>
      task.id === taskId
        ? { ...task, isTimerRunning: true, timerStartAt: Date.now() }
        : task
    )
  );
};

const stopTimer = (taskId: string) => {
  setTasks(prev =>
    prev.map(task => {
      if (task.id !== taskId || !task.timerStartAt) return task;
      const elapsed = Date.now() - task.timerStartAt;
      return {
        ...task,
        isTimerRunning: false,
        timerStartAt: undefined,
        timeSpent: (task.timeSpent || 0) + elapsed,
      };
    })
  );
};


  const toggleTaskStatus = (id: string) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id === id) {
          const newStatus = task.status === 'completed' ? 'pending' : 'completed';
          return {
            ...task,
            status: newStatus,
            updatedAt: new Date().toISOString(),
          };
        }
        return task;
      })
    );
  };

  // Filter and sort tasks
  const filteredTasks = tasks
    .filter(task => {
      if (filters.status !== 'all' && task.status !== filters.status) return false;
      if (filters.priority !== 'all' && task.priority !== filters.priority) return false;
      if (filters.category !== 'all' && task.category !== filters.category) return false;
      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (filters.sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'dueDate':
          const aDate = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
          const bDate = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
          comparison = aDate - bDate;
          break;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          comparison = priorityOrder[b.priority] - priorityOrder[a.priority];
          break;
        case 'createdAt':
        default:
          comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          break;
      }
      
      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

  // Get unique categories
  const categories = Array.from(new Set(tasks.map(task => task.category))).filter(Boolean);

  // Calculate statistics
  const stats = {
    total: tasks.length,
    completed: tasks.filter(task => task.status === 'completed').length,
    pending: tasks.filter(task => task.status === 'pending').length,
    inProgress: tasks.filter(task => task.status === 'in-progress').length,
    overdue: tasks.filter(task => 
      task.dueDate && 
      new Date(task.dueDate) < new Date() && 
      task.status !== 'completed'
    ).length,
  };

  return {
    tasks: filteredTasks,
    allTasks: tasks,
    filters,
    setFilters,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    startTimer,
    stopTimer,
    categories,
    stats,
  };
}
