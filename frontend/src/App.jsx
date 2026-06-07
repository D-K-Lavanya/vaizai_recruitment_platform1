import { useState, useEffect } from 'react';
import axios from 'axios';
import JobForm from './components/JobForm';
import JobList from './components/JobList';
import CandidatePortal from './components/CandidatePortal';
import ScreeningDashboard from './components/ScreeningDashboard';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import CodeWindow from './components/CodeWindow';
import InterviewManager from './components/InterviewManager';
import HRDashboard from './components/HRDashboard';
import BillingManager from './components/BillingManager';
import AssessmentManager from './components/AssessmentManager';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null); 
  const [activeTab, setActiveTab] = useState('');
  const [activeScreenJob, setActiveScreenJob] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsed = JSON.parse(user);
        setIsLoggedIn(true);
        setUserRole(parsed.role);
        setActiveTab(parsed.role === 'candidate' ? 'portal' : 'jobs');
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLogin = (role) => {
    setUserRole(role);
    setIsLoggedIn(true);
    setActiveTab(role === 'candidate' ? 'portal' : 'jobs');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserRole(null);
    setActiveScreenJob(null);
  };

  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    // RECRUITER CONTENT
    if (userRole === 'recruiter' || userRole === 'admin') {
      switch (activeTab) {
        case 'jobs':
          return (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-4">
                <JobForm />
              </div>
              <div className="lg:col-span-8">
                <div className="mb-6 text-left">
                  <h2 className="text-2xl font-black text-white">Active Opportunities</h2>
                  <p className="text-slate-500 text-sm">Neural pipeline synchronization active.</p>
                </div>
                <JobList onScreen={(job) => {
                  setActiveScreenJob(job);
                  setActiveTab('candidates');
                }} />
              </div>
            </div>
          );
        case 'candidates':
          return activeScreenJob ? (
            <ScreeningDashboard jobId={activeScreenJob._id} onBack={() => setActiveScreenJob(null)} />
          ) : (
            <div className="text-center p-20 bg-slate-900 border border-brand-border rounded-3xl">
               <h3 className="text-xl font-black text-white mb-2">No Job Selected</h3>
               <p className="text-brand-muted text-sm mb-6">Select a job from the 'Job Pipeline' to view applicant rankings.</p>
               <button onClick={() => setActiveTab('jobs')} className="px-6 py-2 bg-brand-primary text-slate-950 font-black rounded-xl">Go to Pipeline</button>
            </div>
          );
        case 'interviews':
          return <InterviewManager />;
        case 'hr-dashboard':
          return <HRDashboard />;
        case 'assessments':
          return <AssessmentManager />;
        case 'billing':
          return <BillingManager />;
        default:
          return <div className="text-white text-center p-20">Module "{activeTab}" under development.</div>;
      }
    }

    // CANDIDATE CONTENT
    if (userRole === 'candidate') {
      switch (activeTab) {
        case 'portal':
          return <CandidatePortal />;
        case 'assessment':
          return (
            <div className="max-w-4xl mx-auto">
               <CodeWindow 
                assessment={{
                  title: "Core Technical Evaluation",
                  description: "Complete the following coding challenge to qualify for recruiter review. Your results will be analyzed by our neural engine.",
                  timeLimit: 1800,
                  starterCode: { javascript: "// Start coding here...", python: "# Start coding here..." }
                }}
                onSubmit={(code) => alert('Assessment submitted! Our team will review your code shortly.')}
               />
            </div>
          );
        case 'interviews':
          return (
            <div className="text-center p-20 bg-slate-900 border border-brand-border rounded-3xl">
              <h3 className="text-xl font-black text-white mb-2">My Interviews</h3>
              <p className="text-brand-muted text-sm">View and join your scheduled interview sessions.</p>
            </div>
          );
        default:
          return <div className="text-white text-center p-20">Module "{activeTab}" under development.</div>;
      }
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text font-sans flex overflow-hidden">
      <Sidebar 
        role={userRole} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout} 
      />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 border-b border-brand-border bg-brand-surface/50 backdrop-blur-xl flex items-center justify-between px-10 relative z-10">
          <div>
            <h2 className="text-lg font-black text-white uppercase tracking-widest">
              {activeTab.replace('-', ' ')} <span className="text-brand-primary">Module</span>
            </h2>
          </div>
          
          <div className="flex items-center gap-6">
            <button
              onClick={toggleTheme}
              className="p-2 bg-slate-800 border border-brand-border rounded-xl text-brand-muted hover:text-brand-primary transition-all"
              title="Toggle Theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <div className="h-4 w-px bg-brand-border" />
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest px-2 py-1 bg-brand-primary/10 rounded-lg">Online</span>
              <span className="text-[10px] font-black text-brand-muted uppercase tracking-widest">v1.0.4 stable</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/50 via-brand-bg to-brand-bg">
          <div className="max-w-7xl mx-auto h-full">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
