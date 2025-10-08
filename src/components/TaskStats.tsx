import { Card } from './ui/card';
import { CheckCircle, Clock, AlertCircle, BarChart3 } from 'lucide-react';

interface TaskStatsProps {
  stats: {
    total: number;
    completed: number;
    pending: number;
    inProgress: number;
    overdue: number;
  };
}

export function TaskStats({ stats }: TaskStatsProps) {
  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      <Card className="p-4">
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-sm text-muted-foreground">Total Tasks</p>
          </div>
        </div>
      </Card>
      
      <Card className="p-4">
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <div>
            <p className="text-2xl font-bold">{stats.completed}</p>
            <p className="text-sm text-muted-foreground">Completed</p>
          </div>
        </div>
      </Card>
      
      <Card className="p-4">
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-blue-600" />
          <div>
            <p className="text-2xl font-bold">{stats.pending}</p>
            <p className="text-sm text-muted-foreground">Pending</p>
          </div>
        </div>
      </Card>
      
      <Card className="p-4">
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 bg-yellow-500 rounded-full"></div>
          <div>
            <p className="text-2xl font-bold">{stats.inProgress}</p>
            <p className="text-sm text-muted-foreground">In Progress</p>
          </div>
        </div>
      </Card>
      
      <Card className="p-4">
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <div>
            <p className="text-2xl font-bold">{stats.overdue}</p>
            <p className="text-sm text-muted-foreground">Overdue</p>
          </div>
        </div>
      </Card>
    </div>
  );
}