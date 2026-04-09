'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { registerUser } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const res = await registerUser(form);
      login(res.data.token, res.data.user);
      toast.success(`Account created! Welcome, ${res.data.user.name}!`);
      router.push('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #0f0f13 0%, #1a1a2e 100%)' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
            <span className="text-2xl">⚡</span>
          </div>
          <h1 className="text-3xl font-bold text-white">JobPulse AI</h1>
          <p className="text-gray-400 mt-1">Start tracking your job hunt</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8" style={{ background: '#1a1a2e', border: '1px solid #2d2d44' }}>
          <h2 className="text-xl font-semibold text-white mb-6">Create your account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Tejendra Syamala"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-purple-500"
                style={{ background: '#0f0f13', border: '1px solid #2d2d44' }}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-purple-500"
                style={{ background: '#0f0f13', border: '1px solid #2d2d44' }}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Password</label>
              <input
                type="password"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-purple-500"
                style={{ background: '#0f0f13', border: '1px solid #2d2d44' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 hover:opacity-90 disabled:opacity-50 mt-2"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-gray-400 mt-6 text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}