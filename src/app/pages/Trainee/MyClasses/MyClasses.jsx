import { Card, Empty, Progress, Segmented, Skeleton, Spin, Tag } from 'antd';
import { BookOpen } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { getLearningClassesByTraineeId } from '../../../apis/Trainee/TraineeClassApi';
import PageNav from '../../../components/PageNav/PageNav';
import { getAuthToken } from '../../../libs/cookies';
import { decodeToken } from '../../../libs/jwtDecode';
import useAuthStore from '../../../store/authStore';
import { getClassStatus } from '../../../utils/classStatus';


export default function MyClasses() {
  const { t } = useTranslation();
  const [tab, setTab] = useState('in-progress'); // 'in-progress' | 'completed'
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  const authState = useAuthStore();
  const traineeIdFromStore = authState.nameid;

  useEffect(() => {
    const fetchClasses = async () => {
      // Resolve traineeId: prefer store, fallback to decoding token cookie (handles zustand hydrate race)
      const token = getAuthToken();
      const decoded = token ? decodeToken(token) : null;
      const resolvedTraineeId = traineeIdFromStore || decoded?.nameid;

      // Guard: Don't fetch if traineeId isn't available yet
      if (!resolvedTraineeId) {
        setLoading(false);
        setPrograms([]);
        return;
      }

      try {
        setLoading(true);
        const data = await getLearningClassesByTraineeId(resolvedTraineeId);

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
          _statusMapped: c.status,
          color: 'from-cyan-500 to-blue-600',
          completedAt: c.endDate,
          classCode: c.classCode, // Assuming the API provides this field
          description: c.description, // Assuming the API provides this field
          startDate: c.startDate, // Assuming the API provides this field
          endDate: c.endDate, // Assuming the API provides this field
          durationHours: c.durationHours, // Assuming the API provides this field
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
  }, [tab, traineeIdFromStore]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <PageNav nameMap={{ 'my-program': 'My Program' }} />
      <div className="mt-2 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 mb-4">{t('trainee.myLearning.title')}</h1>
          <Segmented
            options={[
              { label: t('trainee.myLearning.inProgressTab'), value: 'in-progress' },
              { label: t('trainee.myLearning.completedTab'), value: 'completed' },
            ]}
            value={tab}
            onChange={setTab}
            className="bg-slate-100"
          />
        </div>

        {loading && (
          <div className="min-h-screen flex items-center justify-center">
            <Spin tip={t('common.loading')}/>
          </div>
        )}

        {!loading && programs.length === 0 && (
          <div className="min-h-screen flex items-center justify-center">
            <Empty description={t('trainee.myLearning.noClasses')} className="py-16" />
          </div>
        )}

        {!loading && programs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {programs.map((p) => (
              <div key={p.id}>
                <Link to={`/my-classes/${p.id}`}>
                  <Card
                    className="group rounded-xl shadow-md border hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden relative cursor-pointer bg-white h-full"
                    bodyStyle={{ padding: '0' }}
                  >
                    {/* Top gradient bar */}
                    <div className="h-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600" />
                    
                    {/* Card body */}
                    <div className="p-4 space-y-3">
                      {/* Header section */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <span className="text-base font-bold text-slate-900 leading-tight line-clamp-2 group-hover:text-cyan-600 transition-colors">
                            {p.name}
                          </span>
                          <div className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">
                            {p.classCode}
                          </div>
                        </div>
                        {p._statusMapped && (() => {
                          const s = getClassStatus(p._statusMapped);
                          return (
                            <Tag color={s.color} className="text-xs font-semibold mt-8 shrink-0">
                              {s.label}
                            </Tag>
                          );
                        })()}
                      </div>

                      {/* Info section */}
                      <div className="space-y-2 text-xs text-slate-600">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-700">{t('trainee.startDate')}:</span>
                          <span>{new Date(p.startDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-700">{t('trainee.endDate')}:</span>
                          <span>{new Date(p.endDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-700">{t('trainee.duration')}:</span>
                          <span>{p.durationHours} {t('common.hours')}</span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      {/* <div className="pt-2 border-t border-slate-100">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                            <BookOpen className="w-3.5 h-3.5 text-cyan-500" />
                            <span>{t('trainee.progress')}</span>
                          </div>
                          <span className="text-xs font-bold text-cyan-600">{p.progress}%</span>
                        </div>
                        <Progress
                          percent={p.progress}
                          showInfo={false}
                          strokeColor={{
                            '0%': '#06b6d4',
                            '100%': '#3b82f6',
                          }}
                          trailColor="#e2e8f0"
                          strokeWidth={6}
                        />
                      </div> */}
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
