import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function AssessmentManager() {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const response = await api.get('/assessments');
        setAssessments(response.data);
      } catch (err) {
        console.error('Failed to fetch assessments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssessments();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 text-left">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-brand-text tracking-tight">Challenge <span className="text-brand-primary">Factory</span></h2>
          <p className="text-brand-muted font-bold uppercase tracking-widest text-[10px] mt-1">Manage technical evaluation modules</p>
        </div>
        <button className="px-6 py-3 bg-brand-primary text-slate-950 text-xs font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-brand-primary/20 hover:bg-brand-secondary transition-all">
          Deploy New Challenge +
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {loading ? (
          <div className="col-span-full p-20 text-center">
            <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-brand-muted font-bold uppercase tracking-widest text-xs">Syncing Challenge Bank...</p>
          </div>
        ) : assessments.length > 0 ? (
          assessments.map((assessment) => (
            <div key={assessment._id} className="p-8 bg-brand-surface border border-brand-border rounded-[2.5rem] relative overflow-hidden group hover:border-brand-primary/20 transition-all">
              <div className="flex justify-between items-start mb-6">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-950 border border-brand-border rounded-xl flex items-center justify-center text-xl">💻</div>
                    <div>
                      <h4 className="text-lg font-black text-white leading-tight">{assessment.title}</h4>
                      <p className="text-[10px] text-brand-muted font-bold uppercase tracking-widest">{assessment.timeLimit / 60} Min Evaluation</p>
                    </div>
                 </div>
                 <button className="text-brand-muted hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                 </button>
              </div>
              <p className="text-xs text-brand-muted font-bold leading-relaxed mb-8 line-clamp-2">{assessment.description}</p>
              
              <div className="flex items-center justify-between pt-6 border-t border-brand-border/50">
                 <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-6 h-6 rounded-full bg-slate-800 border-2 border-brand-surface" />
                    ))}
                    <span className="text-[8px] font-black text-brand-muted ml-4 uppercase tracking-widest flex items-center">42 Submissions</span>
                 </div>
                 <button className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em] hover:underline">View Analytics →</button>
              </div>
            </div>
          ))
        ) : (
           <div className="col-span-full p-20 text-center bg-brand-surface border border-brand-border rounded-[3rem]">
            <p className="text-brand-muted font-bold uppercase tracking-widest text-xs">Your Challenge Bank is currently empty.</p>
          </div>
        )}
      </div>
    </div>
  );
}
