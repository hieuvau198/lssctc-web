import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Skeleton, Empty, Card } from 'antd';
import { GraduationCap, Sparkles } from 'lucide-react';
import { fetchPrograms } from '../../../apis/Trainee/TraineeProgramApi';
import ProgramCard from '../../../components/ProgramCard';

export default function MainCoursesSection() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetchPrograms({ PageNumber: 1, PageSize: 10, IsActive: true })
      .then((res) => {
        if (cancelled) return;
        const items = res?.items || res?.data || [];
        setPrograms(items.slice(0, 5));
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setPrograms([]);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="programs" className="py-8 md:py-10 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-[1380px] mx-auto px-5 sm:px-6 md:px-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div>
              <span className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">{t('home.programs.title')}</span>
              <p className="text-sm text-slate-500">{t('home.programs.subtitle', 'Chương trình đào tạo phổ biến')}</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-cyan-100 to-blue-100 rounded-full">
            <Sparkles className="w-4 h-4 text-cyan-600" />
            <span className="text-xs font-medium text-cyan-700">{t('home.programs.featured', 'Nổi bật')}</span>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="rounded-xl border-slate-200">
                <Skeleton.Image active className="!w-full !h-40 mb-4" />
                <Skeleton active paragraph={{ rows: 3 }} />
              </Card>
            ))}
          </div>
        ) : programs.length === 0 ? (
          <Empty description={t('home.programs.noPrograms')} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {programs.map((prog) => (
              <ProgramCard
                key={prog.id}
                program={prog}
                onClick={() => {
                  try {
                    if (window && window.top) {
                      window.top.location.href = `/program/${prog.id}`;
                      return;
                    }
                  } catch (e) { }
                  navigate(`/program/${prog.id}`);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
