import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function InterviewManager() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const response = await api.get('/interviews');
        setInterviews(response.data);
      } catch (err) {
        console.error('Failed to fetch interviews:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to cancel and remove this interview session?')) return;
    
    try {
      await api.delete(`/interviews/${id}`);
      setInterviews(prev => prev.filter(interview => interview._id !== id));
    } catch (err) {
      console.error('Deletion failed:', err);
      alert('Failed to remove interview session.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
      case 'Completed': return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
      case 'Cancelled': return 'bg-red-500/10 border-red-500/30 text-red-400';
      default: return 'bg-slate-800 border-slate-700 text-slate-400';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 text-left">
      <div>
        <h2 className="text-3xl font-black text-brand-text tracking-tight">Interview <span className="text-brand-primary">Control</span></h2>
        <p className="text-brand-muted font-bold uppercase tracking-widest text-[10px] mt-1">Real-time session management</p>
      </div>

      <div className="bg-brand-surface border border-brand-border rounded-3xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-20 text-center">
            <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-brand-muted font-bold uppercase tracking-widest text-xs">Syncing Sessions...</p>
          </div>
        ) : interviews.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/50 border-b border-brand-border">
                  <th className="px-8 py-5 text-[10px] font-black text-brand-muted uppercase tracking-[0.2em]">Candidate</th>
                  <th className="px-8 py-5 text-[10px] font-black text-brand-muted uppercase tracking-[0.2em]">Date & Time</th>
                  <th className="px-8 py-5 text-[10px] font-black text-brand-muted uppercase tracking-[0.2em]">Type</th>
                  <th className="px-8 py-5 text-[10px] font-black text-brand-muted uppercase tracking-[0.2em]">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-brand-muted uppercase tracking-[0.2em]">Link</th>
                  <th className="px-8 py-5 text-[10px] font-black text-brand-muted uppercase tracking-[0.2em]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {interviews.map((interview) => (
                  <tr key={interview._id} className="group hover:bg-brand-primary/5 transition-all">
                    <td className="px-8 py-6">
                      <p className="text-sm font-black text-white">{interview.candidate?.name || 'Anonymous'}</p>
                      <p className="text-[10px] text-brand-primary font-bold lowercase">{interview.candidate?.email}</p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold text-white">
                        {new Date(interview.scheduledAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                      <p className="text-[10px] text-brand-muted font-bold uppercase tracking-widest">
                        {new Date(interview.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[10px] font-black text-white uppercase tracking-widest px-2 py-1 bg-slate-800 rounded-lg border border-slate-700">
                        {interview.type}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${getStatusColor(interview.status)}`}>
                        {interview.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      {interview.roomLink ? (
                        <a 
                          href={interview.roomLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[10px] font-black text-brand-primary hover:text-white uppercase tracking-[0.2em] transition-all"
                        >
                          Join Session →
                        </a>
                      ) : (
                        <span className="text-[10px] font-black text-brand-muted uppercase tracking-widest italic">Pending</span>
                      )}
                    </td>
                    <td className="px-8 py-6">
                       <button 
                        onClick={() => handleDelete(interview._id)}
                        className="p-2 text-brand-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                        title="Cancel Interview"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-20 text-center">
            <p className="text-brand-muted font-bold uppercase tracking-widest text-xs">No interviews scheduled in this cycle.</p>
          </div>
        )}
      </div>
    </div>
  );
}
