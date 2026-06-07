export default function BillingManager() {
  const plans = [
    { name: 'Starter', price: '$99', features: ['10 Active Jobs', 'AI Basic Parsing', 'Standard Support'], active: false },
    { name: 'Professional', price: '$299', features: ['50 Active Jobs', 'Neural Ranking Engine', 'Interview Scheduler', 'Priority Support'], active: true },
    { name: 'Enterprise', price: 'Custom', features: ['Unlimited Everything', 'Full NLP Customization', 'Dedicated Account Manager', '24/7 Priority'], active: false },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700 text-left">
      <div>
        <h2 className="text-3xl font-black text-brand-text tracking-tight">Subscription <span className="text-brand-primary">Control</span></h2>
        <p className="text-brand-muted font-bold uppercase tracking-widest text-[10px] mt-1">Manage your enterprise license and usage</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div key={plan.name} className={`p-10 border-2 rounded-[3rem] relative overflow-hidden transition-all duration-300 ${
            plan.active 
            ? 'bg-brand-primary/5 border-brand-primary shadow-2xl scale-105' 
            : 'bg-brand-surface border-brand-border hover:border-brand-primary/30'
          }`}>
            {plan.active && (
              <div className="absolute top-6 right-6 bg-brand-primary text-slate-950 text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em]">Current Plan</div>
            )}
            
            <h3 className="text-xl font-black text-white mb-1 uppercase tracking-widest">{plan.name}</h3>
            <div className="flex items-baseline gap-1 mb-8">
               <span className="text-4xl font-black text-white">{plan.price}</span>
               {plan.price !== 'Custom' && <span className="text-xs text-brand-muted font-bold">/month</span>}
            </div>

            <ul className="space-y-4 mb-10">
              {plan.features.map(feature => (
                <li key={feature} className="flex items-center gap-3 text-xs font-bold text-brand-muted group">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                  {feature}
                </li>
              ))}
            </ul>

            <button className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${
              plan.active 
              ? 'bg-brand-primary text-slate-950 shadow-lg shadow-brand-primary/20' 
              : 'bg-slate-950 border border-brand-border text-brand-muted hover:text-white hover:border-brand-primary'
            }`}>
              {plan.active ? 'Manage Billing' : 'Upgrade Pipeline'}
            </button>
          </div>
        ))}
      </div>

      <div className="p-10 bg-slate-950/50 border border-brand-border border-dashed rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-8">
         <div className="text-left">
            <h4 className="text-lg font-black text-white mb-2 uppercase tracking-widest">Usage Quota</h4>
            <p className="text-xs text-brand-muted font-bold">You have utilized 4.2GB of 10GB NLP processing storage.</p>
         </div>
         <div className="w-full md:w-64 h-3 bg-slate-900 rounded-full overflow-hidden border border-brand-border">
            <div className="h-full bg-brand-primary w-[42%] rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
         </div>
      </div>
    </div>
  );
}
