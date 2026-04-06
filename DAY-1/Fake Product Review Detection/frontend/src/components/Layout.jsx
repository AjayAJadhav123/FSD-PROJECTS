/**
 * Main Layout Component with Sidebar Navigation.
 * Wraps all authenticated pages with a consistent layout.
 */
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineChartBarSquare,
  HiOutlinePlusCircle,
  HiOutlineClipboardDocumentList,
  HiOutlineArrowRightOnRectangle,
  HiOutlineShieldCheck,
  HiOutlineUser,
} from 'react-icons/hi2';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: HiOutlineChartBarSquare },
    { path: '/add-review', label: 'Add Review', icon: HiOutlinePlusCircle },
    { path: '/all-reviews', label: 'All Reviews', icon: HiOutlineClipboardDocumentList },
  ];

  return (
    <div className="flex min-h-screen bg-dark-950">
      {/* ============================================================
          Sidebar
          ============================================================ */}
      <aside className="w-72 border-r border-dark-800/50 bg-dark-900/80 backdrop-blur-xl flex flex-col fixed h-full z-20">
        {/* Logo / Brand */}
        <div className="p-6 border-b border-dark-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/20">
              <HiOutlineShieldCheck className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-dark-100">ReviewGuard</h1>
              <p className="text-xs text-dark-500">Fake Review Detection</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1">
          <p className="text-xs text-dark-500 uppercase tracking-wider px-3 mb-3 font-semibold">Main Menu</p>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <item.icon className="text-xl" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-dark-800/50">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-dark-800/50 mb-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-dark-100 truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-dark-500 truncate">{user?.email || ''}</p>
            </div>
            {user?.role === 'admin' && (
              <span className="text-[10px] bg-primary-500/20 text-primary-400 px-2 py-0.5 rounded-full font-semibold">
                Admin
              </span>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="sidebar-link w-full text-danger-400 hover:bg-danger-500/10"
          >
            <HiOutlineArrowRightOnRectangle className="text-xl" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ============================================================
          Main Content
          ============================================================ */}
      <main className="flex-1 ml-72 min-h-screen">
        <div className="p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
