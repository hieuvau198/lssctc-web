import React from 'react';

// Recently added courses (static placeholder)
export default function NewCoursesSection() {
  // Extended metadata to support richer card UI (placeholder static data)
  const items = [
    { id: 'n1', title: 'Wind Handling Scenarios', tag: 'New', length: '3h', provider: 'LSSCTC Simulation Lab', type: 'Scenario Pack', level: 'Intermediate' },
    { id: 'n2', title: 'Night Operations Practical', tag: 'New', length: '2h', provider: 'Instructor Team', type: 'Workshop', level: 'All Levels' },
    { id: 'n3', title: 'Emergency Response Drill', tag: 'Update', length: '1.5h', provider: 'Safety Board', type: 'Drill', level: 'All Levels' },
    { id: 'n4', title: 'Eco Efficiency & Energy Use', tag: 'New', length: '2h', provider: 'Ops Performance', type: 'Module', level: 'Beginner' }
  ];
  return (
    <section id="new-courses" className="py-10 md:py-14 bg-white">
  <div className="max-w-[1380px] mx-auto px-5 sm:px-6 md:px-10">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-lg md:text-xl font-semibold text-slate-900 tracking-tight">New & Updated</h2>
          <a href="#" className="text-blue-600 text-xs md:text-sm hover:text-blue-700 font-medium">All updates</a>
        </div>
        <div className="overflow-x-auto -mx-5 sm:mx-0 pb-3 scrollbar-thin scrollbar-thumb-slate-200/70 hover:scrollbar-thumb-slate-300">
          <div className="flex gap-6 px-5 sm:px-0 min-w-max">
            {items.map(it => (
              <article
                key={it.id}
                className="group w-72 flex-shrink-0 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-lg hover:border-blue-500 transition-all duration-200 overflow-hidden"
              >
                {/* Image (placeholder using existing crane asset). Could be replaced with course thumbnail later */}
                <div className="relative h-36 bg-gradient-to-br from-blue-100 via-blue-50 to-white flex items-center justify-center overflow-hidden">
                  <img
                    src="/crane-truck.png"
                    alt="Course preview"
                    className="absolute inset-0 w-full h-full object-cover object-center opacity-90 group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/0 mix-blend-multiply" />
                  <div className="absolute top-2 left-2 flex gap-2">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${it.tag === 'New' ? 'bg-blue-600 text-white border-blue-600' : 'bg-amber-500/10 text-amber-700 border-amber-300'}`}>{it.tag}</span>
                  </div>
                  <span className="absolute bottom-2 left-2 text-[10px] font-medium px-2 py-0.5 rounded bg-white/80 backdrop-blur text-slate-700 border border-white/60">{it.length}</span>
                </div>
                <div className="p-4 flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-md bg-blue-50 border border-blue-100 flex items-center justify-center text-[10px] font-semibold text-blue-700">LSS</div>
                    <p className="text-[11px] font-medium text-slate-500 line-clamp-1">{it.provider}</p>
                  </div>
                  <h3 className="font-semibold text-[14px] leading-snug text-slate-900 group-hover:text-blue-700 line-clamp-3">{it.title}</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">{it.type}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">{it.level}</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <button className="text-[11px] font-medium px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-500 transition-colors">Enroll</button>
                    <button className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1">Details<span aria-hidden>→</span></button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
