export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  category: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskFilters {
  status: 'all' | 'pending' | 'in-progress' | 'completed';
  priority: 'all' | 'low' | 'medium' | 'high';
  category: 'all' | string;
  sortBy: 'dueDate' | 'priority' | 'createdAt' | 'title';
  sortOrder: 'asc' | 'desc';
}