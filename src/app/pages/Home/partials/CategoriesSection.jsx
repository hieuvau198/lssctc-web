import React from 'react';

// Static categories grid (placeholder). Replace with dynamic data later.
export default function CategoriesSection() {
  const categories = [
    { key: 'safety', label: 'Safety', desc: 'Operational safety & hazard' },
    { key: 'ops', label: 'Operations', desc: 'Crane operations core' },
    { key: 'sim', label: 'Simulation', desc: 'Scenario & environment' },
    { key: 'maintenance', label: 'Maintenance', desc: 'Equipment upkeep' },
    { key: 'logistics', label: 'Logistics', desc: 'Yard / flow optimization' },
    { key: 'assessment', label: 'Assessment', desc: 'Performance evaluation' }
  ];
  return (
    <section id="categories" className="py-14 md:py-18 bg-white">
  <div className="max-w-[1380px] mx-auto px-5 sm:px-6 md:px-10">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="text-xl md:text-2xl font-semibold text-slate-900 tracking-tight">Categories</h2>
          <a href="#" className="text-blue-600 text-sm hover:text-blue-700 font-medium">View all</a>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {categories.map(c => (
            <div key={c.key} className="group relative rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:border-blue-500 hover:shadow-md transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] uppercase tracking-wider text-slate-500">{c.key}</span>
                <span className="text-lg select-none text-blue-500">{symbolFor(c.key)}</span>
              </div>
              <p className="font-medium text-sm text-slate-900 leading-tight">{c.label}</p>
              <p className="mt-1 text-[11px] text-slate-600 line-clamp-2">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function symbolFor(key) {
  switch (key) {
    case 'safety': return '🛡️';
    case 'ops': return '⚙️';
    case 'sim': return '🖥️';
    case 'maintenance': return '🔧';
    case 'logistics': return '🚢';
    case 'assessment': return '📊';
    default: return '📁';
  }
}
