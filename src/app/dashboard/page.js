'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import { getJobs, getAnalytics } from '../../lib/api';
import { Briefcase, Ghost, TrendingUp, Award, Clock } from 'lucide-react';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [recentJobs, setRecentJobs] = useState([]);
  const [aboutToGhost, setAboutToGhost] = useState([]);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading]);

  useEffect(() => {
    if (user) {
      getAnalytics().then((res) => {
        setStats(res.data.summary);
        setAboutToGhost(res.data.aboutToGhost);
      }).catch(console.error);

      getJobs().then((res) => {
        setRecentJobs(res.data.jobs.slice(0, 5));
      }).catch(console.error);
    }
  }, [user]);

  if (loading || !user) return null;

  const statCards = [
    { label: 'Total Applied', value: stats?.total || 0, icon: Briefcase, color: '#7c3aed' },
    { label: 'Interviews', value: stats?.interview || 0, icon: TrendingUp, color: '#10b981' },
    { label: 'Offers', value: stats?.offer || 0, icon: Award, color: '#f59e0b' },
    { label: 'Ghosted', value: stats?.ghost || 0, icon: Ghost, color: '#ef4444' },
  ];

  const statusColors = {
    applied: { bg: '#1e3a5f', text: '#60a5fa' },
    interview: { bg: '#064e3b', text: '#34d399' },
    offer: { bg: '#451a03', text: '#fbbf24' },
    rejected: { bg: '#450a0a', text: '#f87171' },
    ghost: { bg: '#2d1b1b', text: '#f87171' },
  };

  return (
    <div className="flex min-h-screen">
      <Navbar />
      <main className="ml-64 flex-1 p-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, {user.name.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-400 mt-1">Here's your job hunt summary</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {statCards.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="rounded-2xl p-5"
              style={{ background: '#1a1a2e', border: '1px solid #2d2d44' }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-gray-400 text-sm">{label}</p>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: color + '22' }}>
                  <Icon size={18} style={{ color }} />
                </div>
              </div>
              <p className="text-3xl font-bold text-white">{value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Recent Applications */}
          <div className="rounded-2xl p-6" style={{ background: '#1a1a2e', border: '1px solid #2d2d44' }}>
            <h2 className="text-white font-semibold mb-4">Recent Applications</h2>
            {recentJobs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No jobs added yet</p>
                <button onClick={() => router.push('/jobs')}
                  className="mt-3 px-4 py-2 rounded-xl text-sm text-white"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
                  Add your first job
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentJobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-3 rounded-xl"
                    style={{ background: '#0f0f13' }}>
                    <div>
                      <p className="text-white text-sm font-medium">{job.company}</p>
                      <p className="text-gray-500 text-xs">{job.role} · {job.platform}</p>
                    </div>
                    <span className="px-2 py-1 rounded-lg text-xs font-medium"
                      style={{
                        background: statusColors[job.status]?.bg,
                        color: statusColors[job.status]?.text
                      }}>
                      {job.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* About to Ghost */}
          <div className="rounded-2xl p-6" style={{ background: '#1a1a2e', border: '1px solid #2d2d44' }}>
            <h2 className="text-white font-semibold mb-1">⚠️ About to Ghost</h2>
            <p className="text-gray-500 text-xs mb-4">Applied 10-15 days ago, no response</p>
            {aboutToGhost.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">No jobs about to ghost 🎉</p>
              </div>
            ) : (
              <div className="space-y-3">
                {aboutToGhost.map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-3 rounded-xl"
                    style={{ background: '#1a0a0a', border: '1px solid #450a0a' }}>
                    <div>
                      <p className="text-white text-sm font-medium">{job.company}</p>
                      <p className="text-gray-500 text-xs">{job.role} · {job.platform}</p>
                    </div>
                    <div className="flex items-center gap-1 text-orange-400">
                      <Clock size={12} />
                      <span className="text-xs">{Math.floor(job.days_since_applied)}d</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Ghost rate bar */}
        {stats && stats.total > 0 && (
          <div className="mt-6 rounded-2xl p-6" style={{ background: '#1a1a2e', border: '1px solid #2d2d44' }}>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-white font-semibold">Response Rate</h2>
              <span className="text-green-400 font-bold">{stats.responseRate}%</span>
            </div>
            <div className="w-full rounded-full h-3" style={{ background: '#0f0f13' }}>
              <div className="h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${stats.responseRate}%`,
                  background: 'linear-gradient(135deg, #7c3aed, #10b981)'
                }} />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-gray-500 text-xs">Ghost rate: {stats.ghostRate}%</span>
              <span className="text-gray-500 text-xs">{stats.total} total applications</span>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}