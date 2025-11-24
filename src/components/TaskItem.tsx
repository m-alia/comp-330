import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Play, Square } from 'lucide-react';
import { useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  MoreHorizontal, 
  Edit3, 
  Trash2, 
  Calendar, 
  Flag, 
  Tag,
  Clock,
  Check,
  X,
  Save
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Task } from '../types/task';

interface TaskItemProps {
  task: Task;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onStartTimer: (taskId: string) => void;
  onStopTimer: (taskId: string) => void;

}

export function TaskItem({ task, onUpdate, onDelete, onToggleStatus, onStartTimer, onStopTimer }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description || '',
    priority: task.priority,
    category: task.category,
    dueDate: task.dueDate || '',
    status: task.status,
  });
  const [liveTime, setLiveTime] = useState(task.timeSpent || 0);

  useEffect(() => {
  if (!task.isTimerRunning) return;

  const interval = setInterval(() => {
    const elapsed = Date.now() - (task.timerStartAt || Date.now());
    setLiveTime((task.timeSpent || 0) + elapsed);
  }, 1000);

  return () => clearInterval(interval);
}, [task.isTimerRunning, task.timerStartAt, task.timeSpent]);


  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';
  const isCompleted = task.status === 'completed';

  const handleSave = () => {
    onUpdate(task.id, {
      ...editData,
      description: editData.description || undefined,
      dueDate: editData.dueDate || undefined,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      category: task.category,
      dueDate: task.dueDate || '',
      status: task.status,
    });
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (ms?: number) => {
  if (!ms) return '0:00';
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return hours > 0
    ? `${hours}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`
    : `${minutes}:${seconds.toString().padStart(2,'0')}`;
};


  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isEditing) {
    return (
      <Card className="p-4">
        <div className="space-y-4">
          <Input
            value={editData.title}
            onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Task title"
          />
          
          <Textarea
            value={editData.description}
            onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Task description"
            rows={2}
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Select
              value={editData.status}
              onValueChange={(value: 'pending' | 'in-progress' | 'completed') =>
                setEditData(prev => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={editData.priority}
              onValueChange={(value: 'low' | 'medium' | 'high') =>
                setEditData(prev => ({ ...prev, priority: value }))
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

            <Input
              value={editData.category}
              onChange={(e) => setEditData(prev => ({ ...prev, category: e.target.value }))}
              placeholder="Category"
            />

            <Input
              type="date"
              value={editData.dueDate}
              onChange={(e) => setEditData(prev => ({ ...prev, dueDate: e.target.value }))}
            />
          </div>

          <div className="flex space-x-2">
            <Button size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
            <Button variant="outline" size="sm" onClick={handleCancel}>
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-4 ${isCompleted ? 'opacity-75' : ''} ${isOverdue ? 'border-red-200' : ''}`}>
      <div className="flex items-start space-x-3">
        <Checkbox
          checked={isCompleted}
          onCheckedChange={() => onToggleStatus(task.id)}
          className="mt-1"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className={`font-medium ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                {task.title}
              </h4>
              {task.description && (
                <p className={`text-sm mt-1 ${isCompleted ? 'line-through text-muted-foreground' : 'text-muted-foreground'}`}>
                  {task.description}
                </p>
              )}
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(task.id)}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center space-x-4 mt-3">
            <div className="flex items-center space-x-2">
              <Badge className={getStatusColor(task.status)}>
                <Clock className="h-3 w-3 mr-1" />
                {task.status.replace('-', ' ')}
              </Badge>
              
              <Badge className={getPriorityColor(task.priority)}>
                <Flag className="h-3 w-3 mr-1" />
                {task.priority}
              </Badge>

              {task.category && (
                <Badge variant="outline">
                  <Tag className="h-3 w-3 mr-1" />
                  {task.category}
                </Badge>
              )}
            </div>
                      <div className="flex items-center space-x-2 ml-auto">
            {task.isTimerRunning ? (
              <Button size="sm" variant="outline" onClick={() => onStopTimer(task.id)}>
                <Square className="h-3 w-3 mr-1" /> Stop
              </Button>
            ) : (
              <Button size="sm" variant="outline" onClick={() => onStartTimer(task.id)}>
                <Play className="h-3 w-3 mr-1" /> Start
              </Button>
            )}
            <span className="ml-2 text-sm">{formatTime(liveTime)}</span>
          </div>

            {task.dueDate && (
  <div
    className={`flex items-center text-sm ${
      isOverdue ? "text-red-600" : "text-muted-foreground"
    }`}
  >
    <Calendar className="h-3 w-3 mr-1" />

    {/* Parse as local date to prevent off-by-one shift */}
    {(() => {
      const [year, month, day] = task.dueDate.split("-").map(Number);
      const localDate = new Date(year, month - 1, day);
      return localDate.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    })()}

    {isOverdue && <span className="ml-1 font-medium">(Overdue)</span>}
  </div>
)}

          </div>

          <div className="text-xs text-muted-foreground mt-2">
            Created {formatDate(task.createdAt)}
            {task.updatedAt !== task.createdAt && (
              <span> • Updated {formatDate(task.updatedAt)}</span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}