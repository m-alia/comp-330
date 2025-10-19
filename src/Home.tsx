export default function Home() {
  const user = localStorage.getItem("user") || "Guest";
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user}!</h1>
      <p>This is your homepage. Add your tasks here.</p>
    </div>
  );
}
