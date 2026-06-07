import { useState, useEffect } from 'react';
import api from '../api/axios';
import CodeWindow from './CodeWindow';

export default function CandidatePortal() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    skills: '',
  });
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [assessmentActive, setAssessmentActive] = useState(false);
  
  // New state for existing profile
  const [profile, setProfile] = useState(null);
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await api.get('/candidate-portal/my-status');
        setProfile(response.data.candidate);
        setInterviews(response.data.interviews);
      } catch (err) {
        // If 404, it means no profile yet, which is fine
        console.log('No existing profile found.');
      }
    };
    fetchStatus();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('phone', formData.phone);
    data.append('skills', formData.skills);
    if (resume) {
      data.append('resume', resume);
    }

    try {
      const response = await api.post('/candidate-portal/submit', data);
      setMessage(`Profile analyzed by VaizAI Intelligence! You can now take your assessment at any time from the 'Take Assessment' tab.`);
      
      // Refresh status after submission
      const statusRes = await api.get('/candidate-portal/my-status');
      setProfile(statusRes.data.candidate);
      
      setFormData({ name: '', email: '', phone: '', skills: '' });
      setResume(null);
    } catch (error) {
      setMessage('Error submitting profile: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleAssessmentSubmit = async (code, candidateEmail) => {
    try {
      const emailToUse = candidateEmail || formData.email;
      const response = await api.post('/assessments/sample-id/submit', { 
        code, 
        email: emailToUse 
      });
      
      alert(response.data.message || 'Assessment submitted successfully!');
      setAssessmentActive(false);
      
      // Refresh status after assessment
      const statusRes = await api.get('/candidate-portal/my-status');
      setProfile(statusRes.data.candidate);
      
      setFormData({ name: '', email: '', phone: '', skills: '' });
      setResume(null);
      setMessage('');
    } catch (error) {
      console.error('Assessment submission failed:', error);
      alert('Failed to submit assessment. Please try again.');
    }
  };

  const getAssessmentByRole = (role) => {
    const defaultAssessment = {
      title: "Frontend Architecture Challenge",
      description: "Design a scalable state management pattern for a real-time dashboard. You must ensure minimal re-renders and handle asynchronous data flows efficiently.",
      timeLimit: 1200, // 20 minutes
      starterCode: {
        javascript: "// JavaScript Solution\nfunction solution(data) {\n  return data;\n}",
        python: "# Python Solution\ndef solution(data):\n    return data"
      }
    };

    if (role?.toLowerCase().includes('data analyst')) {
      return {
        title: "Data Correlation Analysis",
        description: "Analyze the provided dataset to find non-obvious correlations between candidate features and hiring outcomes. Return the top 3 high-impact features.",
        timeLimit: 1800, // 30 minutes
        starterCode: {
          python: "# Data Analyst Python Template\nimport pandas as pd\n\ndef analyze(data):\n    # Your analysis here\n    return results",
          javascript: "// Data Analyst JS Template\nfunction analyze(data) {\n  return [];\n}"
        }
      };
    }
    return defaultAssessment;
  };

  if (assessmentActive) {
    const roleAssessment = getAssessmentByRole(formData.skills || profile?.skills?.[0]); 
    return <CodeWindow assessment={roleAssessment} onSubmit={(code) => handleAssessmentSubmit(code, formData.email || profile?.email)} />;
  }

  if (profile) {
    return (
      <div className="w-full space-y-8 animate-in fade-in duration-700">
        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl relative overflow-hidden text-left">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl pointer-events-none" />
          <h2 className="text-3xl font-black text-white mb-2">Welcome Back, <span className="text-emerald-400">{profile.name}</span></h2>
          <div className="flex items-center gap-4 mt-4">
             <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                profile.status === 'Shortlisted' || profile.status === 'Interview' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                profile.status === 'Rejected' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                'bg-slate-950 border-slate-800 text-slate-500'
              }`}>
                Current Status: {profile.status}
              </span>
              <p className="text-xs text-slate-500 font-bold">Applied on {new Date(profile.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        {profile.status === 'Applied' && (
          <div className="p-10 bg-emerald-500/5 border border-emerald-500/20 rounded-[2rem] text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500/20 group-hover:bg-emerald-500 transition-all" />
            <h4 className="text-2xl font-black text-white mb-3">Ready for the <span className="text-emerald-400">Next Step?</span></h4>
            <p className="text-slate-400 text-sm mb-8 max-w-md mx-auto font-medium">Your profile is active. Complete our neural-pattern assessment to qualify for a recruiter review.</p>
            <button 
              onClick={() => setAssessmentActive(true)}
              className="px-10 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl uppercase tracking-[0.2em] transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
            >
              Begin Assessment
            </button>
          </div>
        )}

        {interviews.length > 0 && (
          <div className="space-y-4 text-left">
            <h3 className="text-xl font-black text-white px-2 flex items-center gap-3">
              <span className="w-2 h-6 bg-blue-500 rounded-full" />
              Upcoming <span className="text-blue-400">Interviews</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {interviews.map(interview => (
                <div key={interview._id} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl hover:border-blue-500/30 transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black rounded-lg uppercase tracking-widest">
                      {interview.type} Session
                    </span>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      {new Date(interview.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <h4 className="text-lg font-black text-white mb-1">{new Date(interview.scheduledAt).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}</h4>
                  <p className="text-xs text-slate-400 font-medium mb-4">With {interview.recruiterName}</p>
                  
                  {interview.roomLink ? (
                    <a 
                      href={interview.roomLink} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-block w-full py-3 bg-blue-500 hover:bg-blue-400 text-slate-950 text-center text-[10px] font-black rounded-xl uppercase tracking-widest transition-all"
                    >
                      Join Meeting Room
                    </a>
                  ) : (
                    <div className="w-full py-3 bg-slate-950 border border-slate-800 text-slate-600 text-[10px] font-black rounded-xl uppercase tracking-widest text-center">
                      Link Pending
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-8 bg-slate-950 border border-slate-800 rounded-3xl text-center">
          <p className="text-sm text-slate-500 font-medium">Want to update your profile? <button onClick={() => setProfile(null)} className="text-emerald-400 hover:underline font-bold">Resubmit Resume</button></p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl relative overflow-hidden animate-in fade-in duration-700">
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl pointer-events-none" />
      
      <div className="relative z-10 text-left">
        <h2 className="text-3xl font-black text-white mb-2">Candidate <span className="text-emerald-400">Portal</span></h2>
        <p className="text-slate-400 text-sm mb-8 font-medium uppercase tracking-wider">Submit your profile to join our talent pool</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-5 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-emerald-500/50 text-white transition-all outline-none" placeholder="Full Name" />
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-5 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-emerald-500/50 text-white transition-all outline-none" placeholder="Email Address" />
          </div>

          <div className="relative group">
            <input type="file" onChange={handleFileChange} accept=".pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
            <div className="w-full px-6 py-10 bg-slate-950 border-2 border-dashed border-slate-800 group-hover:border-emerald-500/50 rounded-2xl flex flex-col items-center justify-center transition-all duration-200">
              <p className="text-sm font-semibold text-slate-300">{resume ? resume.name : 'Click to upload Resume (PDF)'}</p>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl transition-all duration-200 uppercase tracking-widest shadow-lg shadow-emerald-500/20">
            {loading ? 'Processing...' : 'Submit Profile'}
          </button>

          {message && <div className="mt-4 p-4 rounded-xl text-center text-sm font-bold border bg-emerald-500/10 border-emerald-500/50 text-emerald-400">{message}</div>}
        </form>
      </div>
    </div>
  );
}
