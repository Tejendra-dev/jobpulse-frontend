'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import { getMe, getAnalytics } from '../../lib/api';
import { User, Mail, Calendar, Briefcase, TrendingUp, Award, Ghost } from 'lucide-react';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading]);

  useEffect(() => {
    if (user) {
      getMe().then((res) => setProfile(res.data.user)).catch(console.error);
      getAnalytics().then((res) => setStats(res.data.summary)).catch(console.error);
    }
  }, [user]);

  if (loading || !user) return null;

  return (
    <div className="flex min-h-screen">
      <Navbar />
      <main className="ml-64 flex-1 p-8 max-w-3xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Profile</h1>
          <p className="text-gray-400 mt-1">Your account and job hunt overview</p>
        </div>

        {/* Profile Card */}
        <div className="rounded-2xl p-6 mb-6" style={{ background: '#1a1a2e', border: '1px solid #2d2d44' }}>
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold text-white flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{profile?.name || user?.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Mail size={14} className="text-gray-500" />
                <span className="text-gray-400 text-sm">{profile?.email || user?.email}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Calendar size={14} className="text-gray-500" />
                <span className="text-gray-400 text-sm">
                  Joined {profile?.created_at
                    ? new Date(profile.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })
                    : '—'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[
            { label: 'Total Applied', value: stats?.total || 0, icon: Briefcase, color: '#7c3aed' },
            { label: 'Interviews', value: stats?.interview || 0, icon: TrendingUp, color: '#10b981' },
            { label: 'Offers Received', value: stats?.offer || 0, icon: Award, color: '#f59e0b' },
            { label: 'Ghosted', value: stats?.ghost || 0, icon: Ghost, color: '#ef4444' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="rounded-2xl p-5 flex items-center gap-4"
              style={{ background: '#1a1a2e', border: '1px solid #2d2d44' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: color + '22' }}>
                <Icon size={22} style={{ color }} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">{label}</p>
                <p className="text-2xl font-bold text-white">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Response + Ghost Rate */}
        {stats && stats.total > 0 && (
          <div className="rounded-2xl p-6 mb-6" style={{ background: '#1a1a2e', border: '1px solid #2d2d44' }}>
            <h3 className="text-white font-semibold mb-4">Your Performance</h3>

            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-400 text-sm">Response Rate</span>
                <span className="text-green-400 font-bold">{stats.responseRate}%</span>
              </div>
              <div className="w-full rounded-full h-2.5" style={{ background: '#0f0f13' }}>
                <div className="h-2.5 rounded-full"
                  style={{ width: `${stats.responseRate}%`, background: 'linear-gradient(90deg, #7c3aed, #10b981)' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400 text-sm">Ghost Rate</span>
                <span className="text-red-400 font-bold">{stats.ghostRate}%</span>
              </div>
              <div className="w-full rounded-full h-2.5" style={{ background: '#0f0f13' }}>
                <div className="h-2.5 rounded-full"
                  style={{ width: `${stats.ghostRate}%`, background: 'linear-gradient(90deg, #ef4444, #f87171)' }} />
              </div>
            </div>
          </div>
        )}

        {/* Tip Box */}
        <div className="rounded-2xl p-5" style={{ background: '#1a0d2e', border: '1px solid #7c3aed44' }}>
          <p className="text-purple-300 font-medium text-sm mb-1">💡 Pro Tip</p>
          <p className="text-gray-400 text-sm">
            Follow up on applications after 7 days. Most companies respond within 2 weeks —
            if not, mark it as ghost and move on. Consistency beats perfection in job hunting!
          </p>
        </div>

      </main>
    </div>
  );
}