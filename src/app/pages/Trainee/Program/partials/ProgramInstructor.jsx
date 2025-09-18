import React from 'react';

const INSTRUCTORS = [
  {
    id: 1,
    name: 'Alex Nguyen',
    title: 'Senior Crane Operator',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1470&auto=format&fit=crop',
  },
  {
    id: 2,
    name: 'Minh Tran',
    title: 'Safety Compliance Lead',
    avatar:
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=1470&auto=format&fit=crop',
  },
  {
    id: 3,
    name: 'Lan Pham',
    title: 'Operations Supervisor',
    avatar:
      'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=1470&auto=format&fit=crop',
  },
];

export default function ProgramInstructor() {
  return (
    <section className="py-10 bg-slate-50">
      <div className="max-w-[1380px] mx-auto px-4">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Program Instructors</h2>
            <p className="text-slate-500 mt-1">Experienced professionals and mentors</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {INSTRUCTORS.map((i) => (
            <article key={i.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-center gap-4">
                <img src={i.avatar} alt={i.name} className="w-14 h-14 rounded-full object-cover" loading="lazy" />
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{i.name}</h3>
                  <p className="text-sm text-slate-600">{i.title}</p>
                </div>
              </div>
              <div className="mt-4">
                <button className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-md border border-slate-300 hover:bg-slate-50">View profile</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
