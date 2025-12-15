import { Empty, Progress, Spin, Tag } from 'antd';
import { BookOpen, Calendar, Clock, ArrowRight, GraduationCap } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Breadcrumb */}
        <PageNav nameMap={{ 'my-program': 'My Program' }} />

        <div className="mt-1 space-y-2">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent mb-2">
                {t('trainee.myLearning.title')}
              </span>
            </div>

            {/* Stats Cards */}
            <div className="flex gap-4">
              <div className="bg-white/80 flex items-center justify-center gap-2 border border-slate-200 backdrop-blur-sm rounded-2xl px-5 py-4 shadow-lg shadow-slate-200/50">
                <div className="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">{programs.length}</div>
                <div className="text-sm text-slate-500 font-medium">{tab === 'in-progress' ? t('trainee.inProgress') : t('trainee.completed')}</div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="min-h-[400px] flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-cyan-200 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
              <p className="text-slate-500">{t('common.loading')}</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && programs.length === 0 && (
            <div className="min-h-[400px] flex flex-col items-center justify-center">
              <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <GraduationCap className="w-12 h-12 text-slate-400" />
              </div>
              <p className="text-slate-600 text-lg font-medium">{t('trainee.myLearning.noClasses')}</p>
              <p className="text-slate-400 text-sm mt-2">Hãy đăng ký một khóa học để bắt đầu</p>
            </div>
          )}

          {/* Course Cards Grid */}
          {!loading && programs.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {programs.map((p) => (
                <Link
                  key={p.id}
                  to={`/my-classes/${p.id}`}
                  className="group block"
                >
                  <div className="relative bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-500/10 hover:border-cyan-300/50 h-full shadow-lg shadow-slate-200/50">
                    {/* Gradient Top Bar */}
                    <div className="h-1.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500" />

                    {/* Card Content */}
                    <div className="px-5 py-3 space-y-2">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-cyan-600 font-semibold uppercase tracking-wider mb-1">
                            {p.classCode}
                          </div>
                          <h3 className="text-lg font-bold text-slate-800 leading-snug line-clamp-2 group-hover:text-cyan-600 transition-colors duration-300">
                            {p.name}
                          </h3>
                        </div>
                        {p._statusMapped && (() => {
                          const s = getClassStatus(p._statusMapped);
                          return (
                            <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold ${s.color === 'green' ? 'bg-emerald-100 text-emerald-700' :
                              s.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                                s.color === 'orange' ? 'bg-amber-100 text-amber-700' :
                                  'bg-slate-100 text-slate-600'
                              }`}>
                              {s.label}
                            </span>
                          );
                        })()}
                      </div>

                      {/* Info Grid */}
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-50 to-cyan-100/80 flex items-center justify-center shadow-sm">
                            <Calendar className="w-4 h-4 text-cyan-600" />
                          </div>
                          <div>
                            <div className="text-slate-400 text-xs font-medium">{t('trainee.startDate')}</div>
                            <div className="text-slate-700 font-semibold">{new Date(p.startDate).toLocaleDateString('vi-VN')}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/80 flex items-center justify-center shadow-sm">
                            <Calendar className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="text-slate-400 text-xs font-medium">{t('trainee.endDate')}</div>
                            <div className="text-slate-700 font-semibold">{new Date(p.endDate).toLocaleDateString('vi-VN')}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100/80 flex items-center justify-center shadow-sm">
                            <Clock className="w-4 h-4 text-indigo-600" />
                          </div>
                          <div>
                            <div className="text-slate-400 text-xs font-medium">{t('trainee.duration')}</div>
                            <div className="text-slate-700 font-semibold">{p.durationHours} {t('common.hours')}</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Hint */}
                      <div className="flex items-center justify-end gap-1.5 text-sm font-semibold text-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span>{t('trainee.viewDetails') || 'Xem chi tiết'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
