import Navbar from '../components/Navbar';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-2">Welcome to the dashboard!</p>
      </div>
    </div>
  );
}
