import { NavLink, Outlet } from 'react-router-dom';
import { useUserStore } from '../../stores/userStore.ts';

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/pathway', label: 'My Pathway' },
  { to: '/library', label: 'Library' },
  { to: '/notes', label: 'Notes' },
  { to: '/progress', label: 'Progress' },
  { to: '/export', label: 'Export' },
  { to: '/about', label: 'About This Site' },
];

export function Layout() {
  const { profile } = useUserStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <NavLink to="/dashboard" className="text-lg font-bold text-indigo-600">
            DHPrimer: Tutorial Lab
          </NavLink>
          {profile?.onboardingCompleted && (
            <nav className="flex gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `px-3 py-2 text-sm rounded-lg transition-colors ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 font-medium'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          )}
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
