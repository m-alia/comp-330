import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card } from './ui/card';
import { Label } from './ui/label';
import { Plus, X } from 'lucide-react';
import { Task } from '../types/task';

interface AddTaskFormProps {
  onAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  categories: string[];
}

export function AddTaskForm({ onAddTask, categories }: AddTaskFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending' as const,
    priority: 'medium' as const,
    category: '',
    dueDate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    onAddTask({
      ...formData,
      description: formData.description || undefined,
      dueDate: formData.dueDate || undefined,
    });

    // Reset form
    setFormData({
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      category: '',
      dueDate: '',
    });
    setIsOpen(false);
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      category: '',
      dueDate: '',
    });
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="w-full mb-6"
        size="lg"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add New Task
      </Button>
    );
  }

  return (
    <Card className="p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3>Add New Task</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCancel}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Task Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Enter task title..."
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Enter task description..."
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={formData.priority}
              onValueChange={(value: 'low' | 'medium' | 'high') =>
                setFormData(prev => ({ ...prev, priority: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              placeholder="e.g., Work, Personal, Study"
              list="categories"
            />
            <datalist id="categories">
              {categories.map(category => (
                <option key={category} value={category} />
              ))}
            </datalist>
          </div>

          <div>
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
            />
          </div>
        </div>

        <div className="flex space-x-2 pt-2">
          <Button type="submit" className="flex-1">
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}