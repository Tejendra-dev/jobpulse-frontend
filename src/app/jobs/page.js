'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import { getJobs, createJob, updateJob, deleteJob } from '../../lib/api';
import toast from 'react-hot-toast';
import { Plus, Trash2, ExternalLink, Filter, Search } from 'lucide-react';

const PLATFORMS = ['LinkedIn', 'Naukri', 'Internshala', 'Indeed', 'Glassdoor', 'Company Website', 'Referral', 'Other'];
const STATUSES = ['applied', 'interview', 'offer', 'rejected', 'ghost'];

const statusColors = {
  applied:   { bg: '#1e3a5f', text: '#60a5fa', label: 'Applied' },
  interview: { bg: '#064e3b', text: '#34d399', label: 'Interview' },
  offer:     { bg: '#451a03', text: '#fbbf24', label: 'Offer 🎉' },
  rejected:  { bg: '#450a0a', text: '#f87171', label: 'Rejected' },
  ghost:     { bg: '#2d1b1b', text: '#f87171', label: '👻 Ghost' },
};

export default function JobsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editJob, setEditJob] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [form, setForm] = useState({
    company: '', role: '', platform: 'LinkedIn',
    applied_date: new Date().toISOString().split('T')[0],
    notes: '', job_url: '',
  });

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading]);

  useEffect(() => {
    if (user) fetchJobs();
  }, [user, filterStatus]);

  const fetchJobs = async () => {
    setFetching(true);
    try {
      const params = {};
      if (filterStatus) params.status = filterStatus;
      const res = await getJobs(params);
      setJobs(res.data.jobs);
    } catch (err) {
      toast.error('Failed to fetch jobs');
    } finally {
      setFetching(false);
    }
  };

  const resetForm = () => {
    setForm({
      company: '', role: '', platform: 'LinkedIn',
      applied_date: new Date().toISOString().split('T')[0],
      notes: '', job_url: '',
    });
    setEditJob(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editJob) {
        await updateJob(editJob.id, form);
        toast.success('Job updated!');
      } else {
        await createJob(form);
        toast.success('Job added!');
      }
      resetForm();
      fetchJobs();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    }
  };

  const handleEdit = (job) => {
    setForm({
      company: job.company,
      role: job.role,
      platform: job.platform,
      applied_date: job.applied_date?.split('T')[0] || job.applied_date,
      notes: job.notes || '',
      job_url: job.job_url || '',
    });
    setEditJob(job);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this job?')) return;
    try {
      await deleteJob(id);
      toast.success('Job deleted');
      fetchJobs();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleStatusChange = async (job, newStatus) => {
    try {
      await updateJob(job.id, { ...job, status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
      fetchJobs();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const filtered = jobs.filter((j) =>
    j.company.toLowerCase().includes(search.toLowerCase()) ||
    j.role.toLowerCase().includes(search.toLowerCase())
  );

  if (loading || !user) return null;

  return (
    <div className="flex min-h-screen">
      <Navbar />
      <main className="ml-64 flex-1 p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">My Applications</h1>
            <p className="text-gray-400 mt-1">{jobs.length} total jobs tracked</p>
          </div>
          <button onClick={() => { resetForm(); setShowForm(true); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-medium transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
            <Plus size={18} /> Add Job
          </button>
        </div>

        {/* Search + Filter */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl"
            style={{ background: '#1a1a2e', border: '1px solid #2d2d44' }}>
            <Search size={16} className="text-gray-500" />
            <input
              placeholder="Search company or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-sm"
            />
          </div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 rounded-xl text-sm text-white outline-none"
            style={{ background: '#1a1a2e', border: '1px solid #2d2d44' }}>
            <option value="">All Status</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Add/Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background: 'rgba(0,0,0,0.7)' }}>
            <div className="w-full max-w-lg rounded-2xl p-6"
              style={{ background: '#1a1a2e', border: '1px solid #2d2d44' }}>
              <h2 className="text-white font-bold text-lg mb-5">
                {editJob ? 'Edit Job' : '+ Add New Job'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 text-xs mb-1 block">Company *</label>
                    <input required value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      placeholder="Google, TCS, Infosys..."
                      className="w-full px-3 py-2.5 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-purple-500"
                      style={{ background: '#0f0f13', border: '1px solid #2d2d44' }} />
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs mb-1 block">Role *</label>
                    <input required value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                      placeholder="Java Developer, SQL Dev..."
                      className="w-full px-3 py-2.5 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-purple-500"
                      style={{ background: '#0f0f13', border: '1px solid #2d2d44' }} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 text-xs mb-1 block">Platform *</label>
                    <select value={form.platform}
                      onChange={(e) => setForm({ ...form, platform: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl text-white text-sm outline-none"
                      style={{ background: '#0f0f13', border: '1px solid #2d2d44' }}>
                      {PLATFORMS.map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs mb-1 block">Applied Date *</label>
                    <input type="date" required value={form.applied_date}
                      onChange={(e) => setForm({ ...form, applied_date: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl text-white text-sm outline-none"
                      style={{ background: '#0f0f13', border: '1px solid #2d2d44' }} />
                  </div>
                </div>

                <div>
                  <label className="text-gray-400 text-xs mb-1 block">Job URL (optional)</label>
                  <input value={form.job_url}
                    onChange={(e) => setForm({ ...form, job_url: e.target.value })}
                    placeholder="https://linkedin.com/jobs/..."
                    className="w-full px-3 py-2.5 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-purple-500"
                    style={{ background: '#0f0f13', border: '1px solid #2d2d44' }} />
                </div>

                <div>
                  <label className="text-gray-400 text-xs mb-1 block">Notes (optional)</label>
                  <textarea value={form.notes} rows={2}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Referral from X, good company culture..."
                    className="w-full px-3 py-2.5 rounded-xl text-white text-sm outline-none resize-none focus:ring-2 focus:ring-purple-500"
                    style={{ background: '#0f0f13', border: '1px solid #2d2d44' }} />
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={resetForm}
                    className="flex-1 py-2.5 rounded-xl text-gray-400 text-sm font-medium"
                    style={{ border: '1px solid #2d2d44' }}>
                    Cancel
                  </button>
                  <button type="submit"
                    className="flex-1 py-2.5 rounded-xl text-white text-sm font-medium"
                    style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
                    {editJob ? 'Save Changes' : 'Add Job'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Jobs Table */}
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #2d2d44' }}>
          <table className="w-full">
            <thead>
              <tr style={{ background: '#1a1a2e', borderBottom: '1px solid #2d2d44' }}>
                {['Company', 'Role', 'Platform', 'Applied Date', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-4 text-gray-400 text-xs font-medium uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fetching ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-500">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16">
                    <p className="text-gray-500 mb-3">No jobs found</p>
                    <button onClick={() => setShowForm(true)}
                      className="px-5 py-2 rounded-xl text-white text-sm"
                      style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
                      + Add your first job
                    </button>
                  </td>
                </tr>
              ) : (
                filtered.map((job, i) => (
                  <tr key={job.id}
                    style={{
                      background: i % 2 === 0 ? '#0f0f13' : '#1a1a2e',
                      borderBottom: '1px solid #2d2d44'
                    }}>
                    <td className="px-5 py-4">
                      <p className="text-white font-medium text-sm">{job.company}</p>
                      {job.job_url && (
                        <a href={job.job_url} target="_blank" rel="noreferrer"
                          className="text-purple-400 text-xs flex items-center gap-1 mt-0.5 hover:underline">
                          <ExternalLink size={10} /> View posting
                        </a>
                      )}
                    </td>
                    <td className="px-5 py-4 text-gray-300 text-sm">{job.role}</td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-medium"
                        style={{ background: '#2d2d44', color: '#a855f7' }}>
                        {job.platform}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-400 text-sm">
                      {new Date(job.applied_date).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </td>
                    <td className="px-5 py-4">
                      <select value={job.status}
                        onChange={(e) => handleStatusChange(job, e.target.value)}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium outline-none cursor-pointer"
                        style={{
                          background: statusColors[job.status]?.bg,
                          color: statusColors[job.status]?.text,
                          border: 'none'
                        }}>
                        {STATUSES.map(s => <option key={s} value={s}>{statusColors[s]?.label}</option>)}
                      </select>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEdit(job)}
                          className="px-3 py-1.5 rounded-lg text-xs text-purple-400 font-medium hover:bg-purple-500/10 transition-all"
                          style={{ border: '1px solid #7c3aed44' }}>
                          Edit
                        </button>
                        <button onClick={() => handleDelete(job.id)}
                          className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-all">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}