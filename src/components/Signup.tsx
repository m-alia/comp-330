import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import "../styles/globals.css";
import "../index.css";

interface SignupPageProps {
  setUser: (user: string) => void;
  onSwitchToLogin: () => void;
}

export default function SignupPage({ setUser, onSwitchToLogin }: SignupPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://127.0.0.1:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("user", username);
        setUser(username);
        toast.success("Account created successfully!");
        navigate("/");
      } else {
        toast.error(data.error || "Signup failed");
      }
    } catch {
      toast.error("Network error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <svg
              width="80"
              height="80"
              viewBox="0 0 80 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="8" y="8" width="64" height="64" rx="16" fill="black" />
              <rect x="8" y="8" width="64" height="64" rx="16" stroke="white" strokeWidth="4" />
              <path d="M24 40L34 50L56 28" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="text-gray-900 mb-2">Personal Task Tracker</h1>
          <p className="text-gray-600">Organize and manage your tasks efficiently</p>
        </div>

        {/* Signup Card */}
        <Card>
          <CardHeader>
            <CardTitle>Create an account</CardTitle>
            <CardDescription>Get started with your task tracker today</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div>
              <Button type="submit" style={{ backgroundColor: "#000000", color: "white" }} className="w-full bg-black hover:bg-gray-800">
                Create Account
              </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button
                onClick={onSwitchToLogin}
                className="text-gray-900 hover:underline"
              >
                Sign in
              </button>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
