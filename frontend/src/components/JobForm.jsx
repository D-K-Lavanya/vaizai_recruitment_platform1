import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function JobForm() {
  const [formData, setFormData] = useState({
    title: '',
    company: 'VaizAI Corp',
    location: '',
    description: '',
    requirements: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', msg: '' });
    
    try {
      const requirementsArray = formData.requirements.split(',').map(s => s.trim()).filter(s => s !== '');
      await api.post('/jobs', {
        ...formData,
        requirements: requirementsArray
      });
      setStatus({ type: 'success', msg: 'Neural pipeline updated with new job opportunity!' });
      setFormData({ title: '', company: 'VaizAI Corp', location: '', description: '', requirements: '' });
    } catch (err) {
      setStatus({ type: 'error', msg: 'Failed to sync job. Check network protocols.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-brand-bg border border-brand-border p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 blur-3xl pointer-events-none group-hover:bg-brand-primary/10 transition-all" />
      
      <div className="relative z-10 text-left">
        <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
          <span className="w-2 h-6 bg-brand-primary rounded-full" />
          Provision <span className="text-brand-secondary">Job</span>
        </h3>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input 
            type="text" 
            placeholder="Job Title (e.g. Senior AI Engineer)" 
            className="w-full px-5 py-3 bg-slate-950 border border-brand-border rounded-xl text-white focus:ring-2 focus:ring-brand-primary/50 transition-all outline-none"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
          />
          
          <input 
            type="text" 
            placeholder="Location (e.g. Remote, SF)" 
            className="w-full px-5 py-3 bg-slate-950 border border-brand-border rounded-xl text-white focus:ring-2 focus:ring-brand-primary/50 transition-all outline-none"
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
            required
          />

          <textarea 
            placeholder="Neural Requirements (Comma separated skills)" 
            className="w-full px-5 py-3 bg-slate-950 border border-brand-border rounded-xl text-white h-24 focus:ring-2 focus:ring-brand-primary/50 transition-all outline-none resize-none"
            value={formData.requirements}
            onChange={(e) => setFormData({...formData, requirements: e.target.value})}
            required
          />

          <textarea 
            placeholder="Mission Description" 
            className="w-full px-5 py-3 bg-slate-950 border border-brand-border rounded-xl text-white h-32 focus:ring-2 focus:ring-brand-primary/50 transition-all outline-none resize-none"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            required
          />

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-brand-primary hover:bg-brand-secondary text-slate-950 font-black rounded-2xl uppercase tracking-widest transition-all shadow-lg shadow-brand-primary/20 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Deploy Opportunity'}
          </button>

          {status.msg && (
            <div className={`p-4 rounded-xl text-xs font-black uppercase tracking-widest text-center border animate-in slide-in-from-top-2 ${
              status.type === 'success' ? 'bg-brand-primary/10 border-brand-primary/30 text-brand-primary' : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}>
              {status.msg}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
