import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";

export default function Signup({ setUser }: { setUser: (user: string) => void }) {
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
    } catch (err) {
      toast.error("Network error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-96 flex flex-col gap-4"
      >
        <h2 className="text-2xl font-semibold text-center mb-4">Sign Up</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        <button
          type="submit"
          style={{
          width: "100%",                // w-full
          backgroundColor: "#178fd5ff",   // bg-green-500 (Tailwind green-500)
          color: "white",               // text-white
          padding: "0.5rem",            // p-2 (Tailwind spacing)
          borderRadius: "0.25rem",      // rounded
          transition: "background-color 0.2s", // transition-colors
          }}
          className="w-full bg-green-500 text-black p-2 rounded hover:bg-green-500 transition-colors"
        >
          Sign Up
        </button>

        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Log In
          </Link>
        </p>
      </form>
    </div>
  );
}
