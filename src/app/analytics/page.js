'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import { getAnalytics } from '../../lib/api';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';

const STATUS_COLORS = {
  applied: '#60a5fa',
  interview: '#34d399',
  offer: '#fbbf24',
  rejected: '#f87171',
  ghost: '#a78bfa',
};

export default function AnalyticsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading]);

  useEffect(() => {
    if (user) {
      getAnalytics()
        .then((res) => setData(res.data))
        .catch(console.error)
        .finally(() => setFetching(false));
    }
  }, [user]);

  if (loading || !user) return null;

  const pieData = data ? [
    { name: 'Applied', value: data.summary.applied },
    { name: 'Interview', value: data.summary.interview },
    { name: 'Offer', value: data.summary.offer },
    { name: 'Rejected', value: data.summary.rejected },
    { name: 'Ghost', value: data.summary.ghost },
  ].filter(d => d.value > 0) : [];

  const barData = data?.platformStats?.map(p => ({
    platform: p.platform,
    Total: parseInt(p.total),
    Interviews: parseInt(p.interviews),
    Offers: parseInt(p.offers),
    Ghosts: parseInt(p.ghosts),
  })) || [];

  const monthlyData = data?.monthlyTrend?.map(m => ({
    month: m.month,
    Applications: parseInt(m.total),
  })) || [];

  return (
    <div className="flex min-h-screen">
      <Navbar />
      <main className="ml-64 flex-1 p-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-gray-400 mt-1">Understand your job hunt patterns</p>
        </div>

        {fetching ? (
          <div className="text-center py-20 text-gray-500">Loading analytics...</div>
        ) : !data || data.summary.total === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No data yet</p>
            <p className="text-gray-600 text-sm mt-2">Add some jobs to see your analytics</p>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="rounded-2xl p-5 text-center" style={{ background: '#1a1a2e', border: '1px solid #2d2d44' }}>
                <p className="text-gray-400 text-sm mb-1">Total Applications</p>
                <p className="text-4xl font-bold text-white">{data.summary.total}</p>
              </div>
              <div className="rounded-2xl p-5 text-center" style={{ background: '#1a1a2e', border: '1px solid #2d2d44' }}>
                <p className="text-gray-400 text-sm mb-1">Response Rate</p>
                <p className="text-4xl font-bold text-green-400">{data.summary.responseRate}%</p>
              </div>
              <div className="rounded-2xl p-5 text-center" style={{ background: '#1a1a2e', border: '1px solid #2d2d44' }}>
                <p className="text-gray-400 text-sm mb-1">Ghost Rate</p>
                <p className="text-4xl font-bold text-red-400">{data.summary.ghostRate}%</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Pie Chart */}
              <div className="rounded-2xl p-6" style={{ background: '#1a1a2e', border: '1px solid #2d2d44' }}>
                <h2 className="text-white font-semibold mb-4">Application Status Breakdown</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" outerRadius={90}
                      dataKey="value" nameKey="name" label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`}>
                      {pieData.map((entry) => (
                        <Cell key={entry.name}
                          fill={STATUS_COLORS[entry.name.toLowerCase()] || '#7c3aed'} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: '#1a1a2e', border: '1px solid #2d2d44', borderRadius: '8px' }}
                      labelStyle={{ color: '#fff' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Monthly Trend */}
              <div className="rounded-2xl p-6" style={{ background: '#1a1a2e', border: '1px solid #2d2d44' }}>
                <h2 className="text-white font-semibold mb-4">Monthly Application Trend</h2>
                {monthlyData.length === 0 ? (
                  <div className="flex items-center justify-center h-48 text-gray-500 text-sm">
                    Not enough data yet
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2d2d44" />
                      <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                      <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{ background: '#1a1a2e', border: '1px solid #2d2d44', borderRadius: '8px' }}
                        labelStyle={{ color: '#fff' }} />
                      <Bar dataKey="Applications" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Platform Stats */}
            <div className="rounded-2xl p-6" style={{ background: '#1a1a2e', border: '1px solid #2d2d44' }}>
              <h2 className="text-white font-semibold mb-4">Platform Performance</h2>
              {barData.length === 0 ? (
                <p className="text-gray-500 text-sm">No platform data yet</p>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2d2d44" />
                    <XAxis dataKey="platform" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ background: '#1a1a2e', border: '1px solid #2d2d44', borderRadius: '8px' }}
                      labelStyle={{ color: '#fff' }} />
                    <Legend wrapperStyle={{ color: '#9ca3af' }} />
                    <Bar dataKey="Total" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Interviews" fill="#34d399" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Offers" fill="#fbbf24" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Ghosts" fill="#f87171" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* About to Ghost */}
            {data.aboutToGhost?.length > 0 && (
              <div className="mt-6 rounded-2xl p-6" style={{ background: '#1a0a0a', border: '1px solid #450a0a' }}>
                <h2 className="text-white font-semibold mb-4">⚠️ Jobs About to Ghost ({data.aboutToGhost.length})</h2>
                <div className="grid grid-cols-2 gap-3">
                  {data.aboutToGhost.map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-3 rounded-xl"
                      style={{ background: '#0f0f13' }}>
                      <div>
                        <p className="text-white text-sm font-medium">{job.company}</p>
                        <p className="text-gray-500 text-xs">{job.role} · {job.platform}</p>
                      </div>
                      <span className="text-orange-400 text-xs font-medium">
                        {Math.floor(job.days_since_applied)}d ago
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}