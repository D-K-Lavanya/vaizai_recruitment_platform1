import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function JobList({ onScreen }) {
  // Pre-load original sample data so there is NO blank state
  const [jobs, setJobs] = useState([
    {
      _id: 'sample-1',
      title: 'Senior AI Engineer',
      company: 'VaizAI Corp',
      location: 'Remote',
      description: 'Lead the development of our neural resume parsing engine and rank optimization logic.'
    },
    {
      _id: 'sample-2',
      title: 'Frontend Architect',
      company: 'VaizAI Corp',
      location: 'San Francisco, CA',
      description: 'Design and implement high-performance recruitment dashboards using React and advanced CSS.'
    }
  ]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get('/jobs');
        if (response.data && response.data.length > 0) {
          setJobs(response.data);
        }
      } catch (err) {
        console.log('Using offline matrix');
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="space-y-6">
      {jobs.map((job) => (
        <div key={job._id} className="group p-6 bg-brand-surface border border-brand-border rounded-2xl hover:border-brand-primary/30 transition-all duration-300 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="text-left">
              <h3 className="text-xl font-bold text-brand-text group-hover:text-brand-primary transition-colors">{job.title}</h3>
              <p className="text-brand-primary font-bold text-xs uppercase tracking-widest">{job.company}</p>
            </div>
            <span className="px-3 py-1 bg-brand-bg border border-brand-border text-brand-muted text-[10px] font-black rounded-full uppercase">
              {job.location}
            </span>
          </div>
          <p className="text-brand-muted text-sm line-clamp-3 text-left">{job.description}</p>
          <div className="mt-6 pt-6 border-t border-brand-border text-left">
            <button 
              onClick={() => onScreen(job)}
              className="px-5 py-2 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-black rounded-lg hover:bg-brand-primary hover:text-slate-950 transition-all uppercase"
            >
              Screen Applicants
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
