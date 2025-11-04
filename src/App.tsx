import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
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

// Utility to parse a local YYYY-MM-DD date string to a Date object
const parseLocalDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
};

export default function App() {
  const [user, setUser] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<"login" | "signup">("login");
  const hasShownLoginToasts = useRef(false); // 👈 prevents repeated toasts

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

  // Load logged-in user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(savedUser);
  }, []);

  // Show overdue/upcoming task notifications only once after login
  useEffect(() => {
    if (!user || hasShownLoginToasts.current) return;
    if (tasks.length === 0) return;

    const now = new Date();
    let showedToast = false;

    tasks.forEach((task) => {
      if (task.dueDate && task.status !== "completed") {
        const due = parseLocalDate(task.dueDate);
        const diffMs = due.getTime() - now.getTime();
        const diffHours = diffMs / (1000 * 60 * 60);

        if (diffHours < 0) {
          toast.error(`Overdue: "${task.title}" was due on ${due.toLocaleDateString()}`, { closeButton: true });
          showedToast = true;
        } else if (diffHours <= 24) {
          toast(`Upcoming: "${task.title}" is due on ${due.toLocaleDateString()}`, { closeButton: true });
          showedToast = true;
        }
      }
    });

    if (showedToast) hasShownLoginToasts.current = true; // 👈 mark as shown
  }, [user, tasks]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    hasShownLoginToasts.current = false; // 👈 reset so it shows next login
    toast("Logged out successfully", { closeButton: true });
  };

  const handleAddTask = (taskData: Parameters<typeof addTask>[0]) => {
    addTask(taskData);
    toast.success("Task added successfully!", { closeButton: true });
  };

  const handleUpdateTask = (id: string, updates: Parameters<typeof updateTask>[1]) => {
    updateTask(id, updates);
    toast.success("Task updated successfully!", { closeButton: true });
  };

  const handleDeleteTask = (id: string) => {
    deleteTask(id);
    toast.success("Task deleted successfully!", { closeButton: true });
  };

  const handleToggleTask = (id: string) => {
    toggleTaskStatus(id);
    const task = tasks.find((t) => t.id === id);
    if (task) {
      const newStatus = task.status === "completed" ? "pending" : "completed";
      toast.success(
        newStatus === "completed"
          ? `Task "${task.title}" completed! 🎉`
          : `Task "${task.title}" marked as pending`,
        { closeButton: true }
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
      {/* Toaster at top level */}
      <Toaster position="top-right" />

      <Routes>
        <Route path="/" element={user ? <HomePage /> : <AuthPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
