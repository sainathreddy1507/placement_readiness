import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Code2,
  ClipboardList,
  BookOpen,
  User,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/dashboard/practice', label: 'Practice', icon: Code2 },
  { to: '/dashboard/assessments', label: 'Assessments', icon: ClipboardList },
  { to: '/dashboard/resources', label: 'Resources', icon: BookOpen },
  { to: '/dashboard/profile', label: 'Profile', icon: User },
];

export default function DashboardLayout() {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
        <div className="p-6 border-b border-gray-200">
          <NavLink to="/" className="text-xl font-semibold text-gray-900">
            Placement Prep
          </NavLink>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 transition-colors ${
                  isActive
                    ? 'bg-primary text-white font-medium'
                    : 'hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
          <h2 className="text-lg font-medium text-gray-900">Placement Prep</h2>
          <div className="w-9 h-9 rounded-full bg-primary-light flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
