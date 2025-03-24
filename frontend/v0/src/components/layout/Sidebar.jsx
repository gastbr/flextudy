import { Link } from 'react-router';
import { useAuth } from '../../hooks/useAuth';

function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="hidden md:flex w-64 bg-gray-100 border-r flex-col">
      <nav className="flex flex-col gap-1 p-2 flex-1">
        <NavItem href="/dashboard" label="Calendar" />
        <NavItem href="/dashboard/classes" label="My Classes" />
        {user?.role === 'student' && (
          <NavItem href="/dashboard/wallet" label="Wallet" />
        )}
        <NavItem href="/dashboard/profile" label="Profile" />
        <NavItem href="/dashboard/settings" label="Settings" />
        {user?.role === 'admin' && (
          <div className="mt-2 pt-2 border-t">
            <div className="px-3 py-1.5 text-xs font-medium text-gray-500">Admin</div>
            <NavItem href="/dashboard/users" label="User Management" />
            <NavItem href="/dashboard/admin/settings" label="Platform Settings" />
          </div>
        )}
      </nav>
    </aside>
  );
}

function NavItem({ href, label }) {
  return (
    <Link
      to={href}
      className="flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-gray-100"
    >
      <span>{label}</span>
    </Link>
  );
}

export default Sidebar;
