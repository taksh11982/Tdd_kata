import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white">
          Welcome back, {user?.email?.split('@')[0]}
        </h1>
        <p className="text-gray-400 mt-2">
          {isAdmin ? 'Admin' : 'User'} Dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Total Vehicles', value: '--', color: 'from-blue-500 to-indigo-600' },
          { label: 'In Stock', value: '--', color: 'from-emerald-500 to-teal-600' },
          { label: 'Out of Stock', value: '--', color: 'from-rose-500 to-pink-600' },
          { label: 'Categories', value: '--', color: 'from-amber-500 to-orange-600' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors"
          >
            <p className="text-sm text-gray-400">{stat.label}</p>
            <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
        <svg className="w-12 h-12 text-gray-700 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25m-2.25 0h-2.25m0 0V6.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v4.5M7.5 14.25V18" />
        </svg>
        <p className="text-gray-400">Vehicle inventory coming soon</p>
      </div>
    </div>
  );
};

export default Dashboard;
