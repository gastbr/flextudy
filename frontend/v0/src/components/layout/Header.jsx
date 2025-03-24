import { Link } from 'react-router';
import { useAuth } from '../../hooks/useAuth';

function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-primary py-4 shadow-md">
      <nav className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-lg font-bold text-white hover:text-white">
            FCT School
          </Link>
        </div>
        <div className="flex items-center">
          {user && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gray-200"></div>
              <div className="hidden md:block">
                <div className="text-sm font-medium text-white">{user.name}</div>
                <div className="text-xs text-gray-200">{user.role}</div>
              </div>
            </div>
          )}
          <button
            onClick={logout}
            className="text-sm text-white hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
          >
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Header;
