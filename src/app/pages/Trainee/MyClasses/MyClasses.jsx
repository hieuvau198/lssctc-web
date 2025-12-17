import { Empty, Spin } from 'antd';
import { BookOpen, Calendar, Clock, ChevronRight, GraduationCap } from 'lucide-react';
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
  const [tab, setTab] = useState('in-progress');
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  const authState = useAuthStore();
  const traineeIdFromStore = authState.nameid;

  useEffect(() => {
    const fetchClasses = async () => {
      const token = getAuthToken();
      const decoded = token ? decodeToken(token) : null;
      const resolvedTraineeId = traineeIdFromStore || decoded?.nameid;

      if (!resolvedTraineeId) {
        setLoading(false);
        setPrograms([]);
        return;
      }

      try {
        setLoading(true);
        const data = await getLearningClassesByTraineeId(resolvedTraineeId);

        const filtered =
          tab === 'completed'
            ? data.filter((c) => c.classProgress === 100)
            : data.filter((c) => c.classProgress < 100);

        const mapped = filtered.map((c) => ({
          id: c.id,
          provider: 'Global Crane Academy',
          name: c.name,
          progress: c.classProgress ?? 0,
          badge: c.status,
          _statusMapped: c.status,
          completedAt: c.endDate,
          classCode: c.classCode,
          description: c.description,
          startDate: c.startDate,
          endDate: c.endDate,
          durationHours: c.durationHours,
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
    <div className="min-h-screen bg-white">
      {/* Hero Section - Industrial Style */}
      <section className="relative bg-black text-white py-12 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/crane-background.jpg";
            }}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative max-w-7xl mx-auto px-6">
          <PageNav
            nameMap={{ 'my-classes': 'My Classes' }}
            className="mb-6 [&_a]:text-white/80 [&_a:hover]:text-yellow-400 [&_span]:text-white [&_svg]:text-white/60"
          />

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="mb-4 flex items-center gap-4">
                <span className="text-sm tracking-widest text-white uppercase font-bold" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                  LSSCTC ACADEMY
                </span>
                <span className="h-1 w-1 rounded-full bg-yellow-400" />
                <span className="px-4 py-1 bg-yellow-400 text-black text-xs font-bold tracking-wider uppercase">
                  Lớp học
                </span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tight mb-4 text-white drop-shadow-xl" style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.9)' }}>
                {t('trainee.myLearning.title')}
              </h1>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-3 bg-black/50 backdrop-blur-sm px-4 py-3">
              <div className="w-10 h-10 bg-yellow-400 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-black" />
              </div>
              <div>
                <div className="text-2xl font-black text-white">{programs.length}</div>
                <div className="text-xs text-yellow-400 uppercase tracking-wider font-semibold">
                  {tab === 'in-progress' ? t('trainee.inProgress') : t('trainee.completed')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Area */}
      <section className="py-12 bg-neutral-50 border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="mb-10">
            <span className="text-sm tracking-widest text-neutral-500 uppercase font-bold block mb-2">
              Danh sách
            </span>
            <h2 className="text-4xl font-black uppercase tracking-tight mb-2">
              Các lớp đang học
            </h2>
            <div className="h-1 w-24 bg-yellow-400" />
          </div>

          {/* Loading State */}
          {loading && (
            <div className="min-h-[400px] flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent animate-spin mb-4" />
              <p className="text-neutral-500 uppercase tracking-wider font-semibold">{t('common.loading')}</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && programs.length === 0 && (
            <div className="min-h-[400px] flex flex-col items-center justify-center">
              <div className="w-24 h-24 bg-neutral-200 flex items-center justify-center mb-6">
                <GraduationCap className="w-12 h-12 text-neutral-400" />
              </div>
              <p className="text-neutral-900 text-lg font-black uppercase">{t('trainee.myLearning.noClasses')}</p>
              <p className="text-neutral-500 text-sm mt-2">Hãy đăng ký một khóa học để bắt đầu</p>
            </div>
          )}

          {/* Course Cards Grid */}
          {!loading && programs.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {programs.map((p, index) => (
                <Link
                  key={p.id}
                  to={`/my-classes/${p.id}`}
                  className="group block"
                >
                  <div className="bg-white border-2 border-neutral-900 hover:border-yellow-400 overflow-hidden transition-all duration-300">
                    {/* Status bar */}
                    <div className={`h-2 ${p._statusMapped && getClassStatus(p._statusMapped).color === 'green' ? 'bg-yellow-400' : 'bg-neutral-200'}`} />

                    {/* Card Content */}
                    <div className="p-5">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 bg-yellow-400 flex items-center justify-center text-black font-black text-sm">
                            {index + 1}
                          </span>
                          <div>
                            <div className="text-xs text-neutral-500 font-bold uppercase tracking-wider">
                              {p.classCode}
                            </div>
                            <h3 className="text-lg font-black text-neutral-900 uppercase line-clamp-2 group-hover:text-yellow-600 transition-colors">
                              {p.name}
                            </h3>
                          </div>
                        </div>
                        {p._statusMapped && (() => {
                          const s = getClassStatus(p._statusMapped);
                          return (
                            <span className={`px-2 py-0.5 text-xs font-bold uppercase tracking-wider flex-shrink-0 ${s.color === 'green' ? 'bg-yellow-400 text-black' : 'bg-neutral-100 text-neutral-600'}`}>
                              {s.label}
                            </span>
                          );
                        })()}
                      </div>

                      {/* Info Grid */}
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-8 h-8 bg-yellow-400 flex items-center justify-center">
                            <Calendar className="w-4 h-4 text-black" />
                          </div>
                          <div>
                            <div className="text-neutral-500 text-xs uppercase font-bold">{t('trainee.startDate')}</div>
                            <div className="text-neutral-900 font-semibold">{new Date(p.startDate).toLocaleDateString('vi-VN')}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-8 h-8 bg-neutral-200 flex items-center justify-center">
                            <Calendar className="w-4 h-4 text-neutral-600" />
                          </div>
                          <div>
                            <div className="text-neutral-500 text-xs uppercase font-bold">{t('trainee.endDate')}</div>
                            <div className="text-neutral-900 font-semibold">{new Date(p.endDate).toLocaleDateString('vi-VN')}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-8 h-8 bg-neutral-200 flex items-center justify-center">
                            <Clock className="w-4 h-4 text-neutral-600" />
                          </div>
                          <div>
                            <div className="text-neutral-500 text-xs uppercase font-bold">{t('trainee.duration')}</div>
                            <div className="text-neutral-900 font-semibold">{p.durationHours} {t('common.hours')}</div>
                          </div>
                        </div>
                      </div>

                      {/* Action Hint */}
                      <div className="flex items-center justify-end gap-1.5 text-sm font-bold text-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-4 uppercase tracking-wider">
                        <span>{t('trainee.viewDetails') || 'Xem chi tiết'}</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
