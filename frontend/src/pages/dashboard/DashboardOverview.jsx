import { useAuth } from '../../hooks/useAuth';

const DashboardOverview = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-lg font-medium">Hello, {user?.full_name}</h3>
        <p className="text-gray-500 mt-2">Welcome to your dashboard. Select an option from the sidebar to continue.</p>
      </div>
    </div>
  );
};

export default DashboardOverview;
