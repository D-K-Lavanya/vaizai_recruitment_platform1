import { useState, useEffect } from 'react';
import api from '../api/axios';
import InterviewScheduler from './InterviewScheduler';

export default function ScreeningDashboard({ jobId, onBack }) {
  const [analytics, setAnalytics] = useState({
    jobTitle: 'Hiring Analysis',
    rankings: []
  });
  const [loading, setLoading] = useState(true);
  const [schedulingCandidate, setSchedulingCandidate] = useState(null);

  const handleDelete = async (candidateId) => {
    if (!window.confirm('Are you sure you want to remove this applicant?')) return;
    
    try {
      await api.delete(`/candidates/${candidateId}`);
      setAnalytics(prev => ({
        ...prev,
        rankings: prev.rankings.filter(c => c._id !== candidateId)
      }));
    } catch (err) {
      console.error('Deletion failed:', err);
      alert('Failed to delete candidate.');
    }
  };

  const handleStatusUpdate = async (candidateId, newStatus) => {
    try {
      await api.patch(`/candidates/${candidateId}/status`, { status: newStatus });
      setAnalytics(prev => ({
        ...prev,
        rankings: prev.rankings.map(c => c._id === candidateId ? { ...c, status: newStatus } : c)
      }));
    } catch (err) {
      console.error('Status update failed:', err);
      alert('Failed to update status.');
    }
  };

  const handleScheduleSuccess = () => {
    const candidateId = schedulingCandidate._id;
    setAnalytics(prev => ({
      ...prev,
      rankings: prev.rankings.map(c => c._id === candidateId ? { ...c, status: 'Interview' } : c)
    }));
    setSchedulingCandidate(null);
    alert('Interview session confirmed and notification sent!');
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/candidates/job/${jobId}/analytics`);
        setAnalytics(response.data);
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    if (jobId) fetchAnalytics();
  }, [jobId]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 text-left">
      {schedulingCandidate && (
        <InterviewScheduler 
          candidate={schedulingCandidate} 
          onClose={() => setSchedulingCandidate(null)} 
          onSuccess={handleScheduleSuccess}
        />
      )}
      
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack} 
          className="text-brand-muted hover:text-brand-primary text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors"
        >
          ← Back to pipeline
        </button>
        <div className="flex gap-2">
          <div className="h-2 w-2 rounded-full bg-brand-primary animate-pulse" />
          <span className="text-[10px] font-black text-brand-muted uppercase tracking-widest">Live Intelligence Active</span>
        </div>
      </div>
      
      <div>
        <h2 className="text-3xl font-black text-brand-text tracking-tight">Screening <span className="text-brand-primary">Intelligence</span></h2>
        <p className="text-brand-muted font-bold uppercase tracking-widest text-[10px] mt-1">{analytics.jobTitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-brand-surface border border-brand-border rounded-3xl shadow-sm relative overflow-hidden group hover:border-brand-primary/20 transition-all">
          <div className="absolute top-0 right-0 w-16 h-16 bg-brand-primary/5 blur-2xl group-hover:bg-brand-primary/10 transition-all" />
          <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest mb-1 relative z-10">Total Applicants</p>
          <span className="text-4xl font-black text-white relative z-10">{analytics.totalApplicants || 0}</span>
        </div>
        <div className="p-6 bg-brand-surface border border-brand-border rounded-3xl shadow-sm relative overflow-hidden group hover:border-brand-primary/20 transition-all">
          <div className="absolute top-0 right-0 w-16 h-16 bg-brand-primary/5 blur-2xl group-hover:bg-brand-primary/10 transition-all" />
          <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest mb-1 relative z-10">Average Match Score</p>
          <span className="text-4xl font-black text-brand-primary relative z-10">{analytics.averageScore || 0}%</span>
        </div>
        <div className="p-6 bg-brand-surface border border-brand-border rounded-3xl shadow-sm relative overflow-hidden group hover:border-brand-primary/20 transition-all">
          <div className="absolute top-0 right-0 w-16 h-16 bg-brand-primary/5 blur-2xl group-hover:bg-brand-primary/10 transition-all" />
          <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest mb-1 relative z-10">Top Accuracy</p>
          <span className="text-4xl font-black text-emerald-400 relative z-10">{analytics.topScore || 0}%</span>
        </div>
      </div>

      <div className="bg-brand-surface border border-brand-border rounded-3xl overflow-hidden shadow-2xl transition-all">
        {loading ? (
          <div className="p-20 text-center">
            <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-brand-muted font-bold uppercase tracking-widest text-xs">Analyzing Pipeline...</p>
          </div>
        ) : analytics.rankings.length > 0 ? (
          <div className="divide-y divide-brand-border">
            {analytics.rankings.map((c, i) => (
              <div key={c._id} className="p-8 flex items-center justify-between group hover:bg-brand-primary/5 transition-all min-h-[140px]">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-full bg-brand-bg border border-brand-border flex items-center justify-center text-xs font-black text-brand-muted group-hover:text-brand-primary group-hover:border-brand-primary/30 transition-all">
                    #{i + 1}
                  </div>
                  <div className="flex flex-col justify-center">
                    <h4 className="text-xl font-black text-brand-text tracking-tight mb-1 leading-tight">
                      {c.name && c.name.trim() ? c.name : 'Anonymous Candidate'}
                    </h4>
                    <div className="flex items-center gap-3">
                      <p className="text-xs text-brand-primary font-bold lowercase tracking-wider">
                        {String(c.email || 'no-email-provided').toLowerCase()}
                      </p>
                      <span className="w-1 h-1 rounded-full bg-brand-border" />
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter border ${
                        c.status === 'Shortlisted' || c.status === 'Interview' ? 'bg-brand-primary/10 border-brand-primary/30 text-brand-primary' :
                        c.status === 'Rejected' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                        'bg-brand-bg border-brand-border text-brand-muted'
                      }`}>
                        {c.status || 'Applied'}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-brand-border" />
                      <p className="text-[10px] text-brand-muted font-bold uppercase tracking-widest">
                        {c.appliedDate ? new Date(c.appliedDate).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' }) : 'Date Unknown'}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-4">
                      {c.matchedSkills && c.matchedSkills.length > 0 ? (
                        c.matchedSkills.map((skill) => (
                          <span key={skill} className="px-2 py-1 bg-brand-primary/10 border border-brand-primary/20 rounded-lg text-[9px] font-black text-brand-primary uppercase tracking-widest">
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-[9px] font-bold text-brand-muted uppercase tracking-widest">No matching skills detected</span>
                      )}
                      
                      <div className="flex items-center gap-2 ml-4 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                        <button 
                          onClick={() => handleStatusUpdate(c._id, 'Shortlisted')}
                          className="px-3 py-1 bg-brand-primary/10 hover:bg-brand-primary text-brand-primary hover:text-white border border-brand-primary/20 text-[9px] font-black uppercase rounded-md transition-all"
                        >
                          Shortlist
                        </button>
                        <button 
                          onClick={() => setSchedulingCandidate(c)}
                          className="px-3 py-1 bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white border border-blue-500/20 text-[9px] font-black uppercase rounded-md transition-all"
                        >
                          Schedule
                        </button>
                        <button 
                          onClick={() => handleStatusUpdate(c._id, 'Rejected')}
                          className="px-3 py-1 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 text-[9px] font-black uppercase rounded-md transition-all"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-right flex flex-col justify-center">
                    <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest mb-1">Match Accuracy</p>
                    <span className="text-4xl font-black text-brand-primary tabular-nums">
                      {c.matchScore || 0}%
                    </span>
                  </div>
                  <button 
                    onClick={() => handleDelete(c._id)}
                    className="p-3 text-brand-muted hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                    title="Delete Applicant"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-20 text-center">
            <p className="text-brand-muted font-bold uppercase tracking-widest text-xs">No applicants found for this position yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
