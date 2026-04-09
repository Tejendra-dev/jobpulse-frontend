'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Briefcase, BarChart2, User, LogOut } from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/jobs', label: 'Jobs', icon: Briefcase },
  { href: '/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 flex flex-col"
      style={{ background: '#1a1a2e', borderRight: '1px solid #2d2d44' }}>

      {/* Logo */}
      <div className="p-6 border-b" style={{ borderColor: '#2d2d44' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
            <span className="text-lg">⚡</span>
          </div>
          <div>
            <h1 className="font-bold text-white text-lg leading-tight">JobPulse</h1>
            <p className="text-xs text-purple-400">AI Tracker</p>
          </div>
        </div>
      </div>

      {/* User info */}
      <div className="px-4 py-4 border-b" style={{ borderColor: '#2d2d44' }}>
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl"
          style={{ background: '#0f0f13' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-white text-sm font-medium truncate">{user?.name}</p>
            <p className="text-gray-500 text-xs truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group"
              style={{
                background: active ? 'linear-gradient(135deg, #7c3aed22, #a855f722)' : 'transparent',
                border: active ? '1px solid #7c3aed44' : '1px solid transparent',
              }}>
              <Icon size={18} className={active ? 'text-purple-400' : 'text-gray-500'} />
              <span className={`text-sm font-medium ${active ? 'text-purple-300' : 'text-gray-400'}`}>
                {label}
              </span>
              {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400" />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t" style={{ borderColor: '#2d2d44' }}>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-red-400 transition-all duration-200"
          style={{ border: '1px solid #2d2d44' }}>
          <LogOut size={18} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}