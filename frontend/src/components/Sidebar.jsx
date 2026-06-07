import { useState } from 'react';

export default function Sidebar({ role, activeTab, setActiveTab, onLogout }) {
  const isRecruiter = role === 'recruiter' || role === 'admin';

  const recruiterTabs = [
    { id: 'jobs', name: 'Job Pipeline', icon: '💼' },
    { id: 'candidates', name: 'Candidate Ranking', icon: '🧠' },
    { id: 'interviews', name: 'Video Interviews', icon: '🎥' },
    { id: 'assessments', name: 'Coding Challenges', icon: '💻' },
    { id: 'hr-dashboard', name: 'HR Analytics', icon: '📊' },
    { id: 'billing', name: 'Subscription', icon: '💳' },
    { id: 'settings', name: 'System Settings', icon: '⚙️' },
  ];

  const candidateTabs = [
    { id: 'portal', name: 'My Applications', icon: '📝' },
    { id: 'assessment', name: 'Take Assessment', icon: '🚀' },
    { id: 'interviews', name: 'My Interviews', icon: '📅' },
    { id: 'skill-gap', name: 'Skill Analysis', icon: '📈' },
    { id: 'settings', name: 'Profile Settings', icon: '👤' },
  ];

  const tabs = isRecruiter ? recruiterTabs : candidateTabs;

  return (
    <aside className="w-72 h-screen bg-slate-900 border-r border-brand-border flex flex-col sticky top-0">
      <div className="p-8">
        <h1 className="text-2xl font-black text-brand-text tracking-tight flex items-center gap-3">
          <span className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-slate-950 text-xl font-black shadow-lg shadow-brand-primary/20">V</span>
          VaizAI
        </h1>
        <p className="text-[10px] font-black text-brand-muted uppercase tracking-[0.2em] mt-2 ml-1">Enterprise Core</p>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-brand-primary text-slate-950 shadow-lg shadow-brand-primary/20'
                : 'text-brand-muted hover:text-white hover:bg-slate-800'
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            {tab.name}
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-brand-border space-y-4">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-slate-800 border border-brand-border flex items-center justify-center text-xs font-black text-brand-primary">
            {role[0].toUpperCase()}
          </div>
          <div className="text-left overflow-hidden">
            <p className="text-xs font-black text-white truncate uppercase">{role}</p>
            <p className="text-[10px] text-brand-muted font-bold truncate">Premium Plan</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full py-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-black rounded-xl hover:bg-red-500 hover:text-white transition-all uppercase tracking-widest"
        >
          Logout Session
        </button>
      </div>
    </aside>
  );
}
