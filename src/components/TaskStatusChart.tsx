import { useMemo } from "react";
import { Pie, PieChart, Cell, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Task } from "../types/task";

interface TaskStatusChartProps {
  tasks: Task[];
}

export function TaskStatusChart({ tasks }: TaskStatusChartProps) {
  const chartData = useMemo(() => {
    const counts = { completed: 0, overdue: 0, working: 0, pending: 0 };
    const now = new Date();

    tasks.forEach((t) => {
      if (t.status === "completed") {
        counts.completed++;
      } else {
        const isOverdue = t.dueDate && new Date(t.dueDate) < now;
        if (isOverdue) {
          counts.overdue++;
        } else if (t.status === "in-progress") {
          counts.working++;
        } else {
          counts.pending++;
        }
      }
    });

    return [
      { name: "Completed", value: counts.completed, color: "#22c55e" }, // Green
      { name: "Overdue", value: counts.overdue, color: "#ef4444" },   // Red
      { name: "Working", value: counts.working, color: "#3b82f6" },   // Blue
      { name: "Pending", value: counts.pending, color: "#9ca3af" },   // Gray
    ].filter((item) => item.value > 0);
  }, [tasks]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Task Overview</CardTitle>
        <CardDescription>
          There are {tasks.length} tasks. 
          ({chartData.map(d => `${d.name}: ${d.value}`).join(', ')})
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center items-center pb-6">
        {tasks.length === 0 ? (
           <div className="text-muted-foreground py-8">No tasks found</div>
        ) : (
          <PieChart width={250} height={250}>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36}/>
          </PieChart>
        )}
      </CardContent>
    </Card>
  );
}