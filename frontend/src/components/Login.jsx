import { useState } from 'react';
import api from '../api/axios';

export default function Login({ onLogin }) {
  const [role, setRole] = useState('recruiter'); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('user', JSON.stringify(response.data.user));
      onLogin(response.data.user.role);
    } catch (err) {
      if (err.response) {
        // The server responded with a status code that falls out of the range of 2xx
        setError(err.response.data.message || 'Authentication failed. Please check your credentials.');
      } else if (err.request) {
        // The request was made but no response was received
        setError('No response from server. Check if backend is running on Port 5000.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError('Request error: ' + err.message);
      }
      
      // Legacy fallback for admin if backend is totally down
      if (!err.response && email === 'admin@vaizai.com' && password === 'password123') {
        const mock = { name: 'Admin', role: 'admin' };
        localStorage.setItem('user', JSON.stringify(mock));
        onLogin('admin');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />

      <div className="w-full max-w-md relative z-10 text-center">
        <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-slate-950 text-3xl font-black mx-auto mb-6 shadow-lg shadow-emerald-500/20">V</div>
        <h1 className="text-3xl font-black text-white mb-2">VaizAI <span className="text-emerald-400">Platform</span></h1>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em] mb-10">Modern Recruitment Intelligence</p>

        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
          <div className="flex gap-4 mb-8">
            <button onClick={() => setRole('recruiter')} className={`flex-1 py-3 rounded-xl border-2 transition-all text-xs font-bold uppercase ${role === 'recruiter' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' : 'border-slate-800 text-slate-500'}`}>Recruiter</button>
            <button onClick={() => setRole('candidate')} className={`flex-1 py-3 rounded-xl border-2 transition-all text-xs font-bold uppercase ${role === 'candidate' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' : 'border-slate-800 text-slate-500'}`}>Candidate</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold">{error}</div>}
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-5 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-white outline-none focus:ring-2 focus:ring-emerald-500/50" placeholder="Email Address" />
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-5 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-white outline-none focus:ring-2 focus:ring-emerald-500/50" placeholder="Password" />
            <button type="submit" disabled={loading} className="w-full py-4 bg-emerald-500 text-slate-950 font-black rounded-2xl uppercase tracking-widest shadow-lg shadow-emerald-500/20">{loading ? 'Loading...' : 'Enter Workspace'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
