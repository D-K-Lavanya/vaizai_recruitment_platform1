export default function HRDashboard() {
  const stats = [
    { label: 'Pipeline Velocity', value: '4.2 Days', growth: '+12%', icon: '⚡' },
    { label: 'Offer Acceptance', value: '89.4%', growth: '+5.1%', icon: '🤝' },
    { label: 'Candidate Diversity', value: '42.1%', growth: '+8.3%', icon: '🌈' },
    { label: 'Screening Accuracy', value: '96.2%', growth: '+2.4%', icon: '🎯' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700 text-left">
      <div>
        <h2 className="text-3xl font-black text-brand-text tracking-tight">Enterprise <span className="text-brand-primary">Analytics</span></h2>
        <p className="text-brand-muted font-bold uppercase tracking-widest text-[10px] mt-1">HR Intelligence & Pipeline Health</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="p-8 bg-brand-surface border border-brand-border rounded-[2.5rem] relative overflow-hidden group hover:border-brand-primary/30 transition-all shadow-xl">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 blur-3xl pointer-events-none group-hover:bg-brand-primary/10 transition-all" />
            <div className="flex items-center justify-between mb-4">
               <span className="text-2xl">{stat.icon}</span>
               <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg uppercase tracking-widest">{stat.growth}</span>
            </div>
            <p className="text-[10px] font-black text-brand-muted uppercase tracking-[0.2em] mb-1">{stat.label}</p>
            <h4 className="text-3xl font-black text-white">{stat.value}</h4>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 p-10 bg-brand-surface border border-brand-border rounded-[3rem] shadow-2xl relative overflow-hidden">
           <div className="flex items-center justify-between mb-10">
              <h3 className="text-xl font-black text-white">Conversion Funnel</h3>
              <select className="bg-slate-950 border border-brand-border text-[10px] font-black text-brand-muted uppercase px-4 py-2 rounded-xl outline-none">
                <option>Last 30 Days</option>
                <option>Last Quarter</option>
              </select>
           </div>
           
           <div className="space-y-6">
              {[
                { label: 'Applications', count: 1240, color: 'bg-brand-primary', width: '100%' },
                { label: 'AI Shortlisted', count: 482, color: 'bg-brand-secondary', width: '38%' },
                { label: 'Interviewed', count: 156, color: 'bg-blue-500', width: '12%' },
                { label: 'Offered', count: 42, color: 'bg-emerald-500', width: '3%' }
              ].map(row => (
                <div key={row.label} className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="text-brand-muted">{row.label}</span>
                    <span className="text-white">{row.count}</span>
                  </div>
                  <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-brand-border/30">
                    <div className={`h-full ${row.color} rounded-full transition-all duration-1000 delay-300`} style={{ width: row.width }} />
                  </div>
                </div>
              ))}
           </div>
        </div>

        <div className="lg:col-span-4 p-10 bg-brand-surface border border-brand-border rounded-[3rem] shadow-2xl flex flex-col justify-center items-center text-center">
           <div className="w-32 h-32 border-8 border-brand-primary/20 border-t-brand-primary rounded-full flex items-center justify-center mb-6">
              <span className="text-2xl font-black text-white">82%</span>
           </div>
           <h3 className="text-lg font-black text-white mb-2 uppercase tracking-widest">Recruitment ROI</h3>
           <p className="text-xs text-brand-muted font-bold leading-relaxed">Your neural screening pipeline has saved approximately 142 recruiter hours this month.</p>
        </div>
      </div>
    </div>
  );
}
