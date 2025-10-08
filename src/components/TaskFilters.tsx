import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Filter, SortAsc, SortDesc } from 'lucide-react';
import { TaskFilters as TaskFiltersType } from '../types/task';

interface TaskFiltersProps {
  filters: TaskFiltersType;
  onFiltersChange: (filters: TaskFiltersType) => void;
  categories: string[];
  taskCount: number;
}

export function TaskFilters({ filters, onFiltersChange, categories, taskCount }: TaskFiltersProps) {
  const handleFilterChange = (key: keyof TaskFiltersType, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleSortOrder = () => {
    onFiltersChange({
      ...filters,
      sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc',
    });
  };

  const resetFilters = () => {
    onFiltersChange({
      status: 'all',
      priority: 'all',
      category: 'all',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  };

  const activeFiltersCount = [
    filters.status !== 'all' ? 1 : 0,
    filters.priority !== 'all' ? 1 : 0,
    filters.category !== 'all' ? 1 : 0,
  ].reduce((sum, count) => sum + count, 0);

  return (
    <Card className="p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">Filters & Sort</span>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary">{activeFiltersCount} active</Badge>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            {taskCount} task{taskCount !== 1 ? 's' : ''}
          </span>
          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              Reset
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Status</label>
          <Select
            value={filters.status}
            onValueChange={(value) => handleFilterChange('status', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Priority</label>
          <Select
            value={filters.priority}
            onValueChange={(value) => handleFilterChange('priority', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Category</label>
          <Select
            value={filters.category}
            onValueChange={(value) => handleFilterChange('category', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Sort By</label>
          <Select
            value={filters.sortBy}
            onValueChange={(value) => handleFilterChange('sortBy', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Created Date</SelectItem>
              <SelectItem value="dueDate">Due Date</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="title">Title</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Order</label>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={toggleSortOrder}
          >
            {filters.sortOrder === 'asc' ? (
              <>
                <SortAsc className="h-4 w-4 mr-2" />
                Ascending
              </>
            ) : (
              <>
                <SortDesc className="h-4 w-4 mr-2" />
                Descending
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}