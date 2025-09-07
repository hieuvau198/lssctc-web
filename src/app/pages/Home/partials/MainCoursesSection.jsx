import React from 'react';

// Highlighted main courses (static mock list)
export default function MainCoursesSection() {
  const courses = [
    { id: 1, title: 'Fundamentals of Port Crane Operation', lvl: 'Beginner', duration: '6h', tag: 'Core' },
    { id: 2, title: 'Advanced Container Handling & Yard Flow', lvl: 'Intermediate', duration: '8h', tag: 'Advanced' },
    { id: 3, title: 'Safety & Incident Prevention Workshop', lvl: 'All Levels', duration: '4h', tag: 'Safety' }
  ];
  return (
    <section id="courses" className="py-14 md:py-18 bg-slate-50">
  <div className="max-w-[1380px] mx-auto px-5 sm:px-6 md:px-10">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="text-xl md:text-2xl font-semibold text-slate-900 tracking-tight">Featured Courses</h2>
          <a href="#" className="text-blue-600 text-sm hover:text-blue-700 font-medium">Browse catalog</a>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {courses.map(c => (
            <div key={c.id} className="group flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-blue-500 hover:shadow-md transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] tracking-widest font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">{c.tag}</span>
                <span className="text-[11px] text-slate-500">{c.duration}</span>
              </div>
              <h3 className="font-semibold text-sm md:text-base text-slate-900 leading-snug line-clamp-3">{c.title}</h3>
              <p className="mt-2 text-[11px] text-slate-600">Level: {c.lvl}</p>
              <div className="mt-4 flex gap-2">
                <button className="text-xs font-medium px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-500 transition-colors">Enroll</button>
                <button className="text-xs font-medium px-3 py-1 rounded border border-slate-300 text-slate-700 hover:bg-slate-100">Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
