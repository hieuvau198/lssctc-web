import React from 'react';

const PROGRAMS = [
  {
    id: 1,
    name: 'Crane Operator Fundamentals',
    durationHours: 24,
    totalCourses: 6,
    imageUrl:
      'https://www.mazzellacompanies.com/wp-content/uploads/2020/11/article-crane-operator-training-competent-qualified.jpg',
  },
  {
    id: 2,
    name: 'Container Yard Operations',
    durationHours: 18,
    totalCourses: 4,
    imageUrl:
      'https://images.unsplash.com/photo-1586769852044-692d6e3703f6?q=80&w=1470&auto=format&fit=crop',
  },
  {
    id: 3,
    name: 'Safety & Compliance Basics',
    durationHours: 12,
    totalCourses: 3,
    imageUrl:
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1470&auto=format&fit=crop',
  },
];

export default function PopularProgram() {
  return (
    <section className="py-10">
      <div className="max-w-[1380px] mx-auto px-4">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Popular Programs</h2>
            <p className="text-slate-500 mt-1">Top picks curated for trainees</p>
          </div>
          <a href="#" className="text-blue-600 hover:text-blue-700 text-sm">View all</a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROGRAMS.map((p) => (
            <article key={p.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-[16/9] w-full bg-slate-100">
                <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-slate-900 line-clamp-1">{p.name}</h3>
                <div className="mt-2 flex items-center gap-3 text-sm text-slate-600">
                  <span>{p.totalCourses} courses</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                  <span>{p.durationHours} hrs</span>
                </div>
                <div className="mt-4">
                  <button className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-md border border-slate-300 hover:bg-slate-50">
                    Explore
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
