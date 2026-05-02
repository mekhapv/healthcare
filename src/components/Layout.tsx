import { Activity, Bell, Home, LogOut, UsersRound } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';
import { useAppStore } from '../store/appStore';

const navItems = [
  { to: '/', label: 'Dashboard', icon: Home },
  { to: '/analytics', label: 'Analytics', icon: Activity },
  { to: '/patients', label: 'Patients', icon: UsersRound },
];

export function Layout() {
  const navigate = useNavigate();
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);
  const notificationCount = useAppStore((state) => state.notificationCount);

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
    }
    setUser(null);
    navigate('/login', { replace: true });
  };

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Primary navigation">
        <div className="brand">
          <span className="brand-mark">C</span>
          <div>
            <strong>CareOps Cloud</strong>
            <span>Provider command center</span>
          </div>
        </div>

        <nav className="nav-list">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} className="nav-link">
              <item.icon size={18} aria-hidden="true" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div>
            <p className="eyebrow">B2B Healthcare SaaS</p>
            <h1>Operational Overview</h1>
          </div>
          <div className="topbar-actions">
            <span className="notification-pill" aria-label={`${notificationCount} notifications sent`}>
              <Bell size={16} aria-hidden="true" />
              {notificationCount}
            </span>
            <div className="user-chip">
              <span>{user?.displayName ?? 'Care Manager'}</span>
              <small>{user?.email}</small>
            </div>
            <button className="icon-button" type="button" onClick={handleLogout} aria-label="Log out">
              <LogOut size={18} />
            </button>
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
