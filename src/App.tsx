import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTasks } from "./hooks/useTasks";
import { TaskStats } from "./components/TaskStats";
import { AddTaskForm } from "./components/AddTaskForm";
import { TaskFilters } from "./components/TaskFilters";
import { TaskList } from "./components/TaskList";
import { Toaster, toast } from "sonner";
import { CheckSquare } from "lucide-react";
import LoginPage from "./components/Login";
import SignupPage from "./components/Signup";
import "./index.css";
import "./styles/globals.css";


export default function App() {
  const [user, setUser] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<"login" | "signup">("login");

  // Load logged-in user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(savedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    toast("Logged out successfully");
  };

  // Task logic
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
  } = useTasks(user || undefined);

  const handleAddTask = (taskData: Parameters<typeof addTask>[0]) => {
    addTask(taskData);
    toast.success("Task added successfully!");
  };

  const handleUpdateTask = (id: string, updates: Parameters<typeof updateTask>[1]) => {
    updateTask(id, updates);
    toast.success("Task updated successfully!");
  };

  const handleDeleteTask = (id: string) => {
    deleteTask(id);
    toast.success("Task deleted successfully!");
  };

  const handleToggleTask = (id: string) => {
    toggleTaskStatus(id);
    const task = tasks.find((t) => t.id === id);
    if (task) {
      const newStatus = task.status === "completed" ? "pending" : "completed";
      toast.success(
        newStatus === "completed"
          ? "Task marked as completed!"
          : "Task marked as pending!"
      );
    }
  };

  // Home page
  const HomePage = () => (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary text-primary-foreground rounded-lg">
              <CheckSquare className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Personal Task Tracker</h1>
              <p className="text-muted-foreground">
                Welcome, {user}! Organize and manage your tasks efficiently.
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: "8%",
              backgroundColor: "#000000",
              color: "white",
              padding: "0.5rem",
              borderRadius: "0.25rem",
              transition: "background-color 0.2s",
            }}
          >
            Logout
          </button>
        </div>

        {/* Task UI */}
        <TaskStats stats={stats} />
        <AddTaskForm onAddTask={handleAddTask} categories={categories} />
        <TaskFilters
          filters={filters}
          onFiltersChange={setFilters}
          categories={categories}
          taskCount={tasks.length}
        />
        <TaskList
          tasks={tasks}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
          onToggleTask={handleToggleTask}
        />
        <Toaster />
      </div>
    </div>
  );

  // Auth page toggle
  const AuthPage = () =>
    currentPage === "login" ? (
      <LoginPage
        setUser={setUser}
        onSwitchToSignUp={() => setCurrentPage("signup")}
      />
    ) : (
      <SignupPage
        setUser={setUser}
        onSwitchToLogin={() => setCurrentPage("login")}
      />
    );

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <HomePage /> : <AuthPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
