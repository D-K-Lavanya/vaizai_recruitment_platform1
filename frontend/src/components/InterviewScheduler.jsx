import { useState } from 'react';
import api from '../api/axios';

export default function InterviewScheduler({ candidate, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    scheduledAt: '',
    type: 'Technical',
    roomLink: '',
    notes: '',
    recruiterName: JSON.parse(localStorage.getItem('user'))?.name || 'Recruiter'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/interviews', {
        ...formData,
        candidate: candidate._id
      });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to schedule interview.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-brand-surface border border-brand-border w-full max-w-lg rounded-3xl shadow-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 blur-3xl pointer-events-none" />
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-black text-brand-text">Schedule <span className="text-brand-primary">Interview</span></h3>
            <p className="text-[10px] font-bold text-brand-muted uppercase tracking-widest mt-1">Candidate: {candidate.name || 'Anonymous'}</p>
          </div>
          <button onClick={onClose} className="p-2 text-brand-muted hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold">{error}</div>}
          
          <div className="space-y-2">
            <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest ml-1">Date & Time</label>
            <input 
              type="datetime-local" 
              required
              className="w-full px-5 py-3 bg-brand-bg border border-brand-border rounded-xl text-brand-text focus:ring-2 focus:ring-brand-primary/50 outline-none transition-all"
              value={formData.scheduledAt}
              onChange={(e) => setFormData({...formData, scheduledAt: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest ml-1">Interview Type</label>
              <select 
                className="w-full px-5 py-3 bg-brand-bg border border-brand-border rounded-xl text-brand-text focus:ring-2 focus:ring-brand-primary/50 outline-none transition-all"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                <option value="Technical">Technical</option>
                <option value="HR">HR</option>
                <option value="Cultural">Cultural</option>
                <option value="Final">Final</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest ml-1">Room Link</label>
              <input 
                type="url" 
                placeholder="Google Meet / Zoom"
                className="w-full px-5 py-3 bg-brand-bg border border-brand-border rounded-xl text-brand-text focus:ring-2 focus:ring-brand-primary/50 outline-none transition-all placeholder:text-brand-muted/30"
                value={formData.roomLink}
                onChange={(e) => setFormData({...formData, roomLink: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-brand-muted uppercase tracking-widest ml-1">Internal Notes</label>
            <textarea 
              placeholder="Focus on React and system design..."
              className="w-full px-5 py-3 bg-brand-bg border border-brand-border rounded-xl text-brand-text focus:ring-2 focus:ring-brand-primary/50 outline-none transition-all h-24 resize-none placeholder:text-brand-muted/30"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-4 bg-brand-bg border border-brand-border text-brand-muted font-black rounded-2xl uppercase tracking-widest hover:text-white transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 py-4 bg-brand-primary text-slate-950 font-black rounded-2xl uppercase tracking-widest shadow-lg shadow-brand-primary/20 hover:bg-brand-secondary transition-all disabled:opacity-50"
            >
              {loading ? 'Scheduling...' : 'Confirm Session'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
