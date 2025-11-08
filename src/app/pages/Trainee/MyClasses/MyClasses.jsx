// src/app/pages/Trainee/MyClasses/MyClasses.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Skeleton, Tag, Progress, Empty, Segmented } from 'antd';
import { BookOpen } from 'lucide-react';
import PageNav from '../../../components/PageNav/PageNav';
import { getLearningClassesByTraineeId  } from '../../../apis/Trainee/TraineeClassApi';
import useAuthStore from '../../../store/authStore'; // <-- IMPORT AUTH STORE


export default function MyClasses() {
  const [tab, setTab] = useState('in-progress'); // 'in-progress' | 'completed'
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  const traineeId = useAuthStore((state) => state.nameid); // <-- USE ID FROM STORE

  useEffect(() => {
    const fetchClasses = async () => {
      // Guard: Don't fetch if traineeId isn't loaded yet
      if (!traineeId) {
        setLoading(false);
        setPrograms([]);
        return;
      }

      try {
        setLoading(true);
        const data = await getLearningClassesByTraineeId(traineeId);

        // Filter classes based on progress (simulate your "In Progress" / "Completed" tabs)
        const filtered =
          tab === 'completed'
            ? data.filter((c) => c.classProgress === 100)
            : data.filter((c) => c.classProgress < 100);

        // Map API data to your UI structure
        const mapped = filtered.map((c) => ({
          id: c.id,
          provider: 'Global Crane Academy', // Optional — placeholder until API provides this
          name: c.name,
          progress: c.classProgress ?? 0,
          badge: c.status,
          color: 'from-cyan-500 to-blue-600',
          completedAt: c.endDate,
        }));

        setPrograms(mapped);
      } catch (error) {
        console.error('Failed to fetch trainee classes:', error);
        setPrograms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [tab, traineeId]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <PageNav nameMap={{ 'my-program': 'My Program' }} />
      <div className="mt-2 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 mb-4">My Learning</h1>
          <Segmented
            options={[
              { label: 'In Progress', value: 'in-progress' },
              { label: 'Completed', value: 'completed' },
            ]}
            value={tab}
            onChange={setTab}
            className="bg-slate-100"
          />
        </div>

        {loading && (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="rounded-xl shadow-sm">
                <Skeleton active paragraph={{ rows: 2 }} />
              </Card>
            ))}
          </div>
        )}

        {!loading && programs.length === 0 && (
          <Empty description="No classes found" className="py-16" />
        )}

        {!loading && programs.length > 0 && (
          <div className="space-y-6">
            {programs.map((p) => (
              <div className="my-4" key={p.id}>
                <Link to={`/my-classes/${p.id}`}>
                  <Card className="group rounded-2xl border hover:shadow-lg transition-all duration-300 overflow-hidden relative cursor-pointer">
                    <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r opacity-80 from-transparent via-slate-200 to-transparent" />
                    <div className="flex">
                      <div className="flex-1 p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <div className="text-xs text-slate-500 mb-0.5">
                                  {p.provider}
                                </div>
                                {p.badge && (
                                  <span className="text-[10px] uppercase tracking-wide font-semibold bg-slate-900 text-white px-2 py-0.5 rounded-full">
                                    {p.badge}
                                  </span>
                                )}
                              </div>
                              <h3 className="text-lg font-semibold text-slate-900 leading-snug m-0 line-clamp-2 group-hover:text-slate-700 transition">
                                {p.name}
                              </h3>
                              <div className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-600">
                                <BookOpen className="w-4 h-4" />
                                <span>{p.progress}% complete</span>
                              </div>
                              <div className="mt-3">
                                <Progress
                                  percent={p.progress}
                                  showInfo={false}
                                  strokeColor="#0f766e"
                                  trailColor="#e2e8f0"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="ml-4">
                            {p.progress === 100 && (
                              <Tag color="green" className="m-0">
                                Completed
                              </Tag>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
