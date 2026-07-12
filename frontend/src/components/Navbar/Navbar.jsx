import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const isLanding = location.pathname === '/';

  if (!user && !isLanding) return null;

  return (
    <nav className={`border-b transition-all duration-300 sticky top-0 z-50 ${
      isLanding && !user
        ? 'border-transparent bg-gray-950/60 backdrop-blur-xl'
        : 'border-gray-800 bg-gray-900/80 backdrop-blur-md'
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to={user ? (isAdmin ? '/admin' : '/dashboard') : '/'} className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-lg font-semibold text-white">CarDesk</span>
        </Link>

        {user ? (
          <div className="flex items-center gap-5">
            {isAdmin && (
              <Link to="/admin" className="text-sm text-gray-400 hover:text-white transition-colors">
                Admin
              </Link>
            )}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-sm font-medium">
                {user.email?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-gray-400 hidden sm:block">{user.email}</span>
            </div>
            <button
              onClick={logout}
              className="text-sm text-gray-500 hover:text-red-400 transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm text-gray-300 hover:text-white px-4 py-2 rounded-xl transition-colors duration-300"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-5 py-2 rounded-xl shadow-lg shadow-blue-500/20 transition-all duration-300 hover:shadow-blue-500/30"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
