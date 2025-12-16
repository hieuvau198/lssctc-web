import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Skeleton, Empty, Card } from 'antd';
import { ChevronRight, Sparkles } from 'lucide-react';
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
    <section id="programs" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-sm tracking-widest text-neutral-500 uppercase font-bold block mb-2">
              {t('home.programs.subtitle', 'Chương trình đào tạo')}
            </span>
            <h2 className="text-4xl font-black uppercase tracking-tight mb-2">
              {t('home.programs.title')}
            </h2>
            <div className="h-1 w-24 bg-yellow-400" />
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">{t('home.programs.featured', 'Nổi bật')}</span>
            </div>
            <a
              href="/program"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-neutral-900 text-black font-bold uppercase tracking-wider text-sm hover:bg-yellow-400 hover:border-yellow-400 transition-all group"
            >
              Xem tất cả
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        {/* Programs grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="border-2 border-neutral-200">
                <Skeleton.Image active className="!w-full !h-40 mb-4" />
                <Skeleton active paragraph={{ rows: 3 }} />
              </Card>
            ))}
          </div>
        ) : programs.length === 0 ? (
          <div className="py-16 text-center">
            <Empty
              description={
                <span className="text-neutral-500">{t('home.programs.noPrograms')}</span>
              }
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {programs.map((prog) => (
              <div
                key={prog.id}
                className="group"
              >
                <ProgramCard
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
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
