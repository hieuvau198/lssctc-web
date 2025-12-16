import React from 'react';
import { ChevronRight } from 'lucide-react';

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
    <section className="py-16 bg-neutral-50 border-y border-neutral-200">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="mb-10">
          <span className="text-sm tracking-widest text-neutral-500 uppercase font-bold block mb-2">
            Đội ngũ giảng viên
          </span>
          <h2 className="text-4xl font-black uppercase tracking-tight mb-2">
            Program Instructors
          </h2>
          <div className="h-1 w-24 bg-yellow-400" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {INSTRUCTORS.map((i) => (
            <article key={i.id} className="bg-white border-2 border-neutral-900 hover:border-yellow-400 transition-all group">
              {/* Status bar */}
              <div className="h-2 bg-neutral-100 group-hover:bg-yellow-400 transition-colors" />

              <div className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 border-4 border-yellow-400 overflow-hidden flex-shrink-0">
                    <img src={i.avatar} alt={i.name} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase text-neutral-900 group-hover:text-yellow-600 transition-colors">{i.name}</h3>
                    <p className="text-sm text-neutral-500 uppercase tracking-wider font-semibold">{i.title}</p>
                  </div>
                </div>
                <div className="mt-5">
                  <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold uppercase tracking-wider border-2 border-neutral-900 hover:bg-yellow-400 hover:border-yellow-400 transition-all group/btn">
                    View profile
                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
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
